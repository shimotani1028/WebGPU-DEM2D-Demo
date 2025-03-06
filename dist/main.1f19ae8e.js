// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"main.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
  var params, parameter, adapter, _adapter$limits, maxBufferSize, maxStorageBufferBindingSize, device, canvas, width, height, ctx, widthLength, NUM_LINES, LINE_BUFFER_COUNT, LINE_BUFFER_SIZE, x1, y1, x2, y2, NUM_BALLS, BUFFER_COUNT, BUFFER_SIZE, minRadius, maxRadius, spacing, nx, grid_size, GL_BUFFER_SIZE, GL_ATOMIC_BUFFER_SIZE, theta, maxContactParticleNumber, EF_BUFFER_SIZE, EF_INDEX_BUFFER_SIZE, fps, offsetX, offsetY, zoomValue, colorMode, isDragging, lastMouseX, lastMouseY, enableLineCheckbox, overlayCanvas, modeRadioId, modeRadioVabs, startButton, resetButton, stopButton, resetViewButton, initializeSceneBuffer, inputBalls, i, initializeInputBallsBuffer, initializeInputLinesBuffer, canvasFormat, fatal, module, bindGroupLayout1, bindGroupLayout2, pipeline, scene, input, output, ef_input, ef_index_input, gl_input, gl_output, gl_atomic, line_input, line_output, bindGroup1, bindGroup2, cellShaderModule, createCircleVertices, vertices, vertexBuffer, vertexBufferLayout, renderBindGroupLayout, renderBindGroup, renderPipelineLayout, cellPipeline, lineShaderModule, lineVertexBufferLayout, lineVertices, lineVertexBuffer, lineBindGroup, linePipeline, updateCompute, updateRender, initializeState, overlayCtx, drawFPS, changeColorMode, updateZoom, counter, timerId, UPDATE_INTERVAL, updateGrid, _updateGrid, start, stopSimulation, resetSimulation, resetView, random, clamp;
  return _regeneratorRuntime().wrap(function _callee2$(_context2) {
    while (1) switch (_context2.prev = _context2.next) {
      case 0:
        clamp = function _clamp(value, min, max) {
          return Math.min(Math.max(value, min), max);
        };
        random = function _random(a, b) {
          return Math.random() * (b - a) + a;
        };
        resetView = function _resetView() {
          // 各パラメータを初期化
          isDragging = false;
          lastMouseX = 0;
          lastMouseY = 0;
          zoomValue = 1.0;
          offsetX = 0;
          offsetY = 0;
          // 更新
          updateZoom();
        };
        resetSimulation = function _resetSimulation() {
          // タイマーが動作中なら停止
          if (timerId !== undefined) {
            clearInterval(timerId);
            timerId = undefined;
          }

          // シミュレーションカウンタのリセット
          counter = 0;
          drawFPS(counter * UPDATE_INTERVAL / 1000, "s");
          initializeState();
          console.log("Simulation reset complete.");
        };
        stopSimulation = function _stopSimulation() {
          if (timerId !== undefined) {
            clearInterval(timerId);
            timerId = undefined;
          }
          console.log("Simulation stopped.");
        };
        start = function _start() {
          // シミュレーションリセット
          if (timerId === undefined) {
            // シミュレーション開始
            timerId = setInterval(updateGrid, UPDATE_INTERVAL);
          } else {
            console.log('すでにスタートしています。');
          }
        };
        _updateGrid = function _updateGrid3() {
          _updateGrid = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
            var start, commandEncoder, _i4, commands, end;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  // 処理開始時間を記録
                  start = performance.now(); // cpu側でループする
                  // const dispatchSize = Math.ceil(NUM_BALLS / 64);
                  commandEncoder = device.createCommandEncoder();
                  for (_i4 = 0; _i4 < 400; _i4++) {
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
                  commands = commandEncoder.finish();
                  device.queue.submit([commands]);

                  // 処理終了時間を記録
                  end = performance.now(); // 計算時間を表示(s)
                  drawFPS(counter * UPDATE_INTERVAL / 1000, "s");
                  counter++;
                case 9:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          }));
          return _updateGrid.apply(this, arguments);
        };
        updateGrid = function _updateGrid2() {
          return _updateGrid.apply(this, arguments);
        };
        updateZoom = function _updateZoom() {
          // シーン用バッファを再設定し、再描画を行う
          device.queue.writeBuffer(scene, 0, initializeSceneBuffer());

          // レンダリングを実行
          var commandEncoder = device.createCommandEncoder();
          commandEncoder = updateRender(commandEncoder);
          var commands = commandEncoder.finish();
          device.queue.submit([commands]);
        };
        changeColorMode = function _changeColorMode(mode) {
          switch (mode) {
            case "id":
              colorMode = 0;
              break;
            case "vabs":
              colorMode = 1;
              break;
          }

          // 再レンダリング
          updateZoom();
        };
        drawFPS = function _drawFPS(timeInSec, unit) {
          overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
          // フォントサイズを設定（固定サイズを維持）
          var fontSize = 24;
          overlayCtx.font = "".concat(fontSize, "px serif");
          overlayCtx.fillStyle = "white";
          var text = timeInSec.toFixed(2) + " " + unit;
          // テキストの横幅を測定
          var textWidth = overlayCtx.measureText(text).width;
          // 右上に配置（右端から20px、上端から20px離す）
          var x = overlayCanvas.width - textWidth - 40;
          var y = fontSize + 20; // フォントサイズ + 余白
          // テキスト描画
          overlayCtx.fillText(text, x, y);
        };
        initializeState = function _initializeState() {
          // シーン用バッファを再設定し、再描画を行う
          device.queue.writeBuffer(scene, 0, initializeSceneBuffer());

          // 初期化用のバッファデータの粒子要素の配列
          device.queue.writeBuffer(input, 0, initializeInputBallsBuffer());

          // 初期化用のバッファデータの線分要素の配列
          device.queue.writeBuffer(line_input, 0, initializeInputLinesBuffer());
          device.queue.writeBuffer(line_output, 0, initializeInputLinesBuffer());

          // 初期化用のバッファデータの接触力の配列
          var ef_inputBalls = new Float32Array(new ArrayBuffer(EF_BUFFER_SIZE));
          device.queue.writeBuffer(ef_input, 0, ef_inputBalls);
          // 初期化用のバッファデータの接触力の相手粒子の配列
          var ef_index_inputBalls = new Uint32Array(new ArrayBuffer(EF_INDEX_BUFFER_SIZE));
          device.queue.writeBuffer(ef_index_input, 0, ef_index_inputBalls);
          // 初期化用のバッファデータの接触相手粒子の配列
          var gl_inputBalls = new Uint32Array(new ArrayBuffer(GL_BUFFER_SIZE));
          device.queue.writeBuffer(gl_input, 0, gl_inputBalls);
          // 初期化用のバッファデータの接触相手の粒子数の配列
          var gl_input_atomic = new Uint32Array(new ArrayBuffer(GL_ATOMIC_BUFFER_SIZE));
          device.queue.writeBuffer(gl_atomic, 0, gl_input_atomic);

          // GPUコマンドの作成
          var commandEncoder = device.createCommandEncoder();
          // 一度計算する
          commandEncoder = updateCompute(commandEncoder);
          // バッファのコピー

          commandEncoder.copyBufferToBuffer(output, 0, input, 0, BUFFER_SIZE);
          commandEncoder.copyBufferToBuffer(gl_output, 0, gl_input, 0, GL_BUFFER_SIZE);

          // レンダリングを実行
          commandEncoder = updateRender(commandEncoder);
          device.queue.submit([commandEncoder.finish()]); // commandEncoder.finish()でコマンドリストを完成させ、device.queue.submit()でGPUに送信することで、実際の処理が行われる
        };
        updateRender = function _updateRender(commandEncoder) {
          var renderPassDescriptor = {
            colorAttachments: [{
              view: ctx.getCurrentTexture().createView(),
              loadOp: "clear",
              clearValue: {
                r: 0,
                g: 0,
                b: 0.4,
                a: 1
              },
              storeOp: "store"
            }]
          };
          var renderPassEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
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
        };
        updateCompute = function _updateCompute(commandEncoder) {
          var dispatchSize = Math.ceil(NUM_BALLS / 64);
          var computePassEncoder = commandEncoder.beginComputePass(); // 「これから計算処理の指示を記録します」という宣言
          computePassEncoder.setPipeline(pipeline); // どのシェーダープログラムを実行するかを指定
          computePassEncoder.setBindGroup(0, bindGroup1); // シェーダーが使用するデータリソースを指定(粒子)
          computePassEncoder.setBindGroup(1, bindGroup2); // シェーダーが使用するデータリソースを指定(線分)
          computePassEncoder.dispatchWorkgroups(dispatchSize); // 「ワークグループ」と呼ばれる計算ユニットをいくつ起動するかを指定
          computePassEncoder.end(); // 「計算処理の指示はここまでです」という宣言
          return commandEncoder;
        };
        createCircleVertices = function _createCircleVertices(centerX, centerY, radius, segments) {
          var vertices = [];
          for (var _i3 = 1; _i3 < segments; _i3++) {
            // 一つ欠けさせるために0番目はスキップ
            var theta1 = _i3 / segments * 2.0 * Math.PI;
            var theta2 = (_i3 + 1) / segments * 2.0 * Math.PI;
            var _x = centerX + radius * Math.cos(theta1);
            var _y = centerY + radius * Math.sin(theta1);
            var _x2 = centerX + radius * Math.cos(theta2);
            var _y2 = centerY + radius * Math.sin(theta2);
            // 頂点データに中心点と円周上の点を追加
            vertices.push(centerX, centerY, _x, _y, _x2, _y2);
          }
          return new Float32Array(vertices);
        };
        fatal = function _fatal(msg) {
          document.body.innerHTML = "<pre>".concat(msg, "</pre>");
          throw Error(msg);
        };
        initializeInputLinesBuffer = function _initializeInputLines() {
          // 線分要素の配列
          var inputLines = new Float32Array(new ArrayBuffer(LINE_BUFFER_SIZE)); //32bitは4byteなので、4の整数倍のバイト数にする
          // 初期値の代入
          for (var _i = 0; _i < NUM_LINES; _i++) {
            inputLines[_i * LINE_BUFFER_COUNT + 0] = maxRadius; // 線分の厚さ
            inputLines[_i * LINE_BUFFER_COUNT + 1] = 1; // 線分が有効かどうかのフラグ
            inputLines[_i * LINE_BUFFER_COUNT + 2] = x1; // x1
            inputLines[_i * LINE_BUFFER_COUNT + 3] = y1; // y1
            inputLines[_i * LINE_BUFFER_COUNT + 4] = x2; // x2
            inputLines[_i * LINE_BUFFER_COUNT + 5] = y2; // y2
            inputLines[_i * LINE_BUFFER_COUNT + 6] = 0; //random(-1000, 1000); // 重心の速度x
            inputLines[_i * LINE_BUFFER_COUNT + 7] = 0; //random(-1000, 1000); // 重心の速度y
            inputLines[_i * LINE_BUFFER_COUNT + 8] = 90.0; // angle:角度
            inputLines[_i * LINE_BUFFER_COUNT + 9] = 0.0; // angular_velocity:角速度
          }

          // 線分の初期状態をチェックボックスに合わせる
          var lineEnabled = enableLineCheckbox.checked;
          for (var _i2 = 0; _i2 < NUM_LINES; _i2++) {
            inputLines[_i2 * LINE_BUFFER_COUNT + 1] = lineEnabled ? 1 : 0;
          }
          return inputLines;
        };
        initializeInputBallsBuffer = function _initializeInputBalls() {
          return inputBalls;
        };
        initializeSceneBuffer = function _initializeSceneBuffe() {
          return new Float32Array([ctx.canvas.width, ctx.canvas.height, widthLength, fps, minRadius, maxRadius, nx, grid_size, spacing, NUM_BALLS, maxContactParticleNumber,
          // offsetX, offsetY を追加
          offsetX, offsetY,
          // 最後にズーム係数
          zoomValue,
          // カラーモード
          colorMode]);
        };
        parameter = function _parameter(name, def) {
          if (!params.has(name)) return def;
          return parseFloat(params.get(name));
        };
        params = new URLSearchParams(location.search); // URLからパラメータを取得する。なければデフォルト値を代入(例:***?balls=16000&min_radius=0.015&max_radius=0.02)
        // GPUが使用可能化どうか
        if (!("gpu" in navigator)) fatal("WebGPU not supported. Please enable it in about:flags in Chrome or in about:config in Firefox.");

        // GPUの仕様を確認する
        _context2.next = 24;
        return navigator.gpu.requestAdapter();
      case 24:
        adapter = _context2.sent;
        if (!adapter) fatal("Couldn’t request WebGPU adapter.");
        _adapter$limits = adapter.limits, maxBufferSize = _adapter$limits.maxBufferSize, maxStorageBufferBindingSize = _adapter$limits.maxStorageBufferBindingSize; // 最大バッファサイズの確認
        console.log("maxBufferSize= ", maxBufferSize);
        console.log("maxStorageBufferBindingSize= ", maxStorageBufferBindingSize);

        // GPUの制限を変更する
        _context2.next = 31;
        return adapter.requestDevice({
          requiredLimits: {
            maxStorageBuffersPerShaderStage: 10 // stragebufferの上限を引き上げる(エラー例:The number of storage buffers (12) in the Compute stage exceeds the maximum per-stage limit (10))
          }
        });
      case 31:
        device = _context2.sent;
        if (!device) fatal("Couldn’t request WebGPU device.");
        console.log("device limit= ", device.limits);

        // canvas要素に関するパラメータ
        canvas = document.getElementById("webgpuCanvas"); //document.querySelector("canvas"); // 描画するキャンバス要素
        width = parameter("width", 1000); // キャンバスの幅(px)
        height = parameter("height", 500); // キャンバスの高さ(px)
        canvas.width = width; // キャンバスの幅(px)
        canvas.height = height; // キャンバスの高さ(px)
        ctx = canvas.getContext("webgpu"); // "webgpu"コンテキストを取得
        // キャンバスのサイズ設定（属性とスタイル両方を設定）
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        widthLength = parameter("width_length", 15.0); // canvas要素のwidthに対する実際の長さ(m)
        // 線分要素に関するパラメータ
        NUM_LINES = 1; //parameter("line", 1); // 線分数
        LINE_BUFFER_COUNT = 10; // 線分に対する必要な要素(位置、速度、...)
        LINE_BUFFER_SIZE = NUM_LINES * LINE_BUFFER_COUNT * Float32Array.BYTES_PER_ELEMENT; // 線分の配列に必要なバッファサイズ
        x1 = parameter("x1", 4.0); // canvas要素のwidthに対する実際の長さ(m)
        y1 = parameter("y1", 0.0); // canvas要素のwidthに対する実際の長さ(m)
        x2 = parameter("x2", 4.0); // canvas要素のwidthに対する実際の長さ(m)
        y2 = parameter("y2", 6.0); // canvas要素のwidthに対する実際の長さ(m)
        // 粒子要素に関するパラメータ
        NUM_BALLS = parameter("balls", 12000); // 粒子数
        BUFFER_COUNT = 8; // 粒子に対する必要な要素(位置、速度、...)
        BUFFER_SIZE = NUM_BALLS * BUFFER_COUNT * Float32Array.BYTES_PER_ELEMENT; // 粒子の配列に必要なバッファサイズ
        minRadius = clamp(parameter("min_radius", 0.01), 0.01, 0.1); // 最小粒子半径
        maxRadius = clamp(parameter("max_radius", 0.02), minRadius, 0.1); // 最大粒子半径
        // 粒子を格納する格子に関するパラメータ
        spacing = 2 * 2 * maxRadius + 0.001; // 格子間隔(最大直径の2倍は境界で処理がうまくできない場合があるので、少し余裕を持たせる
        nx = Math.ceil(widthLength / spacing); // x方向の格子点数
        grid_size = Math.pow(Math.ceil(spacing / (2 * minRadius)), 2); // 格子ごとのサイズ
        GL_BUFFER_SIZE = nx * Math.ceil(nx * ctx.canvas.height / ctx.canvas.width) * grid_size * Uint32Array.BYTES_PER_ELEMENT; // 粒子iが接触する粒子jのインデックスを格納する配列に必要なバッファサイズ
        GL_ATOMIC_BUFFER_SIZE = nx * Math.ceil(nx * ctx.canvas.height / ctx.canvas.width) * Uint32Array.BYTES_PER_ELEMENT; // 粒子iが接触する粒子の数を格納する配列に必要なバッファサイズ
        theta = 2 * Math.atan(minRadius / Math.sqrt(Math.pow(minRadius + maxRadius, 2) - Math.pow(minRadius, 2))); // 最大粒子径に接触する2つの最小粒子の最大粒子の中心からの角度
        maxContactParticleNumber = Math.ceil(2 * Math.PI / theta); // 最大半径の粒子の周りに接触できる最小半径の粒子の数(一応切り上げる)(2次元)
        EF_BUFFER_SIZE = NUM_BALLS * (maxContactParticleNumber + 4 + NUM_LINES) * 2 * Float32Array.BYTES_PER_ELEMENT; // 接触力を保存する配列に必要なバッファサイズ。*2はxとy, ＋4は上下左右の壁の分
        EF_INDEX_BUFFER_SIZE = NUM_BALLS * maxContactParticleNumber * Uint32Array.BYTES_PER_ELEMENT; // 接触力の相手の粒子のインデックスを保存するためのバッファサイズ 
        // その他のパラメータ  
        fps = 30.0; // フレームレート
        offsetX = 0; // ズーム(拡大・縮小)に関するパラメータ
        offsetY = 0; // ズーム(拡大・縮小)に関するパラメータ
        zoomValue = 1.0; // ズーム(拡大・縮小)に関するパラメータ
        colorMode = 0; // カラーモード
        canvas.style.cursor = "grab"; // デフォルトを grab に設定
        isDragging = false; // マウスのドラッグ判定
        lastMouseX = 0; // マウスのgrab位置Xの保存用
        lastMouseY = 0; // マウスのgrab位置Yの保存用
        enableLineCheckbox = document.getElementById("enableLine"); // チェックボックス
        overlayCanvas = document.getElementById("overlayCanvas"); // overlay 用キャンバス
        modeRadioId = document.getElementById("modeId"); // ラジオボタン(粒子番号)
        modeRadioVabs = document.getElementById("modeVabs"); // ラジオボタン(速度(絶対値))
        startButton = document.getElementById("start"); // スタートボタン
        resetButton = document.getElementById("reset"); // リセットボタン
        stopButton = document.getElementById("stop"); // スタートボタン
        resetViewButton = document.getElementById("reset_view"); // 描画リセットボタン
        // sceneバッファの初期化処理(zoomValueやcolorModeはグローバル変数で変更されることがある)
        // 初期化用のバッファデータを用意(粒子半径はランダムであるため、読み込み時に固定する)
        // 各粒子の初期値を定義
        inputBalls = new Float32Array(new ArrayBuffer(BUFFER_SIZE));
        for (i = 0; i < NUM_BALLS; i++) {
          inputBalls[i * BUFFER_COUNT + 0] = random(minRadius, maxRadius); //radius;
          inputBalls[i * BUFFER_COUNT + 2] = maxRadius + i % (widthLength / (maxRadius * 2 * 4)) * maxRadius * 2; //random(0, ctx.canvas.width);
          inputBalls[i * BUFFER_COUNT + 3] = maxRadius + Math.floor(i / (widthLength / (maxRadius * 2 * 4))) * maxRadius * 2; //random(0, ctx.canvas.height);
          inputBalls[i * BUFFER_COUNT + 4] = 0;
          inputBalls[i * BUFFER_COUNT + 5] = 0;
          inputBalls[i * BUFFER_COUNT + 6] = 0.0;
          inputBalls[i * BUFFER_COUNT + 7] = 0.0;
        }
        // 粒子要素の初期化処理

        // 線分要素の初期化処理

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
        canvasFormat = navigator.gpu.getPreferredCanvasFormat(); // コンテキストに関連付ける
        ctx.configure({
          device: device,
          // 前で作成したWebGPUデバイスをキャンバスに関連付け
          format: canvasFormat // 先ほど取得した最適なピクセルフォーマットを指定
        });

        // エラー内容の表示
        module = device.createShaderModule({
          code: "\n    struct Ball {\n      radius: f32,\n      padding: f32,\n      position: vec2<f32>,\n      velocity: vec2<f32>,\n      angle: f32,\n      anguler_velocity: f32,\n    }\n\n    @group(0) @binding(0)\n    var<storage, read_write> input: array<Ball>;\n\n    @group(0) @binding(1)\n    var<storage, read_write> output: array<Ball>;\n\n    struct EF {\n      resilience_force: vec2<f32>,\n    }\n\n    @group(0) @binding(2)\n    var<storage, read_write> ef_input: array<EF>; // \u5FA9\u5143\u529B\n\n\n    struct Scene {\n      width: f32, // canvas\u306E\u5E45(pixel)\n      height: f32, // canvas\u306E\u9AD8\u3055(pixel)\n      L: f32, // canvas\u306E\u5E45(m)\n      fps: f32, // \u30D5\u30EC\u30FC\u30E0\u30EC\u30FC\u30C8\n      minRadius: f32, // \u7C92\u5B50\u306E\u6700\u5C0F\u534A\u5F84(m)\n      maxRadius: f32, // \u7C92\u5B50\u306E\u6700\u5927\u534A\u5F84(m)\n      nx: f32, // x\u65B9\u5411\u306E\u683C\u5B50\u70B9\u6570\n      grid_size: f32, // 1\u30B0\u30EA\u30C3\u30C9\u3042\u305F\u308A\u306E\u6700\u5927\u8981\u7D20\u6570\n      spacing: f32, // \u683C\u5B50\u9593\u9694\n      numBalls: u32, // \u7C92\u5B50\u6570\n      maxContactParticleNumber: f32, // \u6700\u5927\u63A5\u89E6\u7C92\u5B50\u6570\n    }\n\n    @group(0) @binding(3)\n    var<uniform> scene: Scene;\n\n \n    @group(0) @binding(4)\n    var<storage, read_write> gl_input: array<u32>;\n\n    @group(0) @binding(5)\n    var<storage, read_write> gl_output: array<u32>;\n\n    @group(0) @binding(6)\n    var<storage, read_write> gl_atomic : array<atomic<u32>>;\n\n    @group(0) @binding(7)\n    var<storage, read_write> ef_index_input: array<u32>; // \u5FA9\u5143\u529B\u306E\u76F8\u624B\u7C92\u5B50\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\n\n\n    struct Line {\n      thickness: f32,\n      isValid: u32,\n      position_1: vec2<f32>,\n      position_2: vec2<f32>,\n      velocity: vec2<f32>,\n      angle: f32,\n      anguler_velocity: f32,\n    }\n\n    @group(1) @binding(0)\n    var<storage, read_write> line_input: array<Line>;\n\n    @group(1) @binding(1)\n    var<storage, read_write> line_output: array<Line>;\n\n\n\n    const PI: f32 = 3.14159;                        // \u5186\u5468\u7387\n    // const TIME_STEP: f32 = 0.0016;                   // \u6642\u9593\u523B\u307F(s)\n    const E: f32 = 70e+4;                           // \u30E4\u30F3\u30B0\u7387(kN/m2) \u4F8B:70e+9\n    const v: f32 = 0.35;                            // \u30DD\u30A2\u30BD\u30F3\u6BD4\n    const k_n: f32 = 9.0e+6; //PI*E*(1-v)/(4*(1+v)*(1-2*v));  // \u6CD5\u7DDA\u65B9\u5411\u3070\u306D\u5B9A\u6570(kN/m)\n    const k_s: f32 = 3.0e+6; //PI*E/(8*(1+v));                // \u63A5\u7DDA\u65B9\u5411\u3070\u306D\u5B9A\u6570(kN/m)\n    const c: f32 = 0.0;                             // \u307F\u304B\u3051\u306E\u7C98\u7740\u529B(kN/m2)\n    const fai: f32 = 30.0;                           // \u6469\u64E6\u89D2(\xB0)\n    const g: f32 = -9.81;                           // \u91CD\u529B\u52A0\u901F\u5EA6(m/s2)\n    const rho: f32 = 2.5e+3;                        // \u5BC6\u5EA6(kg/m3)\n    const e_n: f32 = 1.0;                           // \u6CD5\u7DDA\u65B9\u5411\u306F\u306D\u8FD4\u308A\u4FC2\u6570\n    const e_s: f32 = 1.0;                           // \u63A5\u7DDA\u65B9\u5411\u306F\u306D\u8FD4\u308A\u4FC2\u6570\n    const h: f32 = 0.1;                           // \u4FC2\u6570\n    const maxContactParticleNumber: u32 = ".concat(maxContactParticleNumber, ";      // \u6700\u5927\u63A5\u89E6\u7C92\u5B50\u6570(\u914D\u5217\u306E\u8981\u7D20\u6570\u3092\u56FA\u5B9A\u3059\u308B\u305F\u3081\u3053\u3053\u3067\u5B9A\u7FA9\u3059\u308B)\n    const maxLineNumber: u32 = ").concat(NUM_LINES, "; // \u6700\u5927\u7DDA\u5206\u6570\n    \n\n    // eta(\u7C98\u6027\u4FC2\u6570)\u3092\u6C42\u3081\u308B(\u5BFE\u7C92\u5B50)\n    fn calculationEta(m_i: f32, m_j: f32) -> vec2<f32> {\n      let m_ij = 2* m_i * m_j / (m_i + m_j);\n      // let eta_n = -2*log(e_n)*sqrt( ( m_ij * k_n ) / ( pow(PI, 2) + pow(log(e_n), 2) ) );\n      // let eta_s = -2*log(e_s)*sqrt( ( m_ij * k_s ) / ( pow(PI, 2) + pow(log(e_s), 2) ) );\n      let eta_n = h*2*sqrt(m_ij*k_n);\n      let eta_s = h*2*sqrt(m_ij*k_s);\n      return vec2<f32>(2.0e+3, 1.0e+3); //vec2<f32>(eta_n, eta_s);\n    }\n\n    // eta(\u7C98\u6027\u4FC2\u6570)\u3092\u6C42\u3081\u308B(\u5BFE\u58C1)\n    fn calculationEtaWithWall(m_i: f32) -> vec2<f32> {\n      let m_ij = m_i;\n      // let eta_n = -2*log(e_n)*sqrt( ( m_ij * k_n ) / ( pow(PI, 2) + pow(log(e_n), 2) ) );\n      // let eta_s = -2*log(e_s)*sqrt( ( m_ij * k_s ) / ( pow(PI, 2) + pow(log(e_s), 2) ) );\n      let eta_n = h*2*sqrt(m_ij*k_n);\n      let eta_s = h*2*sqrt(m_ij*k_s);\n      return vec2<f32>(2.0e+3, 1.0e+3); //vec2<f32>(eta_n, eta_s);\n    }\n\n    // \u885D\u7A81\u5F8C\u306E\u7C92\u5B50\u540C\u58EB\u306E\u76F8\u5BFE\u901F\u5EA6\u3092\u6C42\u3081\u308B\n    fn calculationVelocityAfterCollision(position_i: vec2<f32>, velocity_i: vec2<f32>, anguler_velocity_i: f32, radius_i: f32, position_j: vec2<f32>, velocity_j: vec2<f32>, anguler_velocity_j: f32, radius_j: f32) -> vec2<f32> {\n      let lx = position_j.x - position_i.x;\n      let ly = position_j.y - position_i.y;\n      let ld = sqrt(lx * lx + ly * ly);\n      let cos_a_ji = lx/ld;\n      let sin_a_ji = ly/ld;\n      let u_ji_n =  (velocity_i.x - velocity_j.x) * cos_a_ji + (velocity_i.y - velocity_j.y) * sin_a_ji;\n      let u_ji_s = -(velocity_i.x - velocity_j.x) * sin_a_ji + (velocity_i.y - velocity_j.y) * cos_a_ji + radius_i * anguler_velocity_i + radius_j * anguler_velocity_j;\n      return vec2<f32>(u_ji_n, u_ji_s);\n    }\n\n    // \u885D\u7A81\u5F8C\u306E\u7C92\u5B50\u540C\u58EB\u306E\u76F8\u5BFE\u901F\u5EA6\u3092\u6C42\u3081\u308B(\u5BFE\u58C1)\n    fn calculationVelocityAfterCollisionWithWall(velocity_i: vec2<f32>, anguler_velocity_i: f32, radius_i: f32, alpha: f32) -> vec2<f32> {\n      let cos_a_ji = cos(radians(alpha));\n      let sin_a_ji = sin(radians(alpha));\n      let u_ji_n =  (velocity_i.x) * cos_a_ji + (velocity_i.y) * sin_a_ji;\n      let u_ji_s = -(velocity_i.x) * sin_a_ji + (velocity_i.y) * cos_a_ji + radius_i * anguler_velocity_i;\n      return vec2<f32>(u_ji_n, u_ji_s);\n    }\n\n    // \u885D\u7A81\u5F8C\u306E\u7C92\u5B50\u540C\u58EB\u306E\u76F8\u5BFE\u901F\u5EA6\u3092\u6C42\u3081\u308B(\u5BFE\u7DDA\u5206)\n    fn calculationVelocityAfterCollisionWithStackLine(position_i: vec2<f32>, velocity_i: vec2<f32>, anguler_velocity_i: f32, radius_i: f32, position_j: vec2<f32>, velocity_j: vec2<f32>, anguler_velocity_j: f32, radius_j: f32) -> vec2<f32> {\n      let lx = position_j.x - position_i.x;\n      let ly = position_j.y - position_i.y;\n      let ld = sqrt(lx * lx + ly * ly);\n      let cos_a_ji = lx/ld;\n      let sin_a_ji = ly/ld;\n      let u_ji_n =  (velocity_i.x - velocity_j.x) * cos_a_ji + (velocity_i.y - velocity_j.y) * sin_a_ji;\n      let u_ji_s = -(velocity_i.x - velocity_j.x) * sin_a_ji + (velocity_i.y - velocity_j.y) * cos_a_ji + radius_i * anguler_velocity_i + radius_j * anguler_velocity_j;\n      return vec2<f32>(u_ji_n, u_ji_s);\n    }\n\n\n    // \u5FA9\u5143\u529B\u3092\u6C42\u3081\u308B(x,y\u306Fn,s)\n    fn calculationRestoringForceNS(resilience_force: vec2<f32>, u_ji: vec2<f32>, k_n: f32, k_s: f32, timeStep: f32) -> vec2<f32> {\n      return vec2<f32>(resilience_force.x + k_n * u_ji.x * timeStep, resilience_force.y + k_s * u_ji.y * timeStep);\n    }\n\n\n    // \u7C98\u6027\u529B\u3092\u6C42\u3081\u308B(x,y\u306Fn,s)\n    fn calculationViscousForceNS(eta_n: f32, eta_s: f32, u_ji_n: f32, u_ji_s: f32) -> vec2<f32> {\n      return vec2<f32>(eta_n*u_ji_n, eta_s*u_ji_s);\n    }\n\n\n    // \u5F3E\u6027\u529B\u3092\u6C42\u3081\u308B(x,y\u306Fn,s)\n    fn calculationElasticForceNS(resilience_force: vec2<f32>, viscous_force: vec2<f32>) -> vec2<f32> {\n      // \u6CD5\u7DDA\u65B9\u5411\n      var f_ji_n: f32;\n      if(resilience_force.x >= 0){\n        f_ji_n = resilience_force.x + viscous_force.x;\n      }else{\n        f_ji_n = 0.0;\n      }\n      // \u63A5\u7DDA\u65B9\u5411(\u500B\u5225\u8981\u7D20\u6CD5\u306B\u3088\u308B\u7C92\u72B6\u4F53\u306E\u529B\u5B66\u7684\u6319\u52D5\u306B\u95A2\u3059\u308B\u89E3\u6790\u7684\u7814\u7A76(\u305D\u306E1)\u3088\u308A)\n      var f_ji_s: f32;\n      if(resilience_force.x < 0){\n        f_ji_s = 0.0;\n      }else if(abs(resilience_force.y) > tan(radians(fai))*resilience_force.x + c){\n        f_ji_s = (tan(radians(fai))*resilience_force.x + c)*sign(resilience_force.y);\n      }else{\n        f_ji_s = resilience_force.y + viscous_force.y;\n      }\n      return vec2<f32>(f_ji_n, f_ji_s);\n    }\n\n    // \u5F3E\u6027\u529B\u3092xy\u6210\u5206\u306B\u5206\u89E3\u3059\u308B(\u5F15\u6570\u306Ex,y\u306Fn,s)\n    fn calculationElasticForceXY(f_ji: vec2<f32>, position_i: vec2<f32>, position_j: vec2<f32>) -> vec2<f32> {\n      let lx = position_j.x - position_i.x;\n      let ly = position_j.y - position_i.y;\n      let ld = sqrt(lx * lx + ly * ly);\n      let cos_a_ji = lx/ld;\n      let sin_a_ji = ly/ld;\n      let f_ji_x = -f_ji.x * cos_a_ji + f_ji.y * sin_a_ji;\n      let f_ji_y = -f_ji.x * sin_a_ji - f_ji.y * cos_a_ji;\n      return vec2<f32>(f_ji_x, f_ji_y);\n    }\n\n    // \u5F3E\u6027\u529B\u3092xy\u6210\u5206\u306B\u5206\u89E3\u3059\u308B(\u5BFE\u58C1)\n    fn calculationElasticForceXYWithWall(f_ji: vec2<f32>, alpha: f32) -> vec2<f32> {\n      let cos_a_ji = cos(radians(alpha));\n      let sin_a_ji = sin(radians(alpha));\n      let f_ji_x = -f_ji.x * cos_a_ji + f_ji.y * sin_a_ji;\n      let f_ji_y = -f_ji.x * sin_a_ji - f_ji.y * cos_a_ji;\n      return vec2<f32>(f_ji_x, f_ji_y);\n    }\n\n    // \u7C92\u5B50\u306E\u52A0\u901F\u5EA6\u3092\u6C42\u3081\u308B\n    fn calculationAcceleration(m_i: f32, F_i: f32, G_i: f32) -> vec2<f32> {\n      return vec2<f32>(F_i/m_i, G_i/m_i + g);\n    }\n\n    // \u7C92\u5B50\u306E\u901F\u5EA6\u3092\u6C42\u3081\u308B\n    fn calculationVelocity(velocity: vec2<f32>, acceleration: vec2<f32>, timeStep: f32) -> vec2<f32> {\n      return vec2<f32>(velocity.x + acceleration.x * timeStep, velocity.y + acceleration.y * timeStep);\n    }\n\n    // \u7C92\u5B50\u306E\u4F4D\u7F6E\u3092\u6C42\u3081\u308B\n    fn calculationPosition(position: vec2<f32>, velocity: vec2<f32>, timeStep: f32) -> vec2<f32> {\n      return vec2<f32>(position.x + velocity.x * timeStep, position.y + velocity.y * timeStep);\n    }\n\n    // \u7C92\u5B50\u306E\u89D2\u52A0\u901F\u5EA6\u3092\u6C42\u3081\u308B\n    fn calculationAngularAcceleration(I_i: f32, T_i: f32) -> f32 {\n      return f32(T_i/I_i);\n    }\n\n    // \u7C92\u5B50\u306E\u89D2\u901F\u5EA6\u3092\u6C42\u3081\u308B\n    fn calculationAngularVelocity(angular_velocity: f32, angular_acceleration: f32, timeStep: f32) -> f32 {\n      return f32(angular_velocity + angular_acceleration * timeStep);\n    }\n\n    // \u7C92\u5B50\u306E\u89D2\u5EA6\u3092\u6C42\u3081\u308B\n    fn calculationAngle(angle: f32, angular_velocity: f32, timeStep: f32) -> f32 {\n      return f32(angle + angular_velocity * timeStep);\n    }\n\n    // \u7C92\u5B50\u3068\u7DDA\u5206\u306E\u63A5\u89E6\u5224\u5B9A\u7528\n    // \u63A5\u89E6\u5224\u5B9A\u306E\u305F\u3081\u306E\u30D9\u30AF\u30C8\u30EBAC\u3092\u7B97\u51FA\u3059\u308B\n    fn calVectorAC(line: Line, position: vec2<f32>) -> vec2<f32>{\n      return position - line.position_1;\n    }\n\n    // t'\u3092\u7B97\u51FA\u3059\u308B\n    fn calTDash(line: Line, AC:vec2<f32>) -> f32 {\n      // \u7DDA\u5206AB\u306E\u30D9\u30AF\u30C8\u30EB\n      let AB = line.position_2 - line.position_1;\n      // t\u3092\u7B97\u51FA((w\u30FBv)/(v\u30FBv))=((AC\u30FBAB)/(AB\u30FBAB))\n      let t = dot(AC,AB)/dot(AB,AB);\n      // t\u30920\u30681\u306E\u9593\u306B\u9650\u5B9A\u3059\u308B\n      return clamp(t, 0, 1);\n    }\n\n    // \u63A5\u89E6\u5224\u5B9A\u306E\u305F\u3081\u306E\u30D9\u30AF\u30C8\u30EBAD(\u63A5\u89E6\u70B9)\u3092\u7B97\u51FA\u3059\u308B\n    fn calVectorD(line: Line, tdash: f32) -> vec2<f32>{\n      // \u7DDA\u5206AB\u306E\u30D9\u30AF\u30C8\u30EB\n      let AB = line.position_2 - line.position_1;\n      return vec2<f32>(line.position_1.x + tdash * AB.x, line.position_1.y + tdash * AB.y);\n    }\n\n\n    // \u5DE6\u4E0B\u306E\u30DE\u30B9\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9(\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u8981\u7D20\u6570\u306F\u629C\u304D\u306B\u3057\u3066\u8003\u3048\u308B)(0\u3088\u308A\u5C0F\u3055\u3044\u6642\u306E\u3053\u3068\u306F\u3042\u3068\u3067\u8003\u3048\u308B)\n    fn cal_1_1_index(nx: u32, i: u32) -> i32 {\n      return i32(i-nx-1);\n    }\n    // \u771F\u4E0B\u306E\u30DE\u30B9\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9(\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u8981\u7D20\u6570\u306F\u629C\u304D\u306B\u3057\u3066\u8003\u3048\u308B)(0\u3088\u308A\u5C0F\u3055\u3044\u6642\u306E\u3053\u3068\u306F\u3042\u3068\u3067\u8003\u3048\u308B)\n    fn cal_2_1_index(nx: u32, i: u32) -> i32 {\n      return i32(i-nx);\n    }\n    // \u53F3\u4E0B\u306E\u30DE\u30B9\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9(\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u8981\u7D20\u6570\u306F\u629C\u304D\u306B\u3057\u3066\u8003\u3048\u308B)(0\u3088\u308A\u5C0F\u3055\u3044\u6642\u306E\u3053\u3068\u306F\u3042\u3068\u3067\u8003\u3048\u308B)\n    fn cal_3_1_index(nx: u32, i: u32) -> i32 {\n      return i32(i-nx+1);\n    }\n    // \u5DE6\u306E\u30DE\u30B9\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9(\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u8981\u7D20\u6570\u306F\u629C\u304D\u306B\u3057\u3066\u8003\u3048\u308B)(0\u3088\u308A\u5C0F\u3055\u3044\u6642\u306E\u3053\u3068\u306F\u3042\u3068\u3067\u8003\u3048\u308B)\n    fn cal_1_2_index(nx: u32, i: u32) -> i32 {\n      return i32(i-1);\n    }\n    // \u771F\u3093\u4E2D\u306E\u30DE\u30B9\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9(\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u8981\u7D20\u6570\u306F\u629C\u304D\u306B\u3057\u3066\u8003\u3048\u308B)(0\u3088\u308A\u5C0F\u3055\u3044\u6642\u306E\u3053\u3068\u306F\u3042\u3068\u3067\u8003\u3048\u308B)\n    fn cal_2_2_index(nx: u32, i: u32) -> i32 {\n      return i32(i);\n    }\n    // \u53F3\u306E\u30DE\u30B9\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9(\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u8981\u7D20\u6570\u306F\u629C\u304D\u306B\u3057\u3066\u8003\u3048\u308B)(\u8D85\u3048\u305F\u6642\u306E\u3053\u3068\u306F\u3042\u3068\u3067\u8003\u3048\u308B)\n    fn cal_3_2_index(nx: u32, i: u32) -> i32 {\n      return i32(i+1);\n    }\n    // \u5DE6\u4E0A\u306E\u30DE\u30B9\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9(\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u8981\u7D20\u6570\u306F\u629C\u304D\u306B\u3057\u3066\u8003\u3048\u308B)(\u8D85\u3048\u305F\u6642\u306E\u3053\u3068\u306F\u3042\u3068\u3067\u8003\u3048\u308B)\n    fn cal_1_3_index(nx: u32, i: u32) -> i32 {\n      return i32(i+nx-1);\n    }\n    // \u771F\u4E0A\u306E\u30DE\u30B9\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9(\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u8981\u7D20\u6570\u306F\u629C\u304D\u306B\u3057\u3066\u8003\u3048\u308B)(\u8D85\u3048\u305F\u6642\u306E\u3053\u3068\u306F\u3042\u3068\u3067\u8003\u3048\u308B)\n    fn cal_2_3_index(nx: u32, i: u32) -> i32 {\n      return i32(i+nx);\n    }\n    // \u53F3\u4E0A\u306E\u30DE\u30B9\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9(\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u8981\u7D20\u6570\u306F\u629C\u304D\u306B\u3057\u3066\u8003\u3048\u308B)(\u8D85\u3048\u305F\u6642\u306E\u3053\u3068\u306F\u3042\u3068\u3067\u8003\u3048\u308B)\n    fn cal_3_3_index(nx: u32, i: u32) -> i32 {\n      return i32(i+nx+1);\n    }\n\n    fn calculationOtherBallIndexArray(nx: u32, i: u32) -> array<i32, 9> {\n      var other_index_array: array<i32, 9>; // \u5224\u5B9A\u3092\u884C\u3046\u76F8\u624B\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u3092\u683C\u7D0D\u3059\u308B\u914D\u5217(\u81EA\u5206\u81EA\u8EAB\u3068\u5468\u308A\u306E8\u30DE\u30B9=9\u30DE\u30B9)\n      other_index_array[0] = cal_1_1_index(nx, i);\n      other_index_array[1] = cal_2_1_index(nx, i);\n      other_index_array[2] = cal_3_1_index(nx, i);\n      other_index_array[3] = cal_1_2_index(nx, i);\n      other_index_array[4] = cal_2_2_index(nx, i);\n      other_index_array[5] = cal_3_2_index(nx, i);\n      other_index_array[6] = cal_1_3_index(nx, i);\n      other_index_array[7] = cal_2_3_index(nx, i);\n      other_index_array[8] = cal_3_3_index(nx, i);\n      return other_index_array;\n    }\n\n    @compute @workgroup_size(64)\n    fn main(\n      @builtin(global_invocation_id)\n      global_id : vec3<u32>,\n    ) {\n      let TIME_LOOP: u32 = 1;                   // 1fps\u3042\u305F\u308A\u306E\u30EB\u30FC\u30D7\u56DE\u6570\n      let TIME_STEP: f32 = 1/scene.fps/400;   // \u6642\u9593\u523B\u307F(s)\n      let num_balls: u32 = arrayLength(&output);\n      // let num_lines: u32 = maxLineNumber;//arrayLength(&line_input);\n\n      let nx: u32 = u32(scene.nx); //u32(ceil(scene.L/scene.maxRadius)); // x\u65B9\u5411\u306E\u683C\u5B50\u70B9\u6570\n      let ny: u32 = u32(ceil(f32(nx) * scene.height/scene.width)); // y\u65B9\u5411\u306E\u683C\u5B50\u70B9\u6570\n      let spacing: f32 = scene.spacing; //scene.maxRadius*2+0.001; // \u683C\u5B50\u9593\u9694\n      let grid_size: u32 = u32(scene.grid_size); //u32(ceil(scene.maxRadius/scene.minRadius)) * u32(ceil(scene.maxRadius/scene.minRadius)); // 1\u30B0\u30EA\u30C3\u30C9\u3042\u305F\u308A\u306E\u6700\u5927\u8981\u7D20\u6570\n\n\n\n      if(global_id.x >= num_balls) {\n        return;\n      }\n\n\n\n      var src_ball = input[global_id.x];\n      let dst_ball = &output[global_id.x];\n\n      (*dst_ball) = src_ball;\n\n      let src_gl_index:u32 = u32(floor(src_ball.position.y/spacing))*nx + u32(floor(src_ball.position.x/spacing)); // \u4ECA\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u8981\u7D20\u6570\u306F\u629C\u304D\u306B\u3057\u3066\u8003\u3048\u308B\n      let other_index_array: array<i32, 9> = calculationOtherBallIndexArray(nx, src_gl_index); // \u5224\u5B9A\u3092\u884C\u3046\u76F8\u624B\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u306E\u59CB\u307E\u308A\u3092\u683C\u7D0D\u3059\u308B\u914D\u5217(\u81EA\u5206\u81EA\u8EAB\u3068\u5468\u308A\u306E8\u30DE\u30B9=9\u30DE\u30B9)\n\n\n      // set const (\u5965\u884C\u304D1\u306E\u5186\u67F1)\n      let m_i = pow(src_ball.radius, 2.0) * PI * rho;   // \u7C92\u5B50i\u306E\u8CEA\u91CF\n      let I_i = 0.5 * m_i * pow(src_ball.radius, 2.0);  // \u7C92\u5B50i\u306E\u6163\u6027\u30E2\u30FC\u30E1\u30F3\u30C8\n\n\n      var F_i: f32 = 0.0;                               // \u7C92\u5B50i\u306E\u5F3E\u6027\u529B\u306E\u5408\u529B\n      var G_i: f32 = 0.0;                               // \u7C92\u5B50i\u306E\u305B\u3093\u65AD\u529B\u306E\u5408\u529B\n      var T_i: f32 = 0.0;                               // \u7C92\u5B50i\u306E\u30C8\u30EB\u30AF\u306E\u5408\u529B\n\n\n      var ef_counter:u32 = 0; // \u63A5\u89E6\u529B\u306E\u76F8\u624B\u306E\u6570\u3092\u4FDD\u5B58\u3057\u3066\u304A\u304F\u5909\u6570\n      var ef_output: array<EF, maxContactParticleNumber + 4 + maxLineNumber>; // \u8A08\u7B97\u3057\u305F\u63A5\u89E6\u529B\u3092\u4FDD\u5B58\u3059\u308B\u914D\u5217(+4\u306F\u4E0A\u4E0B\u5DE6\u53F3\u306E\u58C1)\n      var ef_index_output: array<u32, maxContactParticleNumber>; // \u8A08\u7B97\u3057\u305F\u63A5\u89E6\u7C92\u5B50\u3092\u4FDD\u5B58\u3059\u308B\u914D\u5217\n      for (var i = 0u; i < maxContactParticleNumber; i = i + 1u) {\n        ef_output[i].resilience_force = vec2<f32>(0.0, 0.0);\n        ef_index_output[i] = 0u;\n      }\n      ef_output[maxContactParticleNumber    ].resilience_force = vec2<f32>(0.0, 0.0);\n      ef_output[maxContactParticleNumber + 1].resilience_force = vec2<f32>(0.0, 0.0);\n      ef_output[maxContactParticleNumber + 2].resilience_force = vec2<f32>(0.0, 0.0);\n      ef_output[maxContactParticleNumber + 3].resilience_force = vec2<f32>(0.0, 0.0);\n      // \u7DDA\u5206\u306E\u6570\u30EB\u30FC\u30D7\n      for (var i = 0u; i < maxLineNumber; i = i + 1u) {\n        ef_output[maxContactParticleNumber + 4 + i].resilience_force = vec2<f32>(0.0, 0.0);\n      }\n\n\n\n      // Ball/Ball collision\n      // \u30DE\u30B9\u3054\u3068\u306B\u30EB\u30FC\u30D7\n      for(var j = 0; j < 9; j++) {\n        // \u683C\u5B50\u70B9\u304C\u5B58\u5728\u3057\u306A\u3044\u5834\u5408\u306F\u30B9\u30AD\u30C3\u30D7\n        if(other_index_array[j] < 0 || other_index_array[j] >= i32(nx)*i32(ny)) {\n          continue;\n        }\n        // gl_input\u306E\u5BFE\u8C61\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u306E\u30EB\u30FC\u30D7\n        for(var k = other_index_array[j]*i32(grid_size); k < other_index_array[j]*i32(grid_size)+i32(grid_size); k++) {\n          \n          // 0\u306F\u521D\u671F\u5024\u306A\u306E\u3067\u30B9\u30AD\u30C3\u30D7\n          if(gl_input[u32(k)] == 0) {\n            continue;\n          }\n          // i\u3092\u7B97\u51FA\u3059\u308B\n          var i = gl_input[u32(k)] - 1; // \u767B\u9332\u306E\u6642\u306B+1\u3057\u3066\u3044\u308B\u306E\u3067-1\u3059\u308B(\u914D\u5217\u306E\u4E2D\u30670\u306Fnull\u306E\u610F\u5473\u3067\u4F7F\u7528\u3059\u308B\u305F\u3081)\n\n\n\n\n        // for(var i = 0; i < num_balls; i++) {\n          // \u81EA\u5206\u81EA\u8EAB\u306E\u5834\u5408\u306F\u30B9\u30AD\u30C3\u30D7\n          if(i == global_id.x) {\n            continue;\n          }\n\n  \n          var other_ball = input[i];\n          let n = src_ball.position - other_ball.position;\n          let distance = length(n);\n          if(distance >= src_ball.radius + other_ball.radius) {\n            // (*ef_dst).resilience_force = vec2<f32>(0,0); // \u5FA9\u5143\u529B\u30920\u306B\u3059\u308B\n            // \u73FE\u72B6\u3067\u306F\u7D42\u308F\u3063\u3066\u304B\u3089\u540C\u671F\u3059\u308B\n            // ef_input[ef_index_ij] = (*ef_dst);\n            continue;\n          }\n\n\n          // \u63A5\u89E6\u529B\u306E\u76F8\u624B\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u3092\u4FDD\u5B58\u3057\u3066\u304A\u304F(\u767B\u9332\u6642\u306F+1\u3057\u3066\u304A\u304F) \n          ef_index_output[ef_counter] = i + 1;\n          var ef_src: EF = EF(vec2<f32>(0.0, 0.0));\n          // \u524D\u306E\u76F8\u624Bi\u306B\u5BFE\u3059\u308B\u63A5\u89E6\u529B\u3092\u898B\u3064\u3051\u308B\n          for(var l:u32 = 0; l < maxContactParticleNumber; l++) {\n            // \u3082\u30571\u30B9\u30C6\u30C3\u30D7\u524D\u306E\u63A5\u89E6\u529B\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u914D\u5217\u306Bi\u3068\u540C\u3058\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u304C\u3042\u308C\u3070\u3001\u63A5\u89E6\u529B\u3092\u7D99\u627F\u3059\u308B\u3002\u306A\u3051\u308C\u3070\u521D\u3081\u3066\u63A5\u89E6\u4E0B\u3068\u3057\u3066\u30010\u306E\u307E\u307E\u306B\u3059\u308B\u3002\n            if(ef_index_input[global_id.x*maxContactParticleNumber + l] == i + 1){\n              ef_src.resilience_force = ef_input[global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + l].resilience_force;\n              break;\n            }\n          }\n\n\n          let other_mass = pow(other_ball.radius, 2.0) * PI * rho; // \u8CEA\u91CF;\n  \n          // eta(\u7C98\u6027\u4FC2\u6570)\u3092\u6C42\u3081\u308B\n          let eta_ij = calculationEta(m_i, other_mass);\n          // \u885D\u7A81\u5F8C\u306E\u7C92\u5B50\u540C\u58EB\u306E\u76F8\u5BFE\u901F\u5EA6\u3092\u6C42\u3081\u308B\n          let u_ji = calculationVelocityAfterCollision(src_ball.position, src_ball.velocity, src_ball.anguler_velocity, src_ball.radius, other_ball.position, other_ball.velocity, other_ball.anguler_velocity, other_ball.radius);\n          // \u5FA9\u5143\u529B\u3092\u6C42\u3081\u308B\n          ef_output[ef_counter].resilience_force = calculationRestoringForceNS(ef_src.resilience_force, u_ji, k_n, k_s, TIME_STEP);\n          // \u7C98\u6027\u529B\u3092\u6C42\u3081\u308B\n          let viscous_force = calculationViscousForceNS(eta_ij.x, eta_ij.y, u_ji.x, u_ji.y);\n          // \u5F3E\u6027\u529B\u3092\u6C42\u3081\u308B\n          let elastic_force_ns = calculationElasticForceNS(ef_output[ef_counter].resilience_force, viscous_force);\n          // \u5F3E\u6027\u529B\u3092xy\u6210\u5206\u306B\u5206\u89E3\u3059\u308B\n          let elastic_force_xy = calculationElasticForceXY(elastic_force_ns, src_ball.position, other_ball.position);\n          // \u5408\u529B\u3092\u5897\u52A0\u3055\u305B\u308B\n          F_i += elastic_force_xy.x;\n          G_i += elastic_force_xy.y;\n          T_i += - elastic_force_ns.y * src_ball.radius;\n  \n          // \u63A5\u89E6\u76F8\u624B\u306E\u30AB\u30A6\u30F3\u30BF\u30FC\u3092\u4E00\u3064\u5897\u3084\u3059\n          ef_counter += 1; \n        }\n      }\n\n\n      // Ball/Wall collision\n      // \u5DE6\u306E\u58C1\n      if((*dst_ball).position.x - (*dst_ball).radius < 0.) {\n        // \u5FA9\u5143\u529B\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u3092\u6C42\u3081\u308B(\u81EA\u5206\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u306E\u6700\u5F8C+1)\n        let ef_index_ij = global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber;\n        var ef_src = ef_input[ef_index_ij];\n\n        let alpha = 180.0; // \u5DE6\u306A\u306E\u3067180\xB0\n\n        // eta(\u7C98\u6027\u4FC2\u6570)\u3092\u6C42\u3081\u308B(\u5BFE\u58C1)\n        let eta_ij = calculationEtaWithWall(m_i);\n        // \u885D\u7A81\u5F8C\u306E\u7C92\u5B50\u540C\u58EB\u306E\u76F8\u5BFE\u901F\u5EA6\u3092\u6C42\u3081\u308B\n        let u_ji = calculationVelocityAfterCollisionWithWall(src_ball.velocity, src_ball.anguler_velocity, src_ball.radius, alpha);\n        // \u5FA9\u5143\u529B\u3092\u6C42\u3081\u308B\n        ef_output[maxContactParticleNumber].resilience_force = calculationRestoringForceNS(ef_src.resilience_force, u_ji, k_n, k_s, TIME_STEP);\n        // \u7C98\u6027\u529B\u3092\u6C42\u3081\u308B\n        let viscous_force = calculationViscousForceNS(eta_ij.x, eta_ij.y, u_ji.x, u_ji.y);\n        // \u5F3E\u6027\u529B\u3092\u6C42\u3081\u308B\n        let elastic_force_ns = calculationElasticForceNS(ef_output[maxContactParticleNumber].resilience_force, viscous_force);\n        // \u5F3E\u6027\u529B\u3092xy\u6210\u5206\u306B\u5206\u89E3\u3059\u308B\n        let elastic_force_xy = calculationElasticForceXYWithWall(elastic_force_ns, alpha);\n        // \u5408\u529B\u3092\u5897\u52A0\u3055\u305B\u308B\n        F_i += elastic_force_xy.x;\n        G_i += elastic_force_xy.y;\n        T_i += - elastic_force_ns.y * src_ball.radius;\n\n      }else{\n\n        ef_output[maxContactParticleNumber].resilience_force = vec2<f32>(0,0); // \u5FA9\u5143\u529B\u30920\u306B\u3059\u308B\n\n      }\n\n      // \u4E0B\u306E\u58C1\n      if((*dst_ball).position.y - (*dst_ball).radius < 0.) {\n        // \u5FA9\u5143\u529B\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u3092\u6C42\u3081\u308B(\u81EA\u5206\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u306E\u6700\u5F8C+1)\n        let ef_index_ij = global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber + 1;\n        var ef_src = ef_input[ef_index_ij];\n\n\n        let alpha = 270.0; // \u4E0B\u306A\u306E\u3067270\xB0\n\n        // eta(\u7C98\u6027\u4FC2\u6570)\u3092\u6C42\u3081\u308B(\u5BFE\u58C1)\n        let eta_ij = calculationEtaWithWall(m_i);\n        // \u885D\u7A81\u5F8C\u306E\u7C92\u5B50\u540C\u58EB\u306E\u76F8\u5BFE\u901F\u5EA6\u3092\u6C42\u3081\u308B\n        let u_ji = calculationVelocityAfterCollisionWithWall(src_ball.velocity, src_ball.anguler_velocity, src_ball.radius, alpha);\n        // \u5FA9\u5143\u529B\u3092\u6C42\u3081\u308B\n        ef_output[maxContactParticleNumber + 1].resilience_force = calculationRestoringForceNS(ef_src.resilience_force, u_ji, k_n, k_s, TIME_STEP);\n        // \u7C98\u6027\u529B\u3092\u6C42\u3081\u308B\n        let viscous_force = calculationViscousForceNS(eta_ij.x, eta_ij.y, u_ji.x, u_ji.y);\n        // \u5F3E\u6027\u529B\u3092\u6C42\u3081\u308B\n        let elastic_force_ns = calculationElasticForceNS(ef_output[maxContactParticleNumber + 1].resilience_force, viscous_force);\n        // \u5F3E\u6027\u529B\u3092xy\u6210\u5206\u306B\u5206\u89E3\u3059\u308B\n        let elastic_force_xy = calculationElasticForceXYWithWall(elastic_force_ns, alpha);\n        // \u5408\u529B\u3092\u5897\u52A0\u3055\u305B\u308B\n        F_i += elastic_force_xy.x;\n        G_i += elastic_force_xy.y;\n        T_i += - elastic_force_ns.y * src_ball.radius;\n\n\n      }else{\n\n        ef_output[maxContactParticleNumber + 1].resilience_force = vec2<f32>(0,0); // \u5FA9\u5143\u529B\u30920\u306B\u3059\u308B\n\n      }\n\n      // \u53F3\u306E\u58C1\n      if((*dst_ball).position.x + (*dst_ball).radius >= scene.L) {\n        // \u5FA9\u5143\u529B\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u3092\u6C42\u3081\u308B(\u81EA\u5206\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u306E\u6700\u5F8C+1)\n        let ef_index_ij = global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber + 2;\n        var ef_src = ef_input[ef_index_ij];\n\n        let alpha = 0.0; // \u53F3\u306A\u306E\u30670\xB0\n\n        // eta(\u7C98\u6027\u4FC2\u6570)\u3092\u6C42\u3081\u308B(\u5BFE\u58C1)\n        let eta_ij = calculationEtaWithWall(m_i);\n        // \u885D\u7A81\u5F8C\u306E\u7C92\u5B50\u540C\u58EB\u306E\u76F8\u5BFE\u901F\u5EA6\u3092\u6C42\u3081\u308B\n        let u_ji = calculationVelocityAfterCollisionWithWall(src_ball.velocity, src_ball.anguler_velocity, src_ball.radius, alpha);\n        // \u5FA9\u5143\u529B\u3092\u6C42\u3081\u308B\n        ef_output[maxContactParticleNumber + 2].resilience_force = calculationRestoringForceNS(ef_src.resilience_force, u_ji, k_n, k_s, TIME_STEP);\n        // \u7C98\u6027\u529B\u3092\u6C42\u3081\u308B\n        let viscous_force = calculationViscousForceNS(eta_ij.x, eta_ij.y, u_ji.x, u_ji.y);\n        // \u5F3E\u6027\u529B\u3092\u6C42\u3081\u308B\n        let elastic_force_ns = calculationElasticForceNS(ef_output[maxContactParticleNumber + 2].resilience_force, viscous_force);\n        // \u5F3E\u6027\u529B\u3092xy\u6210\u5206\u306B\u5206\u89E3\u3059\u308B\n        let elastic_force_xy = calculationElasticForceXYWithWall(elastic_force_ns, alpha);\n        // \u5408\u529B\u3092\u5897\u52A0\u3055\u305B\u308B\n        F_i += elastic_force_xy.x;\n        G_i += elastic_force_xy.y;\n        T_i += - elastic_force_ns.y * src_ball.radius;\n\n \n      }else{\n\n        ef_output[maxContactParticleNumber + 2].resilience_force = vec2<f32>(0,0); // \u5FA9\u5143\u529B\u30920\u306B\u3059\u308B\n\n      }\n\n      // \u4E0A\u306E\u58C1\n      if((*dst_ball).position.y + (*dst_ball).radius >= scene.L/scene.width*scene.height) {\n\n        // \u5FA9\u5143\u529B\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u3092\u6C42\u3081\u308B(\u81EA\u5206\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u306E\u6700\u5F8C+1)\n        let ef_index_ij = global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber + 3;\n        var ef_src = ef_input[ef_index_ij];\n\n        let alpha = 90.0; // \u4E0A\u306A\u306E\u306790\xB0\n\n        // eta(\u7C98\u6027\u4FC2\u6570)\u3092\u6C42\u3081\u308B(\u5BFE\u58C1)\n        let eta_ij = calculationEtaWithWall(m_i);\n        // \u885D\u7A81\u5F8C\u306E\u7C92\u5B50\u540C\u58EB\u306E\u76F8\u5BFE\u901F\u5EA6\u3092\u6C42\u3081\u308B\n        let u_ji = calculationVelocityAfterCollisionWithWall(src_ball.velocity, src_ball.anguler_velocity, src_ball.radius, alpha);\n        // \u5FA9\u5143\u529B\u3092\u6C42\u3081\u308B\n        ef_output[maxContactParticleNumber + 3].resilience_force = calculationRestoringForceNS(ef_src.resilience_force, u_ji, k_n, k_s, TIME_STEP);\n        // \u7C98\u6027\u529B\u3092\u6C42\u3081\u308B\n        let viscous_force = calculationViscousForceNS(eta_ij.x, eta_ij.y, u_ji.x, u_ji.y);\n        // \u5F3E\u6027\u529B\u3092\u6C42\u3081\u308B\n        let elastic_force_ns = calculationElasticForceNS(ef_output[maxContactParticleNumber + 3].resilience_force, viscous_force);\n        // \u5F3E\u6027\u529B\u3092xy\u6210\u5206\u306B\u5206\u89E3\u3059\u308B\n        let elastic_force_xy = calculationElasticForceXYWithWall(elastic_force_ns, alpha);\n        // \u5408\u529B\u3092\u5897\u52A0\u3055\u305B\u308B\n        F_i += elastic_force_xy.x;\n        G_i += elastic_force_xy.y;\n        T_i += - elastic_force_ns.y * src_ball.radius;\n\n      }else{\n\n        ef_output[maxContactParticleNumber + 3].resilience_force = vec2<f32>(0,0); // \u5FA9\u5143\u529B\u30920\u306B\u3059\u308B\n\n      }\n\n\n      // \u7DDA\u5206\u8981\u7D20\u306E\u8A08\u7B97\n      // \u7DDA\u5206\u3067\u30EB\u30FC\u30D7\u3059\u308B\n      for(var l = 0u; l < maxLineNumber; l = l + 1u) {\n        // \u7DDA\u5206\u304C\u6709\u52B9\u3067\u306A\u3044\u3068\u304D\u306F\u6B21\u306E\u30EB\u30FC\u30D7\u3078\n        if(line_input[l].isValid == 0u){\n          continue;\n        }\n        let AC = calVectorAC(line_input[l], src_ball.position);\n        let tdash = calTDash(line_input[l], AC);\n        let D = calVectorD(line_input[l], tdash);\n        // \u63A5\u89E6\u5224\u5B9A              \n        let distance = length(src_ball.position - D);\n        // \u63A5\u89E6\u3057\u306A\u3044\u3068\u304D\n        if(distance >= src_ball.radius + line_input[l].thickness) {\n          ef_output[maxContactParticleNumber + 4 + l].resilience_force = vec2<f32>(0,0); // \u5FA9\u5143\u529B\u30920\u306B\u3059\u308B\n          continue;\n        }\n        // \u5FA9\u5143\u529B\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u3092\u6C42\u3081\u308B(\u81EA\u5206\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u306E\u6700\u5F8C+1)\n        let ef_index_ij = global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber + 4 + l;\n        var ef_src = ef_input[ef_index_ij];\n\n\n        // eta(\u7C98\u6027\u4FC2\u6570)\u3092\u6C42\u3081\u308B\n        let eta_ij = calculationEtaWithWall(m_i);\n        // \u885D\u7A81\u5F8C\u306E\u7C92\u5B50\u540C\u58EB\u306E\u76F8\u5BFE\u901F\u5EA6\u3092\u6C42\u3081\u308B\n        let u_ji = calculationVelocityAfterCollisionWithStackLine(src_ball.position, src_ball.velocity, src_ball.anguler_velocity, src_ball.radius, D, vec2<f32>(0,0), 0, line_input[l].thickness);\n        // \u5FA9\u5143\u529B\u3092\u6C42\u3081\u308B\n        ef_output[maxContactParticleNumber + 4 + l].resilience_force = calculationRestoringForceNS(ef_src.resilience_force, u_ji, k_n, k_s, TIME_STEP);\n        // \u7C98\u6027\u529B\u3092\u6C42\u3081\u308B\n        let viscous_force = calculationViscousForceNS(eta_ij.x, eta_ij.y, u_ji.x, u_ji.y);\n        // \u5F3E\u6027\u529B\u3092\u6C42\u3081\u308B\n        let elastic_force_ns = calculationElasticForceNS(ef_output[maxContactParticleNumber + 4 + l].resilience_force, viscous_force);\n        // \u5F3E\u6027\u529B\u3092xy\u6210\u5206\u306B\u5206\u89E3\u3059\u308B\n        let elastic_force_xy = calculationElasticForceXY(elastic_force_ns, src_ball.position, D);\n        // \u5408\u529B\u3092\u5897\u52A0\u3055\u305B\u308B\n        F_i += elastic_force_xy.x;\n        G_i += elastic_force_xy.y;\n        T_i += - elastic_force_ns.y * src_ball.radius;\n\n\n      }\n\n\n      // END \u7DDA\u5206\u8981\u7D20\u306E\u8A08\u7B97\n\n\n      // \u7C92\u5B50\u306E\u52A0\u901F\u5EA6\u3092\u6C42\u3081\u308B\n      let acceleration = calculationAcceleration(m_i, F_i, G_i);\n      // \u7C92\u5B50\u306E\u901F\u5EA6\u3092\u6C42\u3081\u308B\n      (*dst_ball).velocity = calculationVelocity(src_ball.velocity, acceleration, TIME_STEP);\n      // \u7C92\u5B50\u306E\u4F4D\u7F6E\u3092\u6C42\u3081\u308B\n      (*dst_ball).position = calculationPosition(src_ball.position, (*dst_ball).velocity, TIME_STEP);\n      // \u7C92\u5B50\u306E\u89D2\u52A0\u901F\u5EA6\u3092\u6C42\u3081\u308B\n      let angular_acceleration = calculationAngularAcceleration(I_i, T_i);\n      // \u7C92\u5B50\u306E\u89D2\u901F\u5EA6\u3092\u6C42\u3081\u308B\n      (*dst_ball).anguler_velocity = calculationAngularVelocity(src_ball.anguler_velocity, angular_acceleration, TIME_STEP);\n      // \u7C92\u5B50\u306E\u89D2\u5EA6\u3092\u6C42\u3081\u308B\n      (*dst_ball).angle = calculationAngle(src_ball.angle, (*dst_ball).anguler_velocity, TIME_STEP);\n\n\n      // \u7570\u306A\u308Bworkgroup\u9593\u3067\u306F\u73FE\u5728\u540C\u671F\u3067\u304D\u306A\u3044\u306E\u3067forloop\u306F\u4F7F\u3048\u306A\u3044\n\n      let gl_index:u32 = u32(floor((*dst_ball).position.y/spacing))*nx + u32(floor((*dst_ball).position.x/spacing));\n\n      var c = atomicAdd(&gl_atomic[gl_index], u32(1));//\u52A0\u7B97(\u5404\u95A2\u6570\u306F\u6B21\u306E\u624B\u9806\u3092\u30A2\u30C8\u30DF\u30C3\u30AF\u306B\u5B9F\u884C\u3057\u307E\u3059\u3002\n      // 1.atomic_ptr\u304C\u6307\u3059\u5143\u306E\u5024\u3092\u30ED\u30FC\u30C9\u3057\u307E\u3059, \n      // 2.\u5024v\u3092\u4F7F\u7528\u3057\u3066\u95A2\u6570\u540D\u304B\u3089\u6F14\u7B97 (\u4F8B: max) \u3092\u5B9F\u884C\u3059\u308B\u3053\u3068\u306B\u3088\u308A\u3001\u65B0\u3057\u3044\u5024\u3092\u53D6\u5F97\u3057\u307E\u3059\u3002\n      // 3.atomic_ptr\u3092\u4F7F\u7528\u3057\u3066\u65B0\u3057\u3044\u5024\u3092\u4FDD\u5B58\u3057\u307E\u3059\u3002\n      // \u5404\u95A2\u6570\u306F\u3001\u30A2\u30C8\u30DF\u30C3\u30AF \u30AA\u30D6\u30B8\u30A7\u30AF\u30C8\u306B\u683C\u7D0D\u3055\u308C\u3066\u3044\u308B\u5143\u306E\u5024\u3092\u8FD4\u3057\u307E\u3059\u3002)\n\n      gl_output[gl_index*grid_size+c] = global_id.x+1; // \u521D\u671F\u5316\u30670\u306B\u3057\u3066\u3044\u308B\u306E\u3067index=0\u3068\u521D\u671F\u5316\u304C\u304B\u3076\u3089\u306A\u3044\u3088\u3046\u306B+1\u3059\u308B\n\n      \n      // \u63A5\u89E6\u529B\u3092\u6B21\u306E\u30EB\u30FC\u30D7\u306E\u305F\u3081\u306B\u4FDD\u5B58\u3059\u308B\n      for(var l:u32 = 0; l < maxContactParticleNumber; l++) {\n          // \u63A5\u89E6\u529B\u3092\u4EE3\u5165\u3059\u308B\n          ef_input[global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + l] = ef_output[l];\n          // \u63A5\u89E6\u529B\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u3092\u4EE3\u5165\u3059\u308B\n          ef_index_input[global_id.x*maxContactParticleNumber + l] =  ef_index_output[l];\n      }\n      // \u58C1\u306E\u5206\n      ef_input[global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber]     = ef_output[maxContactParticleNumber];\n      ef_input[global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber + 1] = ef_output[maxContactParticleNumber + 1];\n      ef_input[global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber + 2] = ef_output[maxContactParticleNumber + 2];\n      ef_input[global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber + 3] = ef_output[maxContactParticleNumber + 3];\n\n      // \u7DDA\u5206\u306E\u5206\n      for(var l:u32 = 0; l < maxLineNumber; l++) {\n          // \u63A5\u89E6\u529B\u3092\u4EE3\u5165\u3059\u308B\n          ef_input[global_id.x*(maxContactParticleNumber + 4 + maxLineNumber) + maxContactParticleNumber + 4 + l] = ef_output[maxContactParticleNumber + 4 + l];\n      }\n    }\n  ")
        });
        bindGroupLayout1 = device.createBindGroupLayout({
          entries: [{
            binding: 0,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
              type: "storage"
            }
          }, {
            binding: 1,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
              type: "storage"
            }
          }, {
            binding: 2,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
              type: "storage"
            }
          }, {
            binding: 3,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
              type: "uniform"
            }
          }, {
            binding: 4,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
              type: "storage"
            }
          }, {
            binding: 5,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
              type: "storage"
            }
          }, {
            binding: 6,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
              type: "storage"
            }
          }, {
            binding: 7,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
              type: "storage"
            }
          }]
        });
        bindGroupLayout2 = device.createBindGroupLayout({
          entries: [{
            binding: 0,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
              type: "storage"
            }
          }, {
            binding: 1,
            visibility: GPUShaderStage.COMPUTE,
            buffer: {
              type: "storage"
            }
          }]
        });
        pipeline = device.createComputePipeline({
          layout: device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout1, bindGroupLayout2]
          }),
          compute: {
            module: module,
            entryPoint: "main"
          }
        }); // --- ③ バッファサイズを16バイト境界＝(14×4=56 →64など)に調整し、UNIFORM ---
        scene = device.createBuffer({
          size: 16 * Float32Array.BYTES_PER_ELEMENT,
          // ★ 16バイトアライン推奨
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        input = device.createBuffer({
          size: BUFFER_SIZE,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        output = device.createBuffer({
          size: BUFFER_SIZE,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.VERTEX
        });
        ef_input = device.createBuffer({
          size: EF_BUFFER_SIZE,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        ef_index_input = device.createBuffer({
          size: EF_INDEX_BUFFER_SIZE,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        gl_input = device.createBuffer({
          size: GL_BUFFER_SIZE,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        gl_output = device.createBuffer({
          size: GL_BUFFER_SIZE,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
        });
        gl_atomic = device.createBuffer({
          size: GL_ATOMIC_BUFFER_SIZE,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
        });
        line_input = device.createBuffer({
          size: LINE_BUFFER_SIZE,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        line_output = device.createBuffer({
          size: LINE_BUFFER_SIZE,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        });
        bindGroup1 = device.createBindGroup({
          layout: bindGroupLayout1,
          entries: [{
            binding: 0,
            resource: {
              buffer: input
            }
          }, {
            binding: 1,
            resource: {
              buffer: output
            }
          }, {
            binding: 2,
            resource: {
              buffer: ef_input
            }
          }, {
            binding: 3,
            resource: {
              buffer: scene
            }
          }, {
            binding: 4,
            resource: {
              buffer: gl_input
            }
          }, {
            binding: 5,
            resource: {
              buffer: gl_output
            }
          }, {
            binding: 6,
            resource: {
              buffer: gl_atomic
            }
          }, {
            binding: 7,
            resource: {
              buffer: ef_index_input
            }
          }]
        });
        bindGroup2 = device.createBindGroup({
          layout: bindGroupLayout2,
          entries: [{
            binding: 0,
            resource: {
              buffer: line_input
            }
          }, {
            binding: 1,
            resource: {
              buffer: line_output
            }
          }]
        }); // START Geometry Shader
        // 粒子要素の描画関係
        // シェーダーモジュール
        cellShaderModule = device.createShaderModule({
          label: "Cell shader",
          code: "\n    // Your shader code will go here\n\n    struct Ball {\n      radius: f32,\n      padding: f32,\n      position: vec2<f32>,\n      velocity: vec2<f32>,\n      angle: f32,\n      anguler_velocity: f32,\n    }\n    @group(0) @binding(0)\n    var<storage, read> output: array<Ball>;\n\n    struct VertexOutput {\n      @builtin(position) pos: vec4f,\n      @location(0) cellColor: vec4f, // New line!\n    };\n\n    struct Scene {\n      width: f32, // canvas\u306E\u5E45(pixel)\n      height: f32, // canvas\u306E\u9AD8\u3055(pixel)\n      L: f32, // canvas\u306E\u5E45(m)\n      fps: f32, // \u30D5\u30EC\u30FC\u30E0\u30EC\u30FC\u30C8\n      minRadius: f32, // \u7C92\u5B50\u306E\u6700\u5C0F\u534A\u5F84(m)\n      maxRadius: f32, // \u7C92\u5B50\u306E\u6700\u5927\u534A\u5F84(m)\n      nx: f32, // x\u65B9\u5411\u306E\u683C\u5B50\u70B9\u6570\n      grid_size: f32, // 1\u30B0\u30EA\u30C3\u30C9\u3042\u305F\u308A\u306E\u6700\u5927\u8981\u7D20\u6570\n      spacing: f32, // \u683C\u5B50\u9593\u9694\n      numBalls: f32, // \u7C92\u5B50\u6570\n      maxContactParticleNumber: f32, // \u6700\u5927\u63A5\u89E6\u7C92\u5B50\u6570\n      offsetX: f32,               // \u30AB\u30E1\u30E9\u4E2D\u5FC3 X\n      offsetY: f32,               // \u30AB\u30E1\u30E9\u4E2D\u5FC3 Y\n      zoomValue: f32, // \u30BA\u30FC\u30E0\u4FC2\u6570\n      colorMode: f32, // \u30AB\u30E9\u30FC\u30E2\u30FC\u30C9\n    }\n\n    @group(0) @binding(1)\n    var<uniform> scene: Scene;\n\n    // \u9802\u70B9\u30B7\u30A7\u30FC\u30C0\u30FC\u3092\u5B9A\u7FA9\u3059\u308B\n    @vertex\n    fn vertexMain(@builtin(vertex_index) vertex_index : u32, @builtin(instance_index) instance_index: u32, @location(0) pos: vec2<f32>) ->\n    VertexOutput {\n      var vertexOutput: VertexOutput;\n      let widthByL: f32 = scene.width/scene.L; \n      \n      // \u30D1\u30FC\u30C6\u30A3\u30AF\u30EB\u4E2D\u5FC3 (\u30D4\u30AF\u30BB\u30EB\u5EA7\u6A19)(\u5DE6\u4E0B\u57FA\u6E96)\n      let cx = output[instance_index].position.x * widthByL;\n      let cy = output[instance_index].position.y * widthByL;\n      \n      // \u56DE\u8EE2\n      let rx = cos(radians(output[instance_index].angle)) * pos.x\n            - sin(radians(output[instance_index].angle)) * pos.y;\n      let ry = sin(radians(output[instance_index].angle)) * pos.x\n            + cos(radians(output[instance_index].angle)) * pos.y;\n\n      // \u4E2D\u5FC3\u30AA\u30D5\u30BB\u30C3\u30C8+NDC\u5909\u63DB\n      // offsetX, offsetY \u306F\u30D4\u30AF\u30BB\u30EB\u5358\u4F4D\n      let ndcX = ((cx - scene.offsetX )  + rx * output[instance_index].radius * widthByL)\n                / scene.width * 2.0 * scene.zoomValue - 1.0;\n      let ndcY = ((cy - scene.offsetY )  + ry * output[instance_index].radius * widthByL)\n                / scene.height * 2.0 * scene.zoomValue - 1.0;\n\n      // \u30BA\u30FC\u30E0\u4FC2\u6570\u3092\u9069\u7528\n      vertexOutput.pos = vec4f(ndcX, ndcY, 0.0, 1.0);\n\n      // \u7C92\u5B50\u756A\u53F7\u306E\u5834\u5408\n      if(u32(scene.colorMode) == 0){\n        if(instance_index < u32(0.25*scene.numBalls)){\n          // vertexOutput.cell = 0.25;\n          vertexOutput.cellColor = vec4f(0.25, 0, 1.0, 1);\n        }else if(instance_index < u32(0.5*scene.numBalls)){\n          vertexOutput.cellColor = vec4f(0.5, 0, 1.0, 1);\n        }else if(instance_index < u32(0.75*scene.numBalls)){\n          vertexOutput.cellColor = vec4f(0.75, 0, 1.0, 1);\n        }else{\n          vertexOutput.cellColor = vec4f(1.0, 0, 1.0, 1);\n        }\n      }else if(u32(scene.colorMode) == 1){\n        let velocity = length(output[instance_index].velocity);\n        vertexOutput.cellColor = vec4f(velocity, 0, 100, 1);\n      }\n\n      return vertexOutput; // (X, Y, Z, W) w \u306E\u5024\u306F\u30013 \u6B21\u5143\u540C\u6B21\u5EA7\u6A19\u7CFB\u306B\u304A\u3051\u308B\u9802\u70B9\u306E 4 \u3064\u76EE\u306E\u8981\u7D20,3D \u30B0\u30E9\u30D5\u30A3\u30C3\u30AF\u306E\u30EC\u30F3\u30C0\u30EA\u30F3\u30B0\u3067\u3088\u304F\u884C\u308F\u308C\u308B 4x4 \u884C\u5217\u3092\u4F7F\u7528\u3057\u305F\u8A08\u7B97\u304C\u53EF\u80FD\u306B\u306A\u308B\n    }\n\n    // \u30D5\u30E9\u30B0\u30E1\u30F3\u30C8 \u30B7\u30A7\u30FC\u30C0\u30FC\u3092\u5B9A\u7FA9\u3059\u308B(\u623B\u308A\u5024\u306F0\uFF5E1)\n    @fragment\n    fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {\n\n      return input.cellColor; // (Red, Green, Blue, Alpha)\n    }   \n  "
        }); // 頂点を定義する
        // 頂点バッファを作成する
        vertices = createCircleVertices(0, 0, 1, 10); // バッファの作成
        vertexBuffer = device.createBuffer({
          label: "Cell vertices",
          size: vertices.byteLength,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX
        }); // END 円
        // 頂点データをバッファのメモリにコピーする
        device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/0, vertices);

        // 頂点のレイアウトを定義する
        // vertexBufferLayoutを作成する
        vertexBufferLayout = {
          arrayStride: 8,
          attributes: [{
            format: "float32x2",
            offset: 0,
            shaderLocation: 0 // Position, see vertex shader
          }]
        };
        renderBindGroupLayout = device.createBindGroupLayout({
          entries: [{
            binding: 0,
            visibility: GPUShaderStage.VERTEX,
            buffer: {
              type: "read-only-storage"
            }
          }, {
            binding: 1,
            visibility: GPUShaderStage.VERTEX,
            buffer: {
              type: "uniform"
            }
          }]
        });
        renderBindGroup = device.createBindGroup({
          label: "Cell renderer bind group",
          layout: renderBindGroupLayout,
          entries: [{
            binding: 0,
            resource: {
              buffer: output
            }
          }, {
            binding: 1,
            resource: {
              buffer: scene
            }
          }]
        });
        renderPipelineLayout = device.createPipelineLayout({
          label: "Cell Pipeline Layout",
          bindGroupLayouts: [renderBindGroupLayout]
        }); // レンダリング パイプラインを作成する
        cellPipeline = device.createRenderPipeline({
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
        }); // END 粒子要素の描画関係
        // 線分要素の描画関係
        // まずlineShaderModuleを定義（まだ存在しない場合）
        lineShaderModule = device.createShaderModule({
          label: "Line shader",
          code: "\n      struct Line {\n        thickness: f32,\n        isValid: u32,\n        position_1: vec2<f32>,\n        position_2: vec2<f32>,\n        velocity: vec2<f32>,\n        angle: f32,\n        anguler_velocity: f32,\n      }\n      \n      @group(0) @binding(0)\n      var<storage, read> line_output: array<Line>;\n      \n      struct Scene {\n        width: f32, height: f32, L: f32, fps: f32,\n        minRadius: f32, maxRadius: f32, nx: f32, grid_size: f32,\n        spacing: f32, numBalls: u32, maxContactParticleNumber: f32,\n        offsetX: f32, offsetY: f32, zoomValue: f32, colorMode: f32,\n      }\n      \n      @group(0) @binding(1)\n      var<uniform> scene: Scene;\n      \n      struct VertexOutput {\n        @builtin(position) pos: vec4f,\n        @location(0) color: vec4f,\n      };\n      \n      @vertex\n      fn vertexMain(@location(0) pos: vec2<f32>, @builtin(vertex_index) vertexIndex: u32) -> VertexOutput {\n        var output: VertexOutput;\n        let widthByL: f32 = scene.width/scene.L;\n        \n        // \u5EA7\u6A19\u3092\u6C7A\u5B9A\uFF080\u30681\u306E\u30A4\u30F3\u30C7\u30C3\u30AF\u30B9\u3067\u7DDA\u5206\u306E\u4E21\u7AEF\u3092\u53D6\u5F97\uFF09\n        let lineIndex = vertexIndex / 2;\n        let pointIndex = vertexIndex % 2;\n        \n              \n        // isValid\u3092\u30C1\u30A7\u30C3\u30AF\n        let isVisible: bool = line_output[lineIndex].isValid != 0u;\n\n        // select(false\u306E\u5834\u5408\u306E\u5024, true\u306E\u5834\u5408\u306E\u5024, \u6761\u4EF6\u5F0F)\n        // \u7DDA\u5206\u306F\u5E38\u306B2\u3064\u306E\u9802\u70B9\uFF08\u59CB\u70B9\u3068\u7D42\u70B9\uFF09\u304B\u3089\u69CB\u6210\u3055\u308C\u307E\u3059\n        // pointIndex\u306F\u51E6\u7406\u4E2D\u306E\u9802\u70B9\u304C\u7DDA\u5206\u306E\u3069\u3061\u3089\u5074\u304B\u3092\u793A\u3057\u307E\u3059\uFF080\u304B1\uFF09\n        // GPU\u3067\u306F\u6761\u4EF6\u5206\u5C90\uFF08if\u6587\uFF09\u3092\u907F\u3051\u3066\u3001\u3053\u306Eselect\u306E\u3088\u3046\u306A\u95A2\u6570\u3092\u4F7F\u3046\u3053\u3068\u3067\u30D1\u30D5\u30A9\u30FC\u30DE\u30F3\u30B9\u304C\u5411\u4E0A\u3057\u307E\u3059\n        let position = select(\n          line_output[lineIndex].position_1,\n          line_output[lineIndex].position_2,\n          pointIndex == 1\n        );\n        \n        // NDC\u5EA7\u6A19\u306B\u5909\u63DB\n        let ndcX = ((position.x * widthByL) - scene.offsetX) \n                  / scene.width * 2.0 * scene.zoomValue - 1.0;\n        let ndcY = ((position.y * widthByL) - scene.offsetY) \n                  / scene.height * 2.0 * scene.zoomValue - 1.0;\n        \n        // isValid \u304C 0 \u306E\u5834\u5408\u306F\u7DDA\u5206\u3092\u753B\u9762\u5916\u306B\u914D\u7F6E\uFF08\u5B9F\u8CEA\u7684\u306B\u975E\u8868\u793A\u306B\u3059\u308B\uFF09\n        if (isVisible) {\n          output.pos = vec4f(ndcX, ndcY, 0.0, 1.0);\n          output.color = vec4f(1.0, 0.5, 0.0, 1.0); // \u30AA\u30EC\u30F3\u30B8\u8272\n        } else {\n          // \u753B\u9762\u5916\u306B\u914D\u7F6E\uFF08\u30AF\u30EA\u30C3\u30D4\u30F3\u30B0\u3055\u308C\u308B\uFF09\n          output.pos = vec4f(0.0, 0.0, 10.0, 0.0); \n          output.color = vec4f(0.0, 0.0, 0.0, 0.0); // \u900F\u660E\n        }\n        \n        return output;\n      }\n      \n      @fragment\n      fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {\n        return input.color;\n      }\n    "
        }); // 線分の頂点バッファレイアウト
        lineVertexBufferLayout = {
          arrayStride: 8,
          attributes: [{
            format: "float32x2",
            offset: 0,
            shaderLocation: 0
          }]
        }; // 線分の頂点データ（単純な2点を定義するだけでOK）
        lineVertices = new Float32Array([0, 0,
        // 開始点（シェーダー内で実際の位置に置き換え）
        0, 0 // 終了点（シェーダー内で実際の位置に置き換え）
        ]); // 線分の頂点バッファ
        lineVertexBuffer = device.createBuffer({
          label: "Line vertices",
          size: lineVertices.byteLength,
          usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        });
        device.queue.writeBuffer(lineVertexBuffer, 0, lineVertices);

        // 線分用のバインドグループを作成
        lineBindGroup = device.createBindGroup({
          label: "Line renderer bind group",
          layout: renderBindGroupLayout,
          entries: [{
            binding: 0,
            resource: {
              buffer: line_output
            }
          }, {
            binding: 1,
            resource: {
              buffer: scene
            }
          }]
        }); // 線分用のパイプラインを作成
        linePipeline = device.createRenderPipeline({
          label: "Line pipeline",
          layout: renderPipelineLayout,
          // 同じレイアウトを使用可能
          vertex: {
            module: lineShaderModule,
            // 線分用のシェーダーモジュール
            entryPoint: "vertexMain",
            buffers: [lineVertexBufferLayout]
          },
          fragment: {
            module: lineShaderModule,
            entryPoint: "fragmentMain",
            targets: [{
              format: canvasFormat
            }]
          },
          primitive: {
            topology: "line-list",
            // ここで線分として描画指定
            stripIndexFormat: undefined
          }
        }); // END 線分要素の描画関係
        // END Geometry Shader
        // 計算を更新する関数
        // レンダリングを更新する関数
        // ページ初回ロード時
        initializeState();

        // 初期化の処理
        // overlay 用キャンバス・コンテキスト(計算時間を表示するために追加)
        overlayCtx = overlayCanvas.getContext("2d");
        overlayCanvas.width = width; // キャンバスの幅(px)
        overlayCanvas.height = height; // キャンバスの高さ(px)
        overlayCanvas.style.width = width + 'px';
        overlayCanvas.style.height = height + 'px';
        // オーバーレイキャンバスでテキスト描画する関数

        // カラーモードの変更時に実行される関数

        // ラジオボタン要素のイベントの追加
        modeRadioId.addEventListener("change", function () {
          return changeColorMode("id");
        });
        modeRadioVabs.addEventListener("change", function () {
          return changeColorMode("vabs");
        });

        // マウスのドラッグ関係
        // マウス押下時の処理
        canvas.addEventListener("mousedown", function (event) {
          isDragging = true;
          canvas.style.cursor = "grabbing"; // ドラッグ時のカーソル
          var rect = canvas.getBoundingClientRect();
          lastMouseX = event.clientX - rect.left;
          lastMouseY = event.clientY - rect.top;
        });
        // マウス移動時の処理
        canvas.addEventListener("mousemove", function (event) {
          // ドラッグしてなければ抜ける
          if (!isDragging) return;
          var rect = canvas.getBoundingClientRect();
          var mouseX = event.clientX - rect.left;
          var mouseY = event.clientY - rect.top;
          var dx = mouseX - lastMouseX;
          var dy = mouseY - lastMouseY;

          // zoomしても移動量は一定にする
          offsetX -= dx / zoomValue;
          // Canvas は上が0で下に行くほど大きくなる。WebGPUでは下端が-1,上端が1なので符号を反転
          offsetY += dy / zoomValue;
          lastMouseX = mouseX;
          lastMouseY = mouseY;
          // レンダリングを更新
          updateZoom();
        });
        canvas.addEventListener("mouseup", function () {
          isDragging = false;
          canvas.style.cursor = "grab"; // カーソルを元に戻す
        });
        // END マウスのドラッグ関係

        // マウスのズーム関係
        canvas.addEventListener("wheel", function (event) {
          event.preventDefault();
          // キャンバス上のマウス座標を取得
          var rect = canvas.getBoundingClientRect();
          var mouseX = event.clientX - rect.left;
          var mouseY = event.clientY - rect.top;
          var oldZoom = zoomValue;
          var zoomFactor = 1.1; // ズームの強さ
          if (event.deltaY < 0) {
            zoomValue *= zoomFactor;
          } else {
            zoomValue /= zoomFactor;
          }
          zoomValue = Math.max(0.1, Math.min(zoomValue, 12)); // ズーム範囲の制限

          // マウス座標を基準にカメラ中心を調整し、ピボット拡大縮小
          var ratio = zoomValue / oldZoom;

          // ピボットズーム計算：マウス位置を固定点として、centerXとcenterYを調整
          offsetX = mouseX - 1 / ratio * (mouseX - offsetX);
          offsetY = ctx.canvas.height - mouseY - 1 / ratio * (ctx.canvas.height - mouseY - offsetY);
          updateZoom();
        });

        // ズーム更新関数

        // END マウスのズーム関係

        // 線分表示チェックボックスの制御
        enableLineCheckbox.addEventListener("change", function () {
          // チェックボックスの状態に応じて線分の有効/無効を切り替え   
          // 更新した値をGPUバッファに反映
          // 両方のバッファを更新
          device.queue.writeBuffer(line_input, 0, initializeInputLinesBuffer());
          device.queue.writeBuffer(line_output, 0, initializeInputLinesBuffer()); // line_outputも更新する
          // レンダリングの更新
          updateZoom();
        });
        // END 線分表示チェックボックスの制御
        counter = 0;
        timerId = undefined;
        UPDATE_INTERVAL = 1 / fps * 1000; //16.70 * 2; // Update every 16.7*2ms (30fps)
        // メインループ
        // END メインループ
        // スタート処理
        // Start ボタンのイベントリスナーを追加
        startButton.addEventListener("click", start, false);

        // ストップ処理

        // Stop ボタンのイベントリスナーを追加
        stopButton.addEventListener("click", stopSimulation, false);

        // シミュレーションリセット処理

        // Reset ボタンのイベントリスナーを追加
        resetButton.addEventListener("click", resetSimulation, false);

        // リセット押下時の処理

        // restart ボタンのイベントリスナーを追加
        resetViewButton.addEventListener("click", resetView, false);

        // aとbの間のランダムな数を計算する関数

        // クランプ関数
      case 142:
      case "end":
        return _context2.stop();
    }
  }, _callee2);
}))();
},{}],"C:/Users/15X03Y2/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "8287" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["C:/Users/15X03Y2/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map