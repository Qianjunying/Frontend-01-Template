```js
let names = Object.getOwnPropertyNames(window);


function filterOut(names, props) {
    let set = new Set();
    props.forEach(o => set.add(o));
    return names.filter(e => !set.has(e));
}

// ecma 262
{
    let js = new Set();
    let objects = ["BigInt", "BigInt64Array", "BigUint64Array", "Infinity", "NaN", "undefined", "eval", "isFinite",
        "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "Array",
        "Date", "RegExp", "Promise", "Proxy", "Map", "WeakMap", "Set", "WeakSet", "Function", "Boolean", "String", "Number",
        "Symbol", "Object", "Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError",
        "ArrayBuffer", "SharedArrayBuffer", "DataView", "Float32Array", "Float64Array", "Int8Array", "Int16Array", "Int32Array",
        "Uint8Array", "Uint16Array", "Uint32Array", "Uint8ClampedArray", "Atomics", "JSON", "Math", "Reflect", "escape", "unescape"
    ];
    objects.forEach(o => js.add(o));
    names = names.filter(e => !js.has(e));
}

// DOM 中的元素构造器
names = names.filter(e => {
    try {
        return !(window[e].prototype instanceof Node)
    } catch (err) {
        return true;
    }
}).filter(e => e != "Node")

// https://html.spec.whatwg.org/#window 
let windowprops = new Set();
objects = ["window", "self", "document", "name", "location", "history", "customElements", "locationbar", "menubar", " personalbar", "scrollbars", "statusbar", "toolbar", "status", "close", "closed", "stop", "focus", " blur", "frames", "length", "top", "opener", "parent", "frameElement", "open", "navigator", "applicationCache", "alert", "confirm", "prompt", "print", "postMessage", "console"];
objects.forEach(o => windowprops.add(o));
names = names.filter(e => !windowprops.has(e));

// 过滤掉所有的事件，也就是 on 开头的属性 webkit 前缀的私有属性过滤掉：
names = names.filter(e => !e.match(/^on/)).filter(e => !e.match(/^webkit/));



let interfaces = new Set();
objects = ["ApplicationCache", "AudioTrack", "AudioTrackList", "BarProp", "BeforeUnloadEvent", "BroadcastChannel", "CanvasGradient", "CanvasPattern", "CanvasRenderingContext2D", "CloseEvent", "CustomElementRegistry", "DOMStringList", "DOMStringMap", "DataTransfer", "DataTransferItem", "DataTransferItemList", "DedicatedWorkerGlobalScope", "Document", "DragEvent", "ErrorEvent", "EventSource", "External", "FormDataEvent", "HTMLAllCollection", "HashChangeEvent", "History", "ImageBitmap", "ImageBitmapRenderingContext", "ImageData", "Location", "MediaError", "MessageChannel", "MessageEvent", "MessagePort", "MimeType", "MimeTypeArray", "Navigator", "OffscreenCanvas", "OffscreenCanvasRenderingContext2D", "PageTransitionEvent", "Path2D", "Plugin", "PluginArray", "PopStateEvent", "PromiseRejectionEvent", "RadioNodeList", "SharedWorker", "SharedWorkerGlobalScope", "Storage", "StorageEvent", "TextMetrics", "TextTrack", "TextTrackCue", "TextTrackCueList", "TextTrackList", "TimeRanges", "TrackEvent", "ValidityState", "VideoTrack", "VideoTrackList", "WebSocket", "Window", "Worker", "WorkerGlobalScope", "WorkerLocation", "WorkerNavigator"];
objects.forEach(o => interfaces.add(o));

names = names.filter(e => !interfaces.has(e));

// http://www.ecma-international.org/ecma-402/5.0/index.html#Title
names = names.filter(e => e !== "Intl");

// Streams 标准 https://streams.spec.whatwg.org/#blqs-class
names = filterOut(names, ["ReadableStream", "ReadableStreamDefaultReader", "ReadableStreamBYOBReader", "ReadableStreamDefaultController", "ReadableByteStreamController", "ReadableStreamBYOBRequest", "WritableStream", "WritableStreamDefaultWriter", "WritableStreamDefaultController", "TransformStream", "TransformStreamDefaultController", "ByteLengthQueuingStrategy", "CountQueuingStrategy"]);

// WebGL https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15
names = filterOut(names, ["WebGLContextEvent", "WebGLObject", "WebGLBuffer", "WebGLFramebuffer", "WebGLProgram", "WebGLRenderbuffer", "WebGLShader", "WebGLTexture", "WebGLUniformLocation", "WebGLActiveInfo", "WebGLShaderPrecisionFormat", "WebGLRenderingContext"]);

// Web Audio API https://www.w3.org/TR/webaudio/
names = filterOut(names, ["AudioContext", "AudioNode", "AnalyserNode", "AudioBuffer", "AudioBufferSourceNode", "AudioDestinationNode", "AudioParam", "AudioListener", "AudioWorklet", "AudioWorkletGlobalScope", "AudioWorkletNode", "AudioWorkletProcessor", "BiquadFilterNode", "ChannelMergerNode", "ChannelSplitterNode", "ConstantSourceNode", "ConvolverNode", "DelayNode", "DynamicsCompressorNode", "GainNode", "IIRFilterNode", "MediaElementAudioSourceNode", "MediaStreamAudioSourceNode", "MediaStreamTrackAudioSourceNode", "MediaStreamAudioDestinationNode", "PannerNode", "PeriodicWave", "OscillatorNode", "StereoPannerNode", "WaveShaperNode", "ScriptProcessorNode", "AudioProcessingEvent"])

// Encoding 标准 https://encoding.spec.whatwg.org/#dom-textencoder
names = filterOut(names, ["TextDecoder", "TextEncoder", "TextDecoderStream", "TextEncoderStream"]);

// Web Background Synchronization https://wicg.github.io/BackgroundSync/spec/#sync-manager-interface
names = names.filter(e => e !== "SyncManager");

// Web Cryptography API https://www.w3.org/TR/WebCryptoAPI/
names = filterOut(names, ["CryptoKey", "SubtleCrypto", "Crypto", "crypto"]);

// Media Source Extensions https://www.w3.org/TR/media-source/
names = filterOut(names, ["MediaSource", "SourceBuffer", "SourceBufferList"]);

// The Screen Orientation API https://www.w3.org/TR/screen-orientation/
names = names.filter(e => e !== "ScreenOrientation");

console.log(names)
```