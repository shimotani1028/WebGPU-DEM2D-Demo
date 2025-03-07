(async () => {

  const params = new URLSearchParams(location.search);
  // URLからパラメータを取得する。なければデフォルト値を代入(例:***?balls=16000&min_radius=0.015&max_radius=0.02)
  function parameter(name, def) {
    if (!params.has(name)) return def;
    return parseFloat(params.get(name));
  }
  // GPUが使用可能化どうか
  if (!("gpu" in navigator)) fatal("WebGPU not supported. Please enable it in about:flags in Chrome or in about:config in Firefox.");

  // GPUの仕様を確認する
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) fatal("Couldn’t request WebGPU adapter.");
  const { maxBufferSize, maxStorageBufferBindingSize } = adapter.limits;
  // 最大バッファサイズの確認
  console.log("maxBufferSize= ",maxBufferSize);
  console.log("maxStorageBufferBindingSize= ",maxStorageBufferBindingSize);

  // GPUの制限を変更する
  const device = await adapter.requestDevice({
    requiredLimits: {
      maxStorageBuffersPerShaderStage: 10, // stragebufferの上限を引き上げる(エラー例:The number of storage buffers (12) in the Compute stage exceeds the maximum per-stage limit (10))
    },
  });
  if (!device) fatal("Couldn’t request WebGPU device.");
  console.log("device limit= ",device.limits);

  // canvas要素に関するパラメータ
  const canvas = document.getElementById("webgpuCanvas");//document.querySelector("canvas"); // 描画するキャンバス要素
  const width = parameter("width", 1000); // キャンバスの幅(px)
  const height = parameter("height", 500); // キャンバスの高さ(px)
  canvas.width = width; // キャンバスの幅(px)
  canvas.height = height; // キャンバスの高さ(px)
  const ctx = canvas.getContext("webgpu"); // "webgpu"コンテキストを取得
  // キャンバスのサイズ設定（属性とスタイル両方を設定）
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  const widthLength = parameter("width_length", 36.0); // canvas要素のwidthに対する実際の長さ(m)

  // 線分要素に関するパラメータ
  const NUM_LINES = 1; //parameter("line", 1); // 線分数
  const LINE_BUFFER_COUNT = 10; // 線分に対する必要な要素(位置、速度、...)
  const LINE_BUFFER_SIZE = NUM_LINES * LINE_BUFFER_COUNT * Float32Array.BYTES_PER_ELEMENT; // 線分の配列に必要なバッファサイズ
  const x1 = parameter("x1", 9.2); // canvas要素のwidthに対する実際の長さ(m)
  const y1 = parameter("y1", 0.0); // canvas要素のwidthに対する実際の長さ(m)
  const x2 = parameter("x2", 9.2); // canvas要素のwidthに対する実際の長さ(m)
  const y2 = parameter("y2", 16.0); // canvas要素のwidthに対する実際の長さ(m)

  // 粒子要素に関するパラメータ
  const NUM_BALLS = parameter("balls", 10000); // 粒子数
  const BUFFER_COUNT = 8; // 粒子に対する必要な要素(位置、速度、...)
  const BUFFER_SIZE = NUM_BALLS * BUFFER_COUNT * Float32Array.BYTES_PER_ELEMENT; // 粒子の配列に必要なバッファサイズ
  const minRadius = clamp(parameter("min_radius", 0.02), 0.02, 0.1); // 最小粒子半径
  const maxRadius = clamp(parameter("max_radius", 0.04), minRadius, 0.1); // 最大粒子半径

  // 粒子を格納する格子に関するパラメータ
  const spacing = 2 * 2 * maxRadius + 0.001; // 格子間隔(最大直径の2倍は境界で処理がうまくできない場合があるので、少し余裕を持たせる
  const nx = Math.ceil(widthLength / spacing); // x方向の格子点数
  const grid_size = Math.ceil(spacing / (2 * minRadius)) ** 2; // 格子ごとのサイズ
  const GL_BUFFER_SIZE = nx * Math.ceil(nx * ctx.canvas.height / ctx.canvas.width) * grid_size * Uint32Array.BYTES_PER_ELEMENT; // 粒子iが接触する粒子jのインデックスを格納する配列に必要なバッファサイズ
  const GL_ATOMIC_BUFFER_SIZE = nx * Math.ceil(nx * ctx.canvas.height / ctx.canvas.width) * Uint32Array.BYTES_PER_ELEMENT; // 粒子iが接触する粒子の数を格納する配列に必要なバッファサイズ
  
  const theta = 2 * Math.atan(minRadius / Math.sqrt(((minRadius + maxRadius) ** 2 - minRadius ** 2))); // 最大粒子径に接触する2つの最小粒子の最大粒子の中心からの角度
  const maxContactParticleNumber = Math.ceil(2 * Math.PI / theta); // 最大半径の粒子の周りに接触できる最小半径の粒子の数(一応切り上げる)(2次元)
  const EF_BUFFER_SIZE = (NUM_BALLS * (maxContactParticleNumber + 4 + NUM_LINES)) * 2 * Float32Array.BYTES_PER_ELEMENT; // 接触力を保存する配列に必要なバッファサイズ。*2はxとy, ＋4は上下左右の壁の分
  const EF_INDEX_BUFFER_SIZE = (NUM_BALLS * (maxContactParticleNumber)) * Uint32Array.BYTES_PER_ELEMENT; // 接触力の相手の粒子のインデックスを保存するためのバッファサイズ 

  // その他のパラメータ  
  let fps = 30.0; // フレームレート
  const dt = 5.0e-4
  let offsetX = 0;  // ズーム(拡大・縮小)に関するパラメータ
  let offsetY = 0;  // ズーム(拡大・縮小)に関するパラメータ
  let zoomValue = 1.0; // ズーム(拡大・縮小)に関するパラメータ
  let colorMode = 0;  // カラーモード

  canvas.style.cursor = "grab"; // デフォルトを grab に設定
  let isDragging = false; // マウスのドラッグ判定
  let lastMouseX = 0; // マウスのgrab位置Xの保存用
  let lastMouseY = 0; // マウスのgrab位置Yの保存用
  
  const enableLineCheckbox = document.getElementById("enableLine"); // チェックボックス
  const overlayCanvas = document.getElementById("overlayCanvas"); // overlay 用キャンバス
  const modeRadioId = document.getElementById("modeId"); // ラジオボタン(粒子番号)
  const modeRadioVabs = document.getElementById("modeVabs"); // ラジオボタン(速度(絶対値))
  const startButton = document.getElementById("start"); // スタートボタン
  const resetButton = document.getElementById("reset"); // リセットボタン
  const stopButton = document.getElementById("stop"); // スタートボタン
  const resetViewButton = document.getElementById("reset_view"); // 描画リセットボタン

  // sceneバッファの初期化処理(zoomValueやcolorModeはグローバル変数で変更されることがある)
  function initializeSceneBuffer() {
    return new Float32Array([
      ctx.canvas.width,
      ctx.canvas.height,
      widthLength,
      fps,
      minRadius,
      maxRadius,
      nx,
      grid_size,
      spacing,
      NUM_BALLS,
      maxContactParticleNumber,
      // offsetX, offsetY を追加
      offsetX,
      offsetY,
      // 最後にズーム係数
      zoomValue,
      // カラーモード
      colorMode,
    ])
  }

  // 初期化用のバッファデータを用意(粒子半径はランダムであるため、読み込み時に固定する)
  // 各粒子の初期値を定義
  let inputBalls = new Float32Array(new ArrayBuffer(BUFFER_SIZE));
  for (let i = 0; i < NUM_BALLS; i++) {
    inputBalls[i * BUFFER_COUNT + 0] = random(minRadius, maxRadius); //radius;
    inputBalls[i * BUFFER_COUNT + 2] = maxRadius + (i) % (widthLength / (maxRadius * 2 * 4)) * maxRadius * 2;//random(0, ctx.canvas.width);
    inputBalls[i * BUFFER_COUNT + 3] = maxRadius + Math.floor((i) / (widthLength / (maxRadius * 2 * 4))) * maxRadius * 2;//random(0, ctx.canvas.height);
    inputBalls[i * BUFFER_COUNT + 4] = 0;
    inputBalls[i * BUFFER_COUNT + 5] = 0;
    inputBalls[i * BUFFER_COUNT + 6] = 0.0;
    inputBalls[i * BUFFER_COUNT + 7] = 0.0;
  }
  // 粒子要素の初期化処理
  function initializeInputBallsBuffer(){
    return inputBalls;
  }

  // 線分要素の初期化処理
  function initializeInputLinesBuffer() {
    // 線分要素の配列
    let inputLines = new Float32Array(new ArrayBuffer(LINE_BUFFER_SIZE)); //32bitは4byteなので、4の整数倍のバイト数にする
    // 初期値の代入
    for (let i = 0; i < NUM_LINES; i++) {
      inputLines[i * LINE_BUFFER_COUNT + 0] = maxRadius; // 線分の厚さ
      inputLines[i * LINE_BUFFER_COUNT + 1] = 1; // 線分が有効かどうかのフラグ
      inputLines[i * LINE_BUFFER_COUNT + 2] = x1; // x1
      inputLines[i * LINE_BUFFER_COUNT + 3] = y1; // y1
      inputLines[i * LINE_BUFFER_COUNT + 4] = x2; // x2
      inputLines[i * LINE_BUFFER_COUNT + 5] = y2; // y2
      inputLines[i * LINE_BUFFER_COUNT + 6] = 0;//random(-1000, 1000); // 重心の速度x
      inputLines[i * LINE_BUFFER_COUNT + 7] = 0;//random(-1000, 1000); // 重心の速度y
      inputLines[i * LINE_BUFFER_COUNT + 8] = 90.0; // angle:角度
      inputLines[i * LINE_BUFFER_COUNT + 9] = 0.0; // angular_velocity:角速度
    }


    // 線分の初期状態をチェックボックスに合わせる
    const lineEnabled = enableLineCheckbox.checked;
    for (let i = 0; i < NUM_LINES; i++) {
      inputLines[i * LINE_BUFFER_COUNT + 1] = lineEnabled ? 1 : 0;
    }
    return inputLines;
  }

  console.log("最大接触粒子数= ", maxContactParticleNumber);
  console.log("最小粒子半径= ", minRadius);
  console.log("最大粒子半径= ", maxRadius);
  console.log("粒子数= ", NUM_BALLS);
  // console.log("線分数=", NUM_LINES);
  // console.log("x方向の格子数= ", nx);
  // console.log("格子間隔= ", spacing);
  // console.log("格子ごとのサイズ= ", grid_size);
  // console.log("BUFFER_SIZE= ", BUFFER_SIZE);
  // console.log("EF_BUFFER_SIZE= ", EF_BUFFER_SIZE);
  // console.log("GL_ATOMIC_BUFFER_SIZE= ", GL_ATOMIC_BUFFER_SIZE);
  console.log("Max buffer size= ", device.limits.maxBufferSize);


  // 推奨のcanvasフォーマットを取得
  const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
  // コンテキストに関連付ける
  ctx.configure({
    device: device, // 前で作成したWebGPUデバイスをキャンバスに関連付け
    format: canvasFormat, // 先ほど取得した最適なピクセルフォーマットを指定
  });

  // エラー内容の表示
  function fatal(msg) {
    document.body.innerHTML = `<pre>${msg}</pre>`;
    throw Error(msg);
  }


  

  const module = device.createShaderModule({
    code: `
    struct Ball {
      radius: f32,
      padding: f32,
      position: vec2<f32>,
      velocity: vec2<f32>,
      angle: f32,
      anguler_velocity: f32,
    }

    @group(0) @binding(0)
    var<storage, read_write> input: array<Ball>;

    @group(0) @binding(1)
    var<storage, read_write> output: array<Ball>;

    struct EF {
      resilience_force: vec2<f32>,
    }

    @group(0) @binding(2)
    var<storage, read_write> ef_input: array<EF>; // 復元力


    struct Scene {
      width: f32, // canvasの幅(pixel)
      height: f32, // canvasの高さ(pixel)
      L: f32, // canvasの幅(m)
      fps: f32, // フレームレート
      minRadius: f32, // 粒子の最小半径(m)
      maxRadius: f32, // 粒子の最大半径(m)
      nx: f32, // x方向の格子点数
      grid_size: f32, // 1グリッドあたりの最大要素数
      spacing: f32, // 格子間隔
      numBalls: u32, // 粒子数
      maxContactParticleNumber: f32, // 最大接触粒子数
    }

    @group(0) @binding(3)
    var<uniform> scene: Scene;

 
    @group(0) @binding(4)
    var<storage, read_write> gl_input: array<u32>;

    @group(0) @binding(5)
    var<storage, read_write> gl_output: array<u32>;

    @group(0) @binding(6)
    var<storage, read_write> gl_atomic : array<atomic<u32>>;

    @group(0) @binding(7)
    var<storage, read_write> ef_index_input: array<u32>; // 復元力の相手粒子のインデックス


    struct Line {
      thickness: f32,
      isValid: u32,
      position_1: vec2<f32>,
      position_2: vec2<f32>,
      velocity: vec2<f32>,
      angle: f32,
      anguler_velocity: f32,
    }

    @group(1) @binding(0)
    var<storage, read_write> line_input: array<Line>;

    @group(1) @binding(1)
    var<storage, read_write> line_output: array<Line>;



    const PI: f32 = 3.14159;                        // 円周率
    // const TIME_STEP: f32 = 0.0016;                   // 時間刻み(s)
    const E: f32 = 70e+4;                           // ヤング率(kN/m2) 例:70e+9
    const v: f32 = 0.35;                            // ポアソン比
    const k_n: f32 = 9.0e+6; //PI*E*(1-v)/(4*(1+v)*(1-2*v));  // 法線方向ばね定数(kN/m)
    const k_s: f32 = 3.0e+6; //PI*E/(8*(1+v));                // 接線方向ばね定数(kN/m)
    const c: f32 = 0.0;                             // みかけの粘着力(kN/m2)
    const fai: f32 = 30.0;                           // 摩擦角(°)
    const g: f32 = -9.81;                           // 重力加速度(m/s2)
    const rho: f32 = 2.5e+3;                        // 密度(kg/m3)
    const e_n: f32 = 1.0;                           // 法線方向はね返り係数
    const e_s: f32 = 1.0;                           // 接線方向はね返り係数
    const h: f32 = 0.1;                           // 係数
    const maxContactParticleNumber: u32 = ${maxContactParticleNumber};      // 最大接触粒子数(配列の要素数を固定するためここで定義する)
    const maxLineNumber: u32 = ${NUM_LINES}; // 最大線分数
    

    // eta(粘性係数)を求める(対粒子)
    fn calculationEta(m_i: f32, m_j: f32) -> vec2<f32> {
      let m_ij = 2* m_i * m_j / (m_i + m_j);
      // let eta_n = -2*log(e_n)*sqrt( ( m_ij * k_n ) / ( pow(PI, 2) + pow(log(e_n), 2) ) );
      // let eta_s = -2*log(e_s)*sqrt( ( m_ij * k_s ) / ( pow(PI, 2) + pow(log(e_s), 2) ) );
      let eta_n = h*2*sqrt(m_ij*k_n);
      let eta_s = h*2*sqrt(m_ij*k_s);
      return vec2<f32>(2.0e+3, 1.0e+3); //vec2<f32>(eta_n, eta_s);
    }

    // eta(粘性係数)を求める(対壁)
    fn calculationEtaWithWall(m_i: f32) -> vec2<f32> {
      let m_ij = m_i;
      // let eta_n = -2*log(e_n)*sqrt( ( m_ij * k_n ) / ( pow(PI, 2) + pow(log(e_n), 2) ) );
      // let eta_s = -2*log(e_s)*sqrt( ( m_ij * k_s ) / ( pow(PI, 2) + pow(log(e_s), 2) ) );
      let eta_n = h*2*sqrt(m_ij*k_n);
      let eta_s = h*2*sqrt(m_ij*k_s);
      return vec2<f32>(2.0e+3, 1.0e+3); //vec2<f32>(eta_n, eta_s);
    }

    // 衝突後の粒子同士の相対速度を求める
    fn calculationVelocityAfterCollision(position_i: vec2<f32>, velocity_i: vec2<f32>, anguler_velocity_i: f32, radius_i: f32, position_j: vec2<f32>, velocity_j: vec2<f32>, anguler_velocity_j: f32, radius_j: f32) -> vec2<f32> {
      let lx = position_j.x - position_i.x;
      let ly = position_j.y - position_i.y;
      let ld = sqrt(lx * lx + ly * ly);
      let cos_a_ji = lx/ld;
      let sin_a_ji = ly/ld;
      let u_ji_n =  (velocity_i.x - velocity_j.x) * cos_a_ji + (velocity_i.y - velocity_j.y) * sin_a_ji;
      let u_ji_s = -(velocity_i.x - velocity_j.x) * sin_a_ji + (velocity_i.y - velocity_j.y) * cos_a_ji + radius_i * anguler_velocity_i + radius_j * anguler_velocity_j;
      return vec2<f32>(u_ji_n, u_ji_s);
    }

    // 衝突後の粒子同士の相対速度を求める(対壁)
    fn calculationVelocityAfterCollisionWithWall(velocity_i: vec2<f32>, anguler_velocity_i: f32, radius_i: f32, alpha: f32) -> vec2<f32> {
      let cos_a_ji = cos(radians(alpha));
      let sin_a_ji = sin(radians(alpha));
      let u_ji_n =  (velocity_i.x) * cos_a_ji + (velocity_i.y) * sin_a_ji;
      let u_ji_s = -(velocity_i.x) * sin_a_ji + (velocity_i.y) * cos_a_ji + radius_i * anguler_velocity_i;
      return vec2<f32>(u_ji_n, u_ji_s);
    }

    // 衝突後の粒子同士の相対速度を求める(対線分)
    fn calculationVelocityAfterCollisionWithStackLine(position_i: vec2<f32>, velocity_i: vec2<f32>, anguler_velocity_i: f32, radius_i: f32, position_j: vec2<f32>, velocity_j: vec2<f32>, anguler_velocity_j: f32, radius_j: f32) -> vec2<f32> {
      let lx = position_j.x - position_i.x;
      let ly = position_j.y - position_i.y;
      let ld = sqrt(lx * lx + ly * ly);
      let cos_a_ji = lx/ld;
      let sin_a_ji = ly/ld;
      let u_ji_n =  (velocity_i.x - velocity_j.x) * cos_a_ji + (velocity_i.y - velocity_j.y) * sin_a_ji;
      let u_ji_s = -(velocity_i.x - velocity_j.x) * sin_a_ji + (velocity_i.y - velocity_j.y) * cos_a_ji + radius_i * anguler_velocity_i + radius_j * anguler_velocity_j;
      return vec2<f32>(u_ji_n, u_ji_s);
    }


    // 復元力を求める(x,yはn,s)
    fn calculationRestoringForceNS(resilience_force: vec2<f32>, u_ji: vec2<f32>, k_n: f32, k_s: f32, timeStep: f32) -> vec2<f32> {
      return vec2<f32>(resilience_force.x + k_n * u_ji.x * timeStep, resilience_force.y + k_s * u_ji.y * timeStep);
    }


    // 粘性力を求める(x,yはn,s)
    fn calculationViscousForceNS(eta_n: f32, eta_s: f32, u_ji_n: f32, u_ji_s: f32) -> vec2<f32> {
      return vec2<f32>(eta_n*u_ji_n, eta_s*u_ji_s);
    }


    // 弾性力を求める(x,yはn,s)
    fn calculationElasticForceNS(resilience_force: vec2<f32>, viscous_force: vec2<f32>) -> vec2<f32> {
      // 法線方向
      var f_ji_n: f32;
      if(resilience_force.x >= 0){
        f_ji_n = resilience_force.x + viscous_force.x;
      }else{
        f_ji_n = 0.0;
      }
      // 接線方向(個別要素法による粒状体の力学的挙動に関する解析的研究(その1)より)
      var f_ji_s: f32;
      if(resilience_force.x < 0){
        f_ji_s = 0.0;
      }else if(abs(resilience_force.y) > tan(radians(fai))*resilience_force.x + c){
        f_ji_s = (tan(radians(fai))*resilience_force.x + c)*sign(resilience_force.y);
      }else{
        f_ji_s = resilience_force.y + viscous_force.y;
      }
      return vec2<f32>(f_ji_n, f_ji_s);
    }

    // 弾性力をxy成分に分解する(引数のx,yはn,s)
    fn calculationElasticForceXY(f_ji: vec2<f32>, position_i: vec2<f32>, position_j: vec2<f32>) -> vec2<f32> {
      let lx = position_j.x - position_i.x;
      let ly = position_j.y - position_i.y;
      let ld = sqrt(lx * lx + ly * ly);
      let cos_a_ji = lx/ld;
      let sin_a_ji = ly/ld;
      let f_ji_x = -f_ji.x * cos_a_ji + f_ji.y * sin_a_ji;
      let f_ji_y = -f_ji.x * sin_a_ji - f_ji.y * cos_a_ji;
      return vec2<f32>(f_ji_x, f_ji_y);
    }

    // 弾性力をxy成分に分解する(対壁)
    fn calculationElasticForceXYWithWall(f_ji: vec2<f32>, alpha: f32) -> vec2<f32> {
      let cos_a_ji = cos(radians(alpha));
      let sin_a_ji = sin(radians(alpha));
      let f_ji_x = -f_ji.x * cos_a_ji + f_ji.y * sin_a_ji;
      let f_ji_y = -f_ji.x * sin_a_ji - f_ji.y * cos_a_ji;
      return vec2<f32>(f_ji_x, f_ji_y);
    }

    // 粒子の加速度を求める
    fn calculationAcceleration(m_i: f32, F_i: f32, G_i: f32) -> vec2<f32> {
      return vec2<f32>(F_i/m_i, G_i/m_i + g);
    }

    // 粒子の速度を求める
    fn calculationVelocity(velocity: vec2<f32>, acceleration: vec2<f32>, timeStep: f32) -> vec2<f32> {
      return vec2<f32>(velocity.x + acceleration.x * timeStep, velocity.y + acceleration.y * timeStep);
    }

    // 粒子の位置を求める
    fn calculationPosition(position: vec2<f32>, velocity: vec2<f32>, timeStep: f32) -> vec2<f32> {
      return vec2<f32>(position.x + velocity.x * timeStep, position.y + velocity.y * timeStep);
    }

    // 粒子の角加速度を求める
    fn calculationAngularAcceleration(I_i: f32, T_i: f32) -> f32 {
      return f32(T_i/I_i);
    }

    // 粒子の角速度を求める
    fn calculationAngularVelocity(angular_velocity: f32, angular_acceleration: f32, timeStep: f32) -> f32 {
      return f32(angular_velocity + angular_acceleration * timeStep);
    }

    // 粒子の角度を求める
    fn calculationAngle(angle: f32, angular_velocity: f32, timeStep: f32) -> f32 {
      return f32(angle + angular_velocity * timeStep);
    }

    // 粒子と線分の接触判定用
    // 接触判定のためのベクトルACを算出する
    fn calVectorAC(line: Line, position: vec2<f32>) -> vec2<f32>{
      return position - line.position_1;
    }

    // t'を算出する
    fn calTDash(line: Line, AC:vec2<f32>) -> f32 {
      // 線分ABのベクトル
      let AB = line.position_2 - line.position_1;
      // tを算出((w・v)/(v・v))=((AC・AB)/(AB・AB))
      let t = dot(AC,AB)/dot(AB,AB);
      // tを0と1の間に限定する
      return clamp(t, 0, 1);
    }

    // 接触判定のためのベクトルAD(接触点)を算出する
    fn calVectorD(line: Line, tdash: f32) -> vec2<f32>{
      // 線分ABのベクトル
      let AB = line.position_2 - line.position_1;
      return vec2<f32>(line.position_1.x + tdash * AB.x, line.position_1.y + tdash * AB.y);
    }


    // 左下のマスのインデックス(インデックス要素数は抜きにして考える)(0より小さい時のことはあとで考える)
    fn cal_1_1_index(nx: u32, i: u32) -> i32 {
      return i32(i-nx-1);
    }
    // 真下のマスのインデックス(インデックス要素数は抜きにして考える)(0より小さい時のことはあとで考える)
    fn cal_2_1_index(nx: u32, i: u32) -> i32 {
      return i32(i-nx);
    }
    // 右下のマスのインデックス(インデックス要素数は抜きにして考える)(0より小さい時のことはあとで考える)
    fn cal_3_1_index(nx: u32, i: u32) -> i32 {
      return i32(i-nx+1);
    }
    // 左のマスのインデックス(インデックス要素数は抜きにして考える)(0より小さい時のことはあとで考える)
    fn cal_1_2_index(nx: u32, i: u32) -> i32 {
      return i32(i-1);
    }
    // 真ん中のマスのインデックス(インデックス要素数は抜きにして考える)(0より小さい時のことはあとで考える)
    fn cal_2_2_index(nx: u32, i: u32) -> i32 {
      return i32(i);
    }
    // 右のマスのインデックス(インデックス要素数は抜きにして考える)(超えた時のことはあとで考える)
    fn cal_3_2_index(nx: u32, i: u32) -> i32 {
      return i32(i+1);
    }
    // 左上のマスのインデックス(インデックス要素数は抜きにして考える)(超えた時のことはあとで考える)
    fn cal_1_3_index(nx: u32, i: u32) -> i32 {
      return i32(i+nx-1);
    }
    // 真上のマスのインデックス(インデックス要素数は抜きにして考える)(超えた時のことはあとで考える)
    fn cal_2_3_index(nx: u32, i: u32) -> i32 {
      return i32(i+nx);
    }
    // 右上のマスのインデックス(インデックス要素数は抜きにして考える)(超えた時のことはあとで考える)
    fn cal_3_3_index(nx: u32, i: u32) -> i32 {
      return i32(i+nx+1);
    }

    fn calculationOtherBallIndexArray(nx: u32, i: u32) -> array<i32, 9> {
      var other_index_array: array<i32, 9>; // 判定を行う相手のインデックスを格納する配列(自分自身と周りの8マス=9マス)
      other_index_array[0] = cal_1_1_index(nx, i);
      other_index_array[1] = cal_2_1_index(nx, i);
      other_index_array[2] = cal_3_1_index(nx, i);
      other_index_array[3] = cal_1_2_index(nx, i);
      other_index_array[4] = cal_2_2_index(nx, i);
      other_index_array[5] = cal_3_2_index(nx, i);
      other_index_array[6] = cal_1_3_index(nx, i);
      other_index_array[7] = cal_2_3_index(nx, i);
      other_index_array[8] = cal_3_3_index(nx, i);
      return other_index_array;
    }

    @compute @workgroup_size(64)
    fn main(
      @builtin(global_invocation_id)
      global_id : vec3<u32>,
    ) {
      let TIME_LOOP: u32 = 1;                   // 1fpsあたりのループ回数
      let TIME_STEP: f32 = ${dt}; //1/scene.fps/400;   // 時間刻み(s)
      let num_balls: u32 = arrayLength(&output);
      // let num_lines: u32 = maxLineNumber;//arrayLength(&line_input);

      let nx: u32 = u32(scene.nx); //u32(ceil(scene.L/scene.maxRadius)); // x方向の格子点数
      let ny: u32 = u32(ceil(f32(nx) * scene.height/scene.width)); // y方向の格子点数
      let spacing: f32 = scene.spacing; //scene.maxRadius*2+0.001; // 格子間隔
      let grid_size: u32 = u32(scene.grid_size); //u32(ceil(scene.maxRadius/scene.minRadius)) * u32(ceil(scene.maxRadius/scene.minRadius)); // 1グリッドあたりの最大要素数



      if(global_id.x >= num_balls) {
        return;
      }



      var src_ball = input[global_id.x];
      let dst_ball = &output[global_id.x];

      (*dst_ball) = src_ball;

      let src_gl_index:u32 = u32(floor(src_ball.position.y/spacing))*nx + u32(floor(src_ball.position.x/spacing)); // 今のインデックス要素数は抜きにして考える
      let other_index_array: array<i32, 9> = calculationOtherBallIndexArray(nx, src_gl_index); // 判定を行う相手のインデックスの始まりを格納する配列(自分自身と周りの8マス=9マス)


      // set const (奥行き1の円柱)
      let m_i = pow(src_ball.radius, 2.0) * PI * rho;   // 粒子iの質量
      let I_i = 0.5 * m_i * pow(src_ball.radius, 2.0);  // 粒子iの慣性モーメント


      var F_i: f32 = 0.0;                               // 粒子iの弾性力の合力
      var G_i: f32 = 0.0;                               // 粒子iのせん断力の合力
      var T_i: f32 = 0.0;                               // 粒子iのトルクの合力


      var ef_counter:u32 = 0; // 接触力の相手の数を保存しておく変数
      var ef_output: array<EF, maxContactParticleNumber + 4 + maxLineNumber>; // 計算した接触力を保存する配列(+4は上下左右の壁)
      var ef_index_output: array<u32, maxContactParticleNumber>; // 計算した接触粒子を保存する配列
      for (var i = 0u; i < maxContactParticleNumber; i = i + 1u) {
        ef_output[i].resilience_force = vec2<f32>(0.0, 0.0);
        ef_index_output[i] = 0u;
      }
      ef_output[maxContactParticleNumber    ].resilience_force = vec2<f32>(0.0, 0.0);
      ef_output[maxContactParticleNumber + 1].resilience_force = vec2<f32>(0.0, 0.0);
      ef_output[maxContactParticleNumber + 2].resilience_force = vec2<f32>(0.0, 0.0);
      ef_output[maxContactParticleNumber + 3].resilience_force = vec2<f32>(0.0, 0.0);
      // 線分の数ループ
      for (var i = 0u; i < maxLineNumber; i = i + 1u) {
        ef_output[maxContactParticleNumber + 4 + i].resilience_force = vec2<f32>(0.0, 0.0);
      }



      // Ball/Ball collision
      // マスごとにループ
      for(var j = 0; j < 9; j++) {
        // 格子点が存在しない場合はスキップ
        if(other_index_array[j] < 0 || other_index_array[j] >= i32(nx)*i32(ny)) {
          continue;
        }
        // gl_inputの対象インデックスのループ
        for(var k = other_index_array[j]*i32(grid_size); k < other_index_array[j]*i32(grid_size)+i32(grid_size); k++) {
          
          // 0は初期値なのでスキップ
          if(gl_input[u32(k)] == 0) {
            continue;
          }
          // iを算出する
          var i = gl_input[u32(k)] - 1; // 登録の時に+1しているので-1する(配列の中で0はnullの意味で使用するため)




        // for(var i = 0; i < num_balls; i++) {
          // 自分自身の場合はスキップ
          if(i == global_id.x) {
            continue;
          }

  
          var other_ball = input[i];
          let n = src_ball.position - other_ball.position;
          let distance = length(n);
          if(distance >= src_ball.radius + other_ball.radius) {
            // (*ef_dst).resilience_force = vec2<f32>(0,0); // 復元力を0にする
            // 現状では終わってから同期する
            // ef_input[ef_index_ij] = (*ef_dst);
            continue;
          }


          // 接触力の相手のインデックスを保存しておく(登録時は+1しておく) 
          ef_index_output[ef_counter] = i + 1;
          var ef_src: EF = EF(vec2<f32>(0.0, 0.0));
          // 前の相手iに対する接触力を見つける
          for(var l:u32 = 0; l < maxContactParticleNumber; l++) {
            // もし1ステップ前の接触力のインデックス配列にiと同じインデックスがあれば、接触力を継承する。なければ初めて接触下として、0のままにする。
            if(ef_index_input[global_id.x*maxContactParticleNumber + l] == i + 1){
              ef_src.resilience_force = ef_input[global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + l].resilience_force;
              break;
            }
          }


          let other_mass = pow(other_ball.radius, 2.0) * PI * rho; // 質量;
  
          // eta(粘性係数)を求める
          let eta_ij = calculationEta(m_i, other_mass);
          // 衝突後の粒子同士の相対速度を求める
          let u_ji = calculationVelocityAfterCollision(src_ball.position, src_ball.velocity, src_ball.anguler_velocity, src_ball.radius, other_ball.position, other_ball.velocity, other_ball.anguler_velocity, other_ball.radius);
          // 復元力を求める
          ef_output[ef_counter].resilience_force = calculationRestoringForceNS(ef_src.resilience_force, u_ji, k_n, k_s, TIME_STEP);
          // 粘性力を求める
          let viscous_force = calculationViscousForceNS(eta_ij.x, eta_ij.y, u_ji.x, u_ji.y);
          // 弾性力を求める
          let elastic_force_ns = calculationElasticForceNS(ef_output[ef_counter].resilience_force, viscous_force);
          // 弾性力をxy成分に分解する
          let elastic_force_xy = calculationElasticForceXY(elastic_force_ns, src_ball.position, other_ball.position);
          // 合力を増加させる
          F_i += elastic_force_xy.x;
          G_i += elastic_force_xy.y;
          T_i += - elastic_force_ns.y * src_ball.radius;
  
          // 接触相手のカウンターを一つ増やす
          ef_counter += 1; 
        }
      }


      // Ball/Wall collision
      // 左の壁
      if((*dst_ball).position.x - (*dst_ball).radius < 0.) {
        // 復元力のインデックスを求める(自分のインデックスの最後+1)
        let ef_index_ij = global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber;
        var ef_src = ef_input[ef_index_ij];

        let alpha = 180.0; // 左なので180°

        // eta(粘性係数)を求める(対壁)
        let eta_ij = calculationEtaWithWall(m_i);
        // 衝突後の粒子同士の相対速度を求める
        let u_ji = calculationVelocityAfterCollisionWithWall(src_ball.velocity, src_ball.anguler_velocity, src_ball.radius, alpha);
        // 復元力を求める
        ef_output[maxContactParticleNumber].resilience_force = calculationRestoringForceNS(ef_src.resilience_force, u_ji, k_n, k_s, TIME_STEP);
        // 粘性力を求める
        let viscous_force = calculationViscousForceNS(eta_ij.x, eta_ij.y, u_ji.x, u_ji.y);
        // 弾性力を求める
        let elastic_force_ns = calculationElasticForceNS(ef_output[maxContactParticleNumber].resilience_force, viscous_force);
        // 弾性力をxy成分に分解する
        let elastic_force_xy = calculationElasticForceXYWithWall(elastic_force_ns, alpha);
        // 合力を増加させる
        F_i += elastic_force_xy.x;
        G_i += elastic_force_xy.y;
        T_i += - elastic_force_ns.y * src_ball.radius;

      }else{

        ef_output[maxContactParticleNumber].resilience_force = vec2<f32>(0,0); // 復元力を0にする

      }

      // 下の壁
      if((*dst_ball).position.y - (*dst_ball).radius < 0.) {
        // 復元力のインデックスを求める(自分のインデックスの最後+1)
        let ef_index_ij = global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber + 1;
        var ef_src = ef_input[ef_index_ij];


        let alpha = 270.0; // 下なので270°

        // eta(粘性係数)を求める(対壁)
        let eta_ij = calculationEtaWithWall(m_i);
        // 衝突後の粒子同士の相対速度を求める
        let u_ji = calculationVelocityAfterCollisionWithWall(src_ball.velocity, src_ball.anguler_velocity, src_ball.radius, alpha);
        // 復元力を求める
        ef_output[maxContactParticleNumber + 1].resilience_force = calculationRestoringForceNS(ef_src.resilience_force, u_ji, k_n, k_s, TIME_STEP);
        // 粘性力を求める
        let viscous_force = calculationViscousForceNS(eta_ij.x, eta_ij.y, u_ji.x, u_ji.y);
        // 弾性力を求める
        let elastic_force_ns = calculationElasticForceNS(ef_output[maxContactParticleNumber + 1].resilience_force, viscous_force);
        // 弾性力をxy成分に分解する
        let elastic_force_xy = calculationElasticForceXYWithWall(elastic_force_ns, alpha);
        // 合力を増加させる
        F_i += elastic_force_xy.x;
        G_i += elastic_force_xy.y;
        T_i += - elastic_force_ns.y * src_ball.radius;


      }else{

        ef_output[maxContactParticleNumber + 1].resilience_force = vec2<f32>(0,0); // 復元力を0にする

      }

      // 右の壁
      if((*dst_ball).position.x + (*dst_ball).radius >= scene.L) {
        // 復元力のインデックスを求める(自分のインデックスの最後+1)
        let ef_index_ij = global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber + 2;
        var ef_src = ef_input[ef_index_ij];

        let alpha = 0.0; // 右なので0°

        // eta(粘性係数)を求める(対壁)
        let eta_ij = calculationEtaWithWall(m_i);
        // 衝突後の粒子同士の相対速度を求める
        let u_ji = calculationVelocityAfterCollisionWithWall(src_ball.velocity, src_ball.anguler_velocity, src_ball.radius, alpha);
        // 復元力を求める
        ef_output[maxContactParticleNumber + 2].resilience_force = calculationRestoringForceNS(ef_src.resilience_force, u_ji, k_n, k_s, TIME_STEP);
        // 粘性力を求める
        let viscous_force = calculationViscousForceNS(eta_ij.x, eta_ij.y, u_ji.x, u_ji.y);
        // 弾性力を求める
        let elastic_force_ns = calculationElasticForceNS(ef_output[maxContactParticleNumber + 2].resilience_force, viscous_force);
        // 弾性力をxy成分に分解する
        let elastic_force_xy = calculationElasticForceXYWithWall(elastic_force_ns, alpha);
        // 合力を増加させる
        F_i += elastic_force_xy.x;
        G_i += elastic_force_xy.y;
        T_i += - elastic_force_ns.y * src_ball.radius;

 
      }else{

        ef_output[maxContactParticleNumber + 2].resilience_force = vec2<f32>(0,0); // 復元力を0にする

      }

      // 上の壁
      if((*dst_ball).position.y + (*dst_ball).radius >= scene.L/scene.width*scene.height) {

        // 復元力のインデックスを求める(自分のインデックスの最後+1)
        let ef_index_ij = global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber + 3;
        var ef_src = ef_input[ef_index_ij];

        let alpha = 90.0; // 上なので90°

        // eta(粘性係数)を求める(対壁)
        let eta_ij = calculationEtaWithWall(m_i);
        // 衝突後の粒子同士の相対速度を求める
        let u_ji = calculationVelocityAfterCollisionWithWall(src_ball.velocity, src_ball.anguler_velocity, src_ball.radius, alpha);
        // 復元力を求める
        ef_output[maxContactParticleNumber + 3].resilience_force = calculationRestoringForceNS(ef_src.resilience_force, u_ji, k_n, k_s, TIME_STEP);
        // 粘性力を求める
        let viscous_force = calculationViscousForceNS(eta_ij.x, eta_ij.y, u_ji.x, u_ji.y);
        // 弾性力を求める
        let elastic_force_ns = calculationElasticForceNS(ef_output[maxContactParticleNumber + 3].resilience_force, viscous_force);
        // 弾性力をxy成分に分解する
        let elastic_force_xy = calculationElasticForceXYWithWall(elastic_force_ns, alpha);
        // 合力を増加させる
        F_i += elastic_force_xy.x;
        G_i += elastic_force_xy.y;
        T_i += - elastic_force_ns.y * src_ball.radius;

      }else{

        ef_output[maxContactParticleNumber + 3].resilience_force = vec2<f32>(0,0); // 復元力を0にする

      }


      // 線分要素の計算
      // 線分でループする
      for(var l = 0u; l < maxLineNumber; l = l + 1u) {
        // 線分が有効でないときは次のループへ
        if(line_input[l].isValid == 0u){
          continue;
        }
        let AC = calVectorAC(line_input[l], src_ball.position);
        let tdash = calTDash(line_input[l], AC);
        let D = calVectorD(line_input[l], tdash);
        // 接触判定              
        let distance = length(src_ball.position - D);
        // 接触しないとき
        if(distance >= src_ball.radius + line_input[l].thickness) {
          ef_output[maxContactParticleNumber + 4 + l].resilience_force = vec2<f32>(0,0); // 復元力を0にする
          continue;
        }
        // 復元力のインデックスを求める(自分のインデックスの最後+1)
        let ef_index_ij = global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber + 4 + l;
        var ef_src = ef_input[ef_index_ij];


        // eta(粘性係数)を求める
        let eta_ij = calculationEtaWithWall(m_i);
        // 衝突後の粒子同士の相対速度を求める
        let u_ji = calculationVelocityAfterCollisionWithStackLine(src_ball.position, src_ball.velocity, src_ball.anguler_velocity, src_ball.radius, D, vec2<f32>(0,0), 0, line_input[l].thickness);
        // 復元力を求める
        ef_output[maxContactParticleNumber + 4 + l].resilience_force = calculationRestoringForceNS(ef_src.resilience_force, u_ji, k_n, k_s, TIME_STEP);
        // 粘性力を求める
        let viscous_force = calculationViscousForceNS(eta_ij.x, eta_ij.y, u_ji.x, u_ji.y);
        // 弾性力を求める
        let elastic_force_ns = calculationElasticForceNS(ef_output[maxContactParticleNumber + 4 + l].resilience_force, viscous_force);
        // 弾性力をxy成分に分解する
        let elastic_force_xy = calculationElasticForceXY(elastic_force_ns, src_ball.position, D);
        // 合力を増加させる
        F_i += elastic_force_xy.x;
        G_i += elastic_force_xy.y;
        T_i += - elastic_force_ns.y * src_ball.radius;


      }


      // END 線分要素の計算


      // 粒子の加速度を求める
      let acceleration = calculationAcceleration(m_i, F_i, G_i);
      // 粒子の速度を求める
      (*dst_ball).velocity = calculationVelocity(src_ball.velocity, acceleration, TIME_STEP);
      // 粒子の位置を求める
      (*dst_ball).position = calculationPosition(src_ball.position, (*dst_ball).velocity, TIME_STEP);
      // 粒子の角加速度を求める
      let angular_acceleration = calculationAngularAcceleration(I_i, T_i);
      // 粒子の角速度を求める
      (*dst_ball).anguler_velocity = calculationAngularVelocity(src_ball.anguler_velocity, angular_acceleration, TIME_STEP);
      // 粒子の角度を求める
      (*dst_ball).angle = calculationAngle(src_ball.angle, (*dst_ball).anguler_velocity, TIME_STEP);


      // 異なるworkgroup間では現在同期できないのでforloopは使えない

      let gl_index:u32 = u32(floor((*dst_ball).position.y/spacing))*nx + u32(floor((*dst_ball).position.x/spacing));

      var c = atomicAdd(&gl_atomic[gl_index], u32(1));//加算(各関数は次の手順をアトミックに実行します。
      // 1.atomic_ptrが指す元の値をロードします, 
      // 2.値vを使用して関数名から演算 (例: max) を実行することにより、新しい値を取得します。
      // 3.atomic_ptrを使用して新しい値を保存します。
      // 各関数は、アトミック オブジェクトに格納されている元の値を返します。)

      gl_output[gl_index*grid_size+c] = global_id.x+1; // 初期化で0にしているのでindex=0と初期化がかぶらないように+1する

      
      // 接触力を次のループのために保存する
      for(var l:u32 = 0; l < maxContactParticleNumber; l++) {
          // 接触力を代入する
          ef_input[global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + l] = ef_output[l];
          // 接触力のインデックスを代入する
          ef_index_input[global_id.x*maxContactParticleNumber + l] =  ef_index_output[l];
      }
      // 壁の分
      ef_input[global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber]     = ef_output[maxContactParticleNumber];
      ef_input[global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber + 1] = ef_output[maxContactParticleNumber + 1];
      ef_input[global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber + 2] = ef_output[maxContactParticleNumber + 2];
      ef_input[global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber + 3] = ef_output[maxContactParticleNumber + 3];

      // 線分の分
      for(var l:u32 = 0; l < maxLineNumber; l++) {
          // 接触力を代入する
          ef_input[global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber + 4 + l] = ef_output[maxContactParticleNumber + 4 + l];
      }
    }
  `,
  });

  const bindGroupLayout1 = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "storage",
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "storage",
        },
      },
      {
        binding: 2,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "storage",
        },
      },
      {
        binding: 3,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "uniform",
        },
      },
      {
        binding: 4,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "storage",
        },
      },
      {
        binding: 5,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "storage",
        },
      },
      {
        binding: 6,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "storage",
        },
      },
      {
        binding: 7,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "storage",
        },
      },
    ],
  });

  const bindGroupLayout2 = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "storage",
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: "storage",
        },
      },
    ],
  });

  const pipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout1, bindGroupLayout2],
    }),
    compute: {
      module,
      entryPoint: "main",
    },
  });

  // --- ③ バッファサイズを16バイト境界＝(14×4=56 →64など)に調整し、UNIFORM ---
  const scene = device.createBuffer({
    size: 16 * Float32Array.BYTES_PER_ELEMENT, // ★ 16バイトアライン推奨
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST, 
  });

  const input = device.createBuffer({
    size: BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const output = device.createBuffer({
    size: BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.VERTEX,
  });

  const ef_input = device.createBuffer({
    size: EF_BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const ef_index_input = device.createBuffer({
    size: EF_INDEX_BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const gl_input = device.createBuffer({
    size: GL_BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const gl_output = device.createBuffer({
    size: GL_BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
  });

  const gl_atomic = device.createBuffer({
    size: GL_ATOMIC_BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
  });

  const line_input = device.createBuffer({
    size: LINE_BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const line_output = device.createBuffer({
    size: LINE_BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  const bindGroup1 = device.createBindGroup({
    layout: bindGroupLayout1,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: input,
        },
      },
      {
        binding: 1,
        resource: {
          buffer: output,
        },
      },
      {
        binding: 2,
        resource: {
          buffer: ef_input,
        },
      },
      {
        binding: 3,
        resource: {
          buffer: scene,
        },
      },
      {
        binding: 4,
        resource: {
          buffer: gl_input,
        },
      },
      {
        binding: 5,
        resource: {
          buffer: gl_output,
        },
      },
      {
        binding: 6,
        resource: {
          buffer: gl_atomic,
        },
      },
      {
        binding: 7,
        resource: {
          buffer: ef_index_input,
        },
      },
    ],
  });


  const bindGroup2 = device.createBindGroup({
    layout: bindGroupLayout2,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: line_input,
        },
      },
      {
        binding: 1,
        resource: {
          buffer: line_output,
        },
      },
    ],
  });


  // START Geometry Shader

  // 粒子要素の描画関係

  // シェーダーモジュール
  const cellShaderModule = device.createShaderModule({
    label: "Cell shader",
    code: `
    // Your shader code will go here

    struct Ball {
      radius: f32,
      padding: f32,
      position: vec2<f32>,
      velocity: vec2<f32>,
      angle: f32,
      anguler_velocity: f32,
    }
    @group(0) @binding(0)
    var<storage, read> output: array<Ball>;

    struct VertexOutput {
      @builtin(position) pos: vec4f,
      @location(0) cellColor: vec4f, // New line!
    };

    struct Scene {
      width: f32, // canvasの幅(pixel)
      height: f32, // canvasの高さ(pixel)
      L: f32, // canvasの幅(m)
      fps: f32, // フレームレート
      minRadius: f32, // 粒子の最小半径(m)
      maxRadius: f32, // 粒子の最大半径(m)
      nx: f32, // x方向の格子点数
      grid_size: f32, // 1グリッドあたりの最大要素数
      spacing: f32, // 格子間隔
      numBalls: f32, // 粒子数
      maxContactParticleNumber: f32, // 最大接触粒子数
      offsetX: f32,               // カメラ中心 X
      offsetY: f32,               // カメラ中心 Y
      zoomValue: f32, // ズーム係数
      colorMode: f32, // カラーモード
    }

    @group(0) @binding(1)
    var<uniform> scene: Scene;

    // 頂点シェーダーを定義する
    @vertex
    fn vertexMain(@builtin(vertex_index) vertex_index : u32, @builtin(instance_index) instance_index: u32, @location(0) pos: vec2<f32>) ->
    VertexOutput {
      var vertexOutput: VertexOutput;
      let widthByL: f32 = scene.width/scene.L; 
      
      // パーティクル中心 (ピクセル座標)(左下基準)
      let cx = output[instance_index].position.x * widthByL;
      let cy = output[instance_index].position.y * widthByL;
      
      // 回転
      let rx = cos(radians(output[instance_index].angle)) * pos.x
            - sin(radians(output[instance_index].angle)) * pos.y;
      let ry = sin(radians(output[instance_index].angle)) * pos.x
            + cos(radians(output[instance_index].angle)) * pos.y;

      // 中心オフセット+NDC変換
      // offsetX, offsetY はピクセル単位
      let ndcX = ((cx - scene.offsetX )  + rx * output[instance_index].radius * widthByL)
                / scene.width * 2.0 * scene.zoomValue - 1.0;
      let ndcY = ((cy - scene.offsetY )  + ry * output[instance_index].radius * widthByL)
                / scene.height * 2.0 * scene.zoomValue - 1.0;

      // ズーム係数を適用
      vertexOutput.pos = vec4f(ndcX, ndcY, 0.0, 1.0);

      // 粒子番号の場合
      if(u32(scene.colorMode) == 0){
        if(instance_index < u32(0.25*scene.numBalls)){
          // vertexOutput.cell = 0.25;
          vertexOutput.cellColor = vec4f(0.25, 0, 1.0, 1);
        }else if(instance_index < u32(0.5*scene.numBalls)){
          vertexOutput.cellColor = vec4f(0.5, 0, 1.0, 1);
        }else if(instance_index < u32(0.75*scene.numBalls)){
          vertexOutput.cellColor = vec4f(0.75, 0, 1.0, 1);
        }else{
          vertexOutput.cellColor = vec4f(1.0, 0, 1.0, 1);
        }
      }else if(u32(scene.colorMode) == 1){
        let velocity = length(output[instance_index].velocity);
        vertexOutput.cellColor = vec4f(velocity, 0, 100, 1);
      }

      return vertexOutput; // (X, Y, Z, W) w の値は、3 次元同次座標系における頂点の 4 つ目の要素,3D グラフィックのレンダリングでよく行われる 4x4 行列を使用した計算が可能になる
    }

    // フラグメント シェーダーを定義する(戻り値は0～1)
    @fragment
    fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {

      return input.cellColor; // (Red, Green, Blue, Alpha)
    }   
  `
  });


  // 頂点を定義する
  function createCircleVertices(centerX, centerY, radius, segments) {
    const vertices = [];
    for (let i = 1; i < segments; i++) { // 一つ欠けさせるために0番目はスキップ
      const theta1 = (i / segments) * 2.0 * Math.PI;
      const theta2 = ((i + 1) / segments) * 2.0 * Math.PI;
      const x1 = centerX + radius * Math.cos(theta1);
      const y1 = centerY + radius * Math.sin(theta1);
      const x2 = centerX + radius * Math.cos(theta2);
      const y2 = centerY + radius * Math.sin(theta2);
      // 頂点データに中心点と円周上の点を追加
      vertices.push(centerX, centerY, x1, y1, x2, y2);
    }
    return new Float32Array(vertices);
  }
  // 頂点バッファを作成する
  const vertices = createCircleVertices(0, 0, 1, 10);
  // バッファの作成
  const vertexBuffer = device.createBuffer({
    label: "Cell vertices",
    size: vertices.byteLength,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX,
  });
  // END 円

  // 頂点データをバッファのメモリにコピーする
  device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/0, vertices);

  // 頂点のレイアウトを定義する
  // vertexBufferLayoutを作成する
  const vertexBufferLayout = {
    arrayStride: 8,
    attributes: [{
      format: "float32x2",
      offset: 0,
      shaderLocation: 0, // Position, see vertex shader
    }],
  };

  const renderBindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: { type: "read-only-storage" },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.VERTEX,
        buffer: {
          type: "uniform",
        },
      },
    ],
  });



  const renderBindGroup = device.createBindGroup({
    label: "Cell renderer bind group",
    layout: renderBindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: output
        }
      },
      {
        binding: 1,
        resource: {
          buffer: scene,
        },
      },
    ],
  });

  const renderPipelineLayout = device.createPipelineLayout({
    label: "Cell Pipeline Layout",
    bindGroupLayouts: [renderBindGroupLayout],
  });

  // レンダリング パイプラインを作成する
  const cellPipeline = device.createRenderPipeline({
    label: "Cell pipeline",
    layout: renderPipelineLayout,
    vertex: {
      module: cellShaderModule,
      entryPoint: "vertexMain",
      buffers: [vertexBufferLayout]
    },
    fragment: {
      module: cellShaderModule,
      entryPoint: "fragmentMain",
      targets: [{
        format: canvasFormat
      }]
    }
  });

  // END 粒子要素の描画関係


  // 線分要素の描画関係

  // まずlineShaderModuleを定義（まだ存在しない場合）
  const lineShaderModule = device.createShaderModule({
    label: "Line shader",
    code: `
      struct Line {
        thickness: f32,
        isValid: u32,
        position_1: vec2<f32>,
        position_2: vec2<f32>,
        velocity: vec2<f32>,
        angle: f32,
        anguler_velocity: f32,
      }
      
      @group(0) @binding(0)
      var<storage, read> line_output: array<Line>;
      
      struct Scene {
        width: f32, height: f32, L: f32, fps: f32,
        minRadius: f32, maxRadius: f32, nx: f32, grid_size: f32,
        spacing: f32, numBalls: u32, maxContactParticleNumber: f32,
        offsetX: f32, offsetY: f32, zoomValue: f32, colorMode: f32,
      }
      
      @group(0) @binding(1)
      var<uniform> scene: Scene;
      
      struct VertexOutput {
        @builtin(position) pos: vec4f,
        @location(0) color: vec4f,
      };
      
      @vertex
      fn vertexMain(@location(0) pos: vec2<f32>, @builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
        var output: VertexOutput;
        let widthByL: f32 = scene.width/scene.L;
        
        // 座標を決定（0と1のインデックスで線分の両端を取得）
        let lineIndex = vertexIndex / 2;
        let pointIndex = vertexIndex % 2;
        
              
        // isValidをチェック
        let isVisible: bool = line_output[lineIndex].isValid != 0u;

        // select(falseの場合の値, trueの場合の値, 条件式)
        // 線分は常に2つの頂点（始点と終点）から構成されます
        // pointIndexは処理中の頂点が線分のどちら側かを示します（0か1）
        // GPUでは条件分岐（if文）を避けて、このselectのような関数を使うことでパフォーマンスが向上します
        let position = select(
          line_output[lineIndex].position_1,
          line_output[lineIndex].position_2,
          pointIndex == 1
        );
        
        // NDC座標に変換
        let ndcX = ((position.x * widthByL) - scene.offsetX) 
                  / scene.width * 2.0 * scene.zoomValue - 1.0;
        let ndcY = ((position.y * widthByL) - scene.offsetY) 
                  / scene.height * 2.0 * scene.zoomValue - 1.0;
        
        // isValid が 0 の場合は線分を画面外に配置（実質的に非表示にする）
        if (isVisible) {
          output.pos = vec4f(ndcX, ndcY, 0.0, 1.0);
          output.color = vec4f(1.0, 0.5, 0.0, 1.0); // オレンジ色
        } else {
          // 画面外に配置（クリッピングされる）
          output.pos = vec4f(0.0, 0.0, 10.0, 0.0); 
          output.color = vec4f(0.0, 0.0, 0.0, 0.0); // 透明
        }
        
        return output;
      }
      
      @fragment
      fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
        return input.color;
      }
    `
  });

  // 線分の頂点バッファレイアウト
  const lineVertexBufferLayout = {
    arrayStride: 8,
    attributes: [{
      format: "float32x2",
      offset: 0,
      shaderLocation: 0,
    }],
  };

  // 線分の頂点データ（単純な2点を定義するだけでOK）
  const lineVertices = new Float32Array([
    0, 0,  // 開始点（シェーダー内で実際の位置に置き換え）
    0, 0   // 終了点（シェーダー内で実際の位置に置き換え）
  ]);

  // 線分の頂点バッファ
  const lineVertexBuffer = device.createBuffer({
    label: "Line vertices",
    size: lineVertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(lineVertexBuffer, 0, lineVertices);

  // 線分用のバインドグループを作成
  const lineBindGroup = device.createBindGroup({
    label: "Line renderer bind group",
    layout: renderBindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: line_output
        }
      },
      {
        binding: 1,
        resource: {
          buffer: scene,
        },
      },
    ],
  });

  // 線分用のパイプラインを作成
  const linePipeline = device.createRenderPipeline({
  label: "Line pipeline",
  layout: renderPipelineLayout, // 同じレイアウトを使用可能
  vertex: {
    module: lineShaderModule, // 線分用のシェーダーモジュール
    entryPoint: "vertexMain",
    buffers: [lineVertexBufferLayout]
  },
  fragment: {
    module: lineShaderModule, 
    entryPoint: "fragmentMain",
    targets: [{ format: canvasFormat }]
  },
  primitive: {
    topology: "line-list", // ここで線分として描画指定
    stripIndexFormat: undefined
  }
  });

  // END 線分要素の描画関係

  // END Geometry Shader

  // 計算を更新する関数
  function updateCompute(commandEncoder) {
    const dispatchSize = Math.ceil(NUM_BALLS / 64);
    const computePassEncoder = commandEncoder.beginComputePass(); // 「これから計算処理の指示を記録します」という宣言
    computePassEncoder.setPipeline(pipeline); // どのシェーダープログラムを実行するかを指定
    computePassEncoder.setBindGroup(0, bindGroup1); // シェーダーが使用するデータリソースを指定(粒子)
    computePassEncoder.setBindGroup(1, bindGroup2); // シェーダーが使用するデータリソースを指定(線分)
    computePassEncoder.dispatchWorkgroups(dispatchSize); // 「ワークグループ」と呼ばれる計算ユニットをいくつ起動するかを指定
    computePassEncoder.end(); // 「計算処理の指示はここまでです」という宣言
    return commandEncoder;
  }

  // レンダリングを更新する関数
  function updateRender(commandEncoder) {
    const renderPassDescriptor = {
      colorAttachments: [{
        view: ctx.getCurrentTexture().createView(),
        loadOp: "clear",
        clearValue: { r: 0, g: 0, b: 0.4, a: 1 },
        storeOp: "store",
      }],
    };
    const renderPassEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    // 粒子を描画
    renderPassEncoder.setPipeline(cellPipeline);
    renderPassEncoder.setVertexBuffer(0, vertexBuffer);
    renderPassEncoder.setBindGroup(0, renderBindGroup);
    renderPassEncoder.draw(vertices.length / 2, NUM_BALLS);


    // 次に線分を描画
    renderPassEncoder.setPipeline(linePipeline);
    renderPassEncoder.setVertexBuffer(0, lineVertexBuffer);
    renderPassEncoder.setBindGroup(0, lineBindGroup);
    renderPassEncoder.draw(lineVertices.length / 2); // インスタンス描画なしの例


    renderPassEncoder.end();
    return commandEncoder;
  }


  // ページ初回ロード時
  initializeState();


  // 初期化の処理
  function initializeState() {

    // シーン用バッファを再設定し、再描画を行う
    device.queue.writeBuffer(scene, 0, initializeSceneBuffer());

    // 初期化用のバッファデータの粒子要素の配列
    device.queue.writeBuffer(input, 0, initializeInputBallsBuffer());

    // 初期化用のバッファデータの線分要素の配列
    device.queue.writeBuffer(line_input, 0, initializeInputLinesBuffer());
    device.queue.writeBuffer(line_output, 0, initializeInputLinesBuffer());

    // 初期化用のバッファデータの接触力の配列
    let ef_inputBalls = new Float32Array(new ArrayBuffer(EF_BUFFER_SIZE));
    device.queue.writeBuffer(ef_input, 0, ef_inputBalls);
    // 初期化用のバッファデータの接触力の相手粒子の配列
    let ef_index_inputBalls = new Uint32Array(new ArrayBuffer(EF_INDEX_BUFFER_SIZE));
    device.queue.writeBuffer(ef_index_input, 0, ef_index_inputBalls);
    // 初期化用のバッファデータの接触相手粒子の配列
    let gl_inputBalls = new Uint32Array(new ArrayBuffer(GL_BUFFER_SIZE));
    device.queue.writeBuffer(gl_input, 0, gl_inputBalls);
    // 初期化用のバッファデータの接触相手の粒子数の配列
    let gl_input_atomic = new Uint32Array(new ArrayBuffer(GL_ATOMIC_BUFFER_SIZE));
    device.queue.writeBuffer(gl_atomic, 0, gl_input_atomic);

    // GPUコマンドの作成
    let commandEncoder = device.createCommandEncoder();
    // 一度計算する
    commandEncoder = updateCompute(commandEncoder);
    // バッファのコピー

    commandEncoder.copyBufferToBuffer(output, 0, input, 0, BUFFER_SIZE);
    commandEncoder.copyBufferToBuffer(gl_output, 0, gl_input, 0, GL_BUFFER_SIZE);


    // レンダリングを実行
    commandEncoder = updateRender(commandEncoder);

    device.queue.submit([commandEncoder.finish()]); // commandEncoder.finish()でコマンドリストを完成させ、device.queue.submit()でGPUに送信することで、実際の処理が行われる

  }



  // overlay 用キャンバス・コンテキスト(計算時間を表示するために追加)
  const overlayCtx = overlayCanvas.getContext("2d");
  overlayCanvas.width = width; // キャンバスの幅(px)
  overlayCanvas.height = height; // キャンバスの高さ(px)
  overlayCanvas.style.width = width + 'px';
  overlayCanvas.style.height = height + 'px';
  // オーバーレイキャンバスでテキスト描画する関数
  function drawFPS(timeInSec, unit) {
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    // フォントサイズを設定（固定サイズを維持）
    const fontSize = 24;
    overlayCtx.font = `${fontSize}px serif`;
    overlayCtx.fillStyle = "white";
    const text = timeInSec.toFixed(2) + " " + unit;
    // テキストの横幅を測定
    const textWidth = overlayCtx.measureText(text).width;
    // 右上に配置（右端から20px、上端から20px離す）
    const x = overlayCanvas.width - textWidth - 40;
    const y = fontSize + 20; // フォントサイズ + 余白
    // テキスト描画
    overlayCtx.fillText(text, x, y);
  }

  // カラーモードの変更時に実行される関数
  function changeColorMode(mode) {
    switch(mode){
      case "id":
        colorMode = 0;
        break;
      case "vabs":
        colorMode = 1;
        break;
    }

    // 再レンダリング
    updateZoom();
  }

  // ラジオボタン要素のイベントの追加
  modeRadioId.addEventListener("change", () => changeColorMode("id"));
  modeRadioVabs.addEventListener("change", () => changeColorMode("vabs"));
  


  // マウスのドラッグ関係
  // マウス押下時の処理
  canvas.addEventListener("mousedown", (event) => {
    isDragging = true;
    canvas.style.cursor = "grabbing"; // ドラッグ時のカーソル
    const rect = canvas.getBoundingClientRect();
    lastMouseX = event.clientX - rect.left;
    lastMouseY = event.clientY - rect.top;
  });
  // マウス移動時の処理
  canvas.addEventListener("mousemove", (event) => {
    // ドラッグしてなければ抜ける
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
  
    const dx = mouseX - lastMouseX;
    const dy = mouseY - lastMouseY;
  
    // zoomしても移動量は一定にする
    offsetX -= dx/zoomValue;
    // Canvas は上が0で下に行くほど大きくなる。WebGPUでは下端が-1,上端が1なので符号を反転
    offsetY += dy/zoomValue;
  
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    // レンダリングを更新
    updateZoom();
  });
  
  canvas.addEventListener("mouseup", () => {
    isDragging = false;
    canvas.style.cursor = "grab"; // カーソルを元に戻す
  });
  // END マウスのドラッグ関係

  // マウスのズーム関係
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    // キャンバス上のマウス座標を取得
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const oldZoom = zoomValue;
    const zoomFactor = 1.1; // ズームの強さ
    if (event.deltaY < 0) {
      zoomValue *= zoomFactor;
    } else {
      zoomValue /= zoomFactor;
    }
    zoomValue = Math.max(0.1, Math.min(zoomValue, 12)); // ズーム範囲の制限

    // マウス座標を基準にカメラ中心を調整し、ピボット拡大縮小
    const ratio = zoomValue / oldZoom;

    // ピボットズーム計算：マウス位置を固定点として、centerXとcenterYを調整
    offsetX = mouseX - 1/ratio * (mouseX - offsetX);
    offsetY = (ctx.canvas.height-mouseY) - 1/ratio * ((ctx.canvas.height-mouseY) - offsetY);
    updateZoom();
  });

  // ズーム更新関数
  function updateZoom() {
    // シーン用バッファを再設定し、再描画を行う
    device.queue.writeBuffer(scene, 0, initializeSceneBuffer());

    // レンダリングを実行
    let commandEncoder = device.createCommandEncoder();

    commandEncoder = updateRender(commandEncoder);
    const commands = commandEncoder.finish();
    device.queue.submit([commands]);
  }
  // END マウスのズーム関係



  // 線分表示チェックボックスの制御
  enableLineCheckbox.addEventListener("change", () => {
    // チェックボックスの状態に応じて線分の有効/無効を切り替え   
    // 更新した値をGPUバッファに反映
    // 両方のバッファを更新
    device.queue.writeBuffer(line_input, 0, initializeInputLinesBuffer());
    device.queue.writeBuffer(line_output, 0, initializeInputLinesBuffer()); // line_outputも更新する
    // レンダリングの更新
    updateZoom();
  });
  // END 線分表示チェックボックスの制御



  let counter = 0;

  // メインループ
  async function updateGrid(actualFps) {
    // 実際のFPSから反復回数を計算
    const iteration = Math.ceil(1 / actualFps / dt);

    // コマンドを記録するエンコーダーを作成する
    let commandEncoder = device.createCommandEncoder();
    // cpu側でループする
    for (let i = 0; i < iteration; i++) {
      commandEncoder.clearBuffer(gl_atomic); // 初期化
      commandEncoder.clearBuffer(gl_output); // 初期化
      // 計算更新
      commandEncoder = updateCompute(commandEncoder);
      commandEncoder.copyBufferToBuffer(output, 0, input, 0, BUFFER_SIZE); // 粒子要素コピー
      commandEncoder.copyBufferToBuffer(gl_output, 0, gl_input, 0, GL_BUFFER_SIZE); // 粒子のインデックス配列をコピー

    }
    // END cpu側でループする場合

    // レンダリング更新
    commandEncoder = updateRender(commandEncoder);
    // 一連のコマンドをパッケージ化する
    const commands = commandEncoder.finish();
    // コマンド送信
    device.queue.submit([commands]);

    counter++;
  }
  // END メインループ

  // 変更後: requestAnimationFrameを使ったループ
  let animationId = undefined;
  let lastTime = 0;
  let elapsedTime = 0; // シミュレーション開始時間を保存
  const targetFps = 30; // 任意のFPS
  const frameDuration = 1000 / targetFps;
  function animate(currentTime) {
    // 初回実行時に開始時間を記録
    if (!lastTime) {
      lastTime = currentTime;
    }
    
    const deltaTime = currentTime - lastTime;
    // 設定したFPSより時間が経っていたら計算を実行する
    if (deltaTime >= frameDuration) {
      // 実際のFPSを計算（1秒あたりのフレーム数）
      const actualFps = 1000 / deltaTime;
      // console.log("actualFps", actualFps);
      // FPS表示を更新
      // drawFPS(actualFps, "FPS");
      if(actualFps < 1){
        stopSimulation()
        alert("計算が重いため、シミュレーションを停止しました \n 粒子数を見直してください。");
        return
      }
      // 経過時間を計算（ミリ秒から秒に変換）
      elapsedTime = elapsedTime + deltaTime / 1000;
      
      // 時間表示を更新
      drawFPS(elapsedTime, "s");
      // 現在の時間を保存しておく 
      lastTime = currentTime;
      // 計算実行 
      updateGrid(actualFps);
    }
    
    animationId = requestAnimationFrame(animate);
  }

  // スタート処理
  function start() {
    // スタートしていなければスタートする
    if(animationId === undefined){
      animationId = requestAnimationFrame(animate);
      lastTime = undefined;
      console.log("Simulation started.");
    }
  }

  // Start ボタンのイベントリスナーを追加
  startButton.addEventListener("click", start, false);



  // ストップ処理
  function stopSimulation() {
    // スタートしていればストップする
    if (animationId !== undefined) {
      cancelAnimationFrame(animationId);
      animationId = undefined;
    }
    console.log("Simulation stopped.");
  }

  // Stop ボタンのイベントリスナーを追加
  stopButton.addEventListener("click", stopSimulation, false);

  // シミュレーションリセット処理
  function resetSimulation() {
    // スタートしていれば停止する
    if (animationId !== undefined) {
      cancelAnimationFrame(animationId);
      animationId = undefined;
    }

    // シミュレーションカウンタのリセット
    elapsedTime = 0;
    lastTime = undefined;
    counter = 0;
    drawFPS(elapsedTime, "s");
    // バッファの初期化
    initializeState();

    console.log("Simulation reset complete.");
  }
  // Reset ボタンのイベントリスナーを追加
  resetButton.addEventListener("click", resetSimulation, false);

  // リセット押下時の処理
  function resetView() {
    // 各パラメータを初期化
    isDragging = false;
    lastMouseX = 0;
    lastMouseY = 0;
    zoomValue = 1.0;
    offsetX = 0;
    offsetY = 0;
    // 更新
    updateZoom();
  }

  // restart ボタンのイベントリスナーを追加
  resetViewButton.addEventListener("click", resetView, false);

  // aとbの間のランダムな数を計算する関数
  function random(a, b) {
    return Math.random() * (b - a) + a;
  }

  // クランプ関数
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  
})();