var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var vision = {};

var fileset_resolver = {};

/**
 * Copyright 2022 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(fileset_resolver, "__esModule", { value: true });
fileset_resolver.FilesetResolver = void 0;
let supportsSimd;
/**
 * Simple WASM program to test compatibility with the M91 instruction set.
 * Compiled from
 * https://github.com/GoogleChromeLabs/wasm-feature-detect/blob/main/src/detectors/simd/module.wat
 */
const WASM_SIMD_CHECK = new Uint8Array([
    0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3,
    2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11
]);
async function isSimdSupported() {
    if (supportsSimd === undefined) {
        try {
            await WebAssembly.instantiate(WASM_SIMD_CHECK);
            supportsSimd = true;
        }
        catch {
            supportsSimd = false;
        }
    }
    return supportsSimd;
}
async function createFileset(taskName, basePath = '') {
    const suffix = await isSimdSupported() ? 'wasm_internal' : 'wasm_nosimd_internal';
    return {
        wasmLoaderPath: `${basePath}/${taskName}_${suffix}.js`,
        wasmBinaryPath: `${basePath}/${taskName}_${suffix}.wasm`,
    };
}
// tslint:disable:class-as-namespace
/**
 * Resolves the files required for the MediaPipe Task APIs.
 *
 * This class verifies whether SIMD is supported in the current environment and
 * loads the SIMD files only if support is detected. The returned filesets
 * require that the Wasm files are published without renaming. If this is not
 * possible, you can invoke the MediaPipe Tasks APIs using a manually created
 * `WasmFileset`.
 */
class FilesetResolver$1 {
    /**
     * Returns whether SIMD is supported in the current environment.
     *
     * If your environment requires custom locations for the MediaPipe Wasm files,
     * you can use `isSimdSupported()` to decide whether to load the SIMD-based
     * assets.
     *
     * @export
     * @return Whether SIMD support was detected in the current environment.
     */
    static isSimdSupported() {
        return isSimdSupported();
    }
    /**
     * Creates a fileset for the MediaPipe Audio tasks.
     *
     * @export
     * @param basePath An optional base path to specify the directory the Wasm
     *    files should be loaded from. If not specified, the Wasm files are
     *    loaded from the host's root directory.
     * @return A `WasmFileset` that can be used to initialize MediaPipe Audio
     *    tasks.
     */
    static forAudioTasks(basePath) {
        return createFileset('audio', basePath);
    }
    /**
     * Creates a fileset for the MediaPipe GenAI tasks.
     *
     * @export
     * @param basePath An optional base path to specify the directory the Wasm
     *    files should be loaded from. If not specified, the Wasm files are
     *    loaded from the host's root directory.
     * @return A `WasmFileset` that can be used to initialize MediaPipe GenAI
     *    tasks.
     */
    static forGenAiTasks(basePath) {
        return createFileset('genai', basePath);
    }
    /**
     * Creates a fileset for the MediaPipe GenAI Experimental tasks.
     *
     * @export
     * @param basePath An optional base path to specify the directory the Wasm
     *    files should be loaded from. If not specified, the Wasm files are
     *    loaded from the host's root directory.
     * @return A `WasmFileset` that can be used to initialize MediaPipe GenAI
     *    tasks.
     */
    static forGenAiExperimentalTasks(basePath) {
        return createFileset('genai_experimental', basePath);
    }
    /**
     * Creates a fileset for the MediaPipe Text tasks.
     *
     * @export
     * @param basePath An optional base path to specify the directory the Wasm
     *    files should be loaded from. If not specified, the Wasm files are
     *    loaded from the host's root directory.
     * @return A `WasmFileset` that can be used to initialize MediaPipe Text
     *    tasks.
     */
    static forTextTasks(basePath) {
        return createFileset('text', basePath);
    }
    /**
     * Creates a fileset for the MediaPipe Vision tasks.
     *
     * @export
     * @param basePath An optional base path to specify the directory the Wasm
     *    files should be loaded from. If not specified, the Wasm files are
     *    loaded from the host's root directory.
     * @return A `WasmFileset` that can be used to initialize MediaPipe Vision
     *    tasks.
     */
    static forVisionTasks(basePath) {
        return createFileset('vision', basePath);
    }
}
fileset_resolver.FilesetResolver = FilesetResolver$1;

var drawing_utils = {};

var drawing_utils_category_mask = {};

var image_shader_context = {};

/**
 * Copyright 2023 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(image_shader_context, "__esModule", { value: true });
image_shader_context.MPImageShaderContext = image_shader_context.assertExists = void 0;
const VERTEX_SHADER = `
  attribute vec2 aVertex;
  attribute vec2 aTex;
  varying vec2 vTex;
  void main(void) {
    gl_Position = vec4(aVertex, 0.0, 1.0);
    vTex = aTex;
  }`;
const FRAGMENT_SHADER$2 = `
  precision mediump float;
  varying vec2 vTex;
  uniform sampler2D inputTexture;
  void main() {
    gl_FragColor = texture2D(inputTexture, vTex);
    gl_FragColor.a = gl_FragColor.r;
  }
 `;
/** Helper to assert that `value` is not null or undefined.  */
function assertExists(value, msg) {
    if (!value) {
        throw new Error(`Unable to obtain required WebGL resource: ${msg}`);
    }
    return value;
}
image_shader_context.assertExists = assertExists;
/**
 * Utility class that encapsulates the buffers used by `MPImageShaderContext`.
 * For internal use only.
 */
class MPImageShaderBuffers {
    constructor(gl, vertexArrayObject, vertexBuffer, textureBuffer) {
        this.gl = gl;
        this.vertexArrayObject = vertexArrayObject;
        this.vertexBuffer = vertexBuffer;
        this.textureBuffer = textureBuffer;
    }
    bind() {
        this.gl.bindVertexArray(this.vertexArrayObject);
    }
    unbind() {
        this.gl.bindVertexArray(null);
    }
    close() {
        this.gl.deleteVertexArray(this.vertexArrayObject);
        this.gl.deleteBuffer(this.vertexBuffer);
        this.gl.deleteBuffer(this.textureBuffer);
    }
}
/**
 * A class that encapsulates the shaders used by an MPImage. Can be re-used
 * across MPImages that use the same WebGL2Rendering context.
 *
 * For internal use only.
 */
class MPImageShaderContext {
    getFragmentShader() {
        return FRAGMENT_SHADER$2;
    }
    getVertexShader() {
        return VERTEX_SHADER;
    }
    compileShader(source, type) {
        const gl = this.gl;
        const shader = assertExists(gl.createShader(type), 'Failed to create WebGL shader');
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(shader);
            throw new Error(`Could not compile WebGL shader: ${info}`);
        }
        gl.attachShader(this.program, shader);
        return shader;
    }
    setupShaders() {
        const gl = this.gl;
        this.program =
            assertExists(gl.createProgram(), 'Failed to create WebGL program');
        this.vertexShader =
            this.compileShader(this.getVertexShader(), gl.VERTEX_SHADER);
        this.fragmentShader =
            this.compileShader(this.getFragmentShader(), gl.FRAGMENT_SHADER);
        gl.linkProgram(this.program);
        const linked = gl.getProgramParameter(this.program, gl.LINK_STATUS);
        if (!linked) {
            const info = gl.getProgramInfoLog(this.program);
            throw new Error(`Error during program linking: ${info}`);
        }
        this.aVertex = gl.getAttribLocation(this.program, 'aVertex');
        this.aTex = gl.getAttribLocation(this.program, 'aTex');
    }
    setupTextures() { }
    configureUniforms() { }
    createBuffers(flipVertically) {
        const gl = this.gl;
        const vertexArrayObject = assertExists(gl.createVertexArray(), 'Failed to create vertex array');
        gl.bindVertexArray(vertexArrayObject);
        const vertexBuffer = assertExists(gl.createBuffer(), 'Failed to create buffer');
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.enableVertexAttribArray(this.aVertex);
        gl.vertexAttribPointer(this.aVertex, 2, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
        const textureBuffer = assertExists(gl.createBuffer(), 'Failed to create buffer');
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.enableVertexAttribArray(this.aTex);
        gl.vertexAttribPointer(this.aTex, 2, gl.FLOAT, false, 0, 0);
        const bufferData = flipVertically ? [0, 1, 0, 0, 1, 0, 1, 1] : [0, 0, 0, 1, 1, 1, 1, 0];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindVertexArray(null);
        return new MPImageShaderBuffers(gl, vertexArrayObject, vertexBuffer, textureBuffer);
    }
    getShaderBuffers(flipVertically) {
        if (flipVertically) {
            if (!this.shaderBuffersFlipVertically) {
                this.shaderBuffersFlipVertically =
                    this.createBuffers(/* flipVertically= */ true);
            }
            return this.shaderBuffersFlipVertically;
        }
        else {
            if (!this.shaderBuffersPassthrough) {
                this.shaderBuffersPassthrough =
                    this.createBuffers(/* flipVertically= */ false);
            }
            return this.shaderBuffersPassthrough;
        }
    }
    maybeInitGL(gl) {
        if (!this.gl) {
            this.gl = gl;
        }
        else if (gl !== this.gl) {
            throw new Error('Cannot change GL context once initialized');
        }
    }
    /** Runs the callback using the shader. */
    run(gl, flipVertically, callback) {
        this.maybeInitGL(gl);
        if (!this.program) {
            this.setupShaders();
            this.setupTextures();
        }
        const shaderBuffers = this.getShaderBuffers(flipVertically);
        gl.useProgram(this.program);
        shaderBuffers.bind();
        this.configureUniforms();
        const result = callback();
        shaderBuffers.unbind();
        return result;
    }
    /**
     * Creates and configures a texture.
     *
     * @param gl The rendering context.
     * @param filter The setting to use for `gl.TEXTURE_MIN_FILTER` and
     *     `gl.TEXTURE_MAG_FILTER`. Defaults to `gl.LINEAR`.
     * @param wrapping The setting to use for `gl.TEXTURE_WRAP_S` and
     *     `gl.TEXTURE_WRAP_T`. Defaults to `gl.CLAMP_TO_EDGE`.
     */
    createTexture(gl, filter, wrapping) {
        this.maybeInitGL(gl);
        const texture = assertExists(gl.createTexture(), 'Failed to create texture');
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapping ?? gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapping ?? gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter ?? gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter ?? gl.LINEAR);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }
    /**
     * Binds a framebuffer to the canvas. If the framebuffer does not yet exist,
     * creates it first. Binds the provided texture to the framebuffer.
     */
    bindFramebuffer(gl, texture) {
        this.maybeInitGL(gl);
        if (!this.framebuffer) {
            this.framebuffer =
                assertExists(gl.createFramebuffer(), 'Failed to create framebuffe.');
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    }
    unbindFramebuffer() {
        this.gl?.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }
    close() {
        if (this.program) {
            const gl = this.gl;
            gl.deleteProgram(this.program);
            gl.deleteShader(this.vertexShader);
            gl.deleteShader(this.fragmentShader);
        }
        if (this.framebuffer) {
            this.gl.deleteFramebuffer(this.framebuffer);
        }
        if (this.shaderBuffersPassthrough) {
            this.shaderBuffersPassthrough.close();
        }
        if (this.shaderBuffersFlipVertically) {
            this.shaderBuffersFlipVertically.close();
        }
    }
}
image_shader_context.MPImageShaderContext = MPImageShaderContext;

/**
 * Copyright 2023 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(drawing_utils_category_mask, "__esModule", { value: true });
drawing_utils_category_mask.CategoryMaskShaderContext = void 0;
const image_shader_context_1$5 = image_shader_context;
/**
 * A fragment shader that maps categories to colors based on a background
 * texture, a mask texture and a 256x1 "color mapping texture" that contains one
 * color for each pixel.
 */
const FRAGMENT_SHADER$1 = `
  precision mediump float;
  uniform sampler2D backgroundTexture;
  uniform sampler2D maskTexture;
  uniform sampler2D colorMappingTexture;
  varying vec2 vTex;
  void main() {
    vec4 backgroundColor = texture2D(backgroundTexture, vTex);
    float category = texture2D(maskTexture, vTex).r;
    vec4 categoryColor = texture2D(colorMappingTexture, vec2(category, 0.0));
    gl_FragColor = mix(backgroundColor, categoryColor, categoryColor.a);
  }
 `;
/** Checks CategoryToColorMap maps for deep equality. */
function isEqualColorMap(a, b) {
    if (a !== b) {
        return false;
    }
    const aEntries = a.entries();
    const bEntries = b.entries();
    for (const [aKey, aValue] of aEntries) {
        const bNext = bEntries.next();
        if (bNext.done) {
            return false;
        }
        const [bKey, bValue] = bNext.value;
        if (aKey !== bKey) {
            return false;
        }
        if (aValue[0] !== bValue[0] || aValue[1] !== bValue[1] ||
            aValue[2] !== bValue[2] || aValue[3] !== bValue[3]) {
            return false;
        }
    }
    return !!bEntries.next().done;
}
/** A drawing util class for category masks. */
class CategoryMaskShaderContext extends image_shader_context_1$5.MPImageShaderContext {
    bindAndUploadTextures(categoryMask, background, colorMap) {
        const gl = this.gl;
        // Bind category mask
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, categoryMask);
        // TODO: We should avoid uploading textures from CPU to GPU
        // if the textures haven't changed. This can lead to drastic performance
        // slowdowns (~50ms per frame). Users can reduce the penalty by passing a
        // canvas object instead of ImageData/HTMLImageElement.
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.backgroundTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, background);
        // Bind color mapping texture if changed.
        if (!this.currentColorMap ||
            !isEqualColorMap(this.currentColorMap, colorMap)) {
            this.currentColorMap = colorMap;
            const pixels = new Array(256 * 4).fill(0);
            colorMap.forEach((rgba, index) => {
                if (rgba.length !== 4) {
                    throw new Error(`Color at index ${index} is not a four-channel value.`);
                }
                pixels[index * 4] = rgba[0];
                pixels[index * 4 + 1] = rgba[1];
                pixels[index * 4 + 2] = rgba[2];
                pixels[index * 4 + 3] = rgba[3];
            });
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, this.colorMappingTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(pixels));
        }
        else {
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, this.colorMappingTexture);
        }
    }
    unbindTextures() {
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    getFragmentShader() {
        return FRAGMENT_SHADER$1;
    }
    setupTextures() {
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE1);
        this.backgroundTexture = this.createTexture(gl, gl.LINEAR);
        // Use `gl.NEAREST` to prevent interpolating values in our category to
        // color map.
        gl.activeTexture(gl.TEXTURE2);
        this.colorMappingTexture = this.createTexture(gl, gl.NEAREST);
    }
    setupShaders() {
        super.setupShaders();
        const gl = this.gl;
        this.backgroundTextureUniform = (0, image_shader_context_1$5.assertExists)(gl.getUniformLocation(this.program, 'backgroundTexture'), 'Uniform location');
        this.colorMappingTextureUniform = (0, image_shader_context_1$5.assertExists)(gl.getUniformLocation(this.program, 'colorMappingTexture'), 'Uniform location');
        this.maskTextureUniform = (0, image_shader_context_1$5.assertExists)(gl.getUniformLocation(this.program, 'maskTexture'), 'Uniform location');
    }
    configureUniforms() {
        super.configureUniforms();
        const gl = this.gl;
        gl.uniform1i(this.maskTextureUniform, 0);
        gl.uniform1i(this.backgroundTextureUniform, 1);
        gl.uniform1i(this.colorMappingTextureUniform, 2);
    }
    close() {
        if (this.backgroundTexture) {
            this.gl.deleteTexture(this.backgroundTexture);
        }
        if (this.colorMappingTexture) {
            this.gl.deleteTexture(this.colorMappingTexture);
        }
        super.close();
    }
}
drawing_utils_category_mask.CategoryMaskShaderContext = CategoryMaskShaderContext;

var drawing_utils_confidence_mask = {};

/**
 * Copyright 2023 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(drawing_utils_confidence_mask, "__esModule", { value: true });
drawing_utils_confidence_mask.ConfidenceMaskShaderContext = void 0;
const image_shader_context_1$4 = image_shader_context;
/**
 * A fragment shader that blends a default image and overlay texture based on an
 * input texture that contains confidence values.
 */
const FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D maskTexture;
  uniform sampler2D defaultTexture;
  uniform sampler2D overlayTexture;
  varying vec2 vTex;
  void main() {
    float confidence = texture2D(maskTexture, vTex).r;
    vec4 defaultColor = texture2D(defaultTexture, vTex);
    vec4 overlayColor = texture2D(overlayTexture, vTex);
    // Apply the alpha from the overlay and merge in the default color
    overlayColor = mix(defaultColor, overlayColor, overlayColor.a);
    gl_FragColor = mix(defaultColor, overlayColor, confidence);
  }
 `;
/** A drawing util class for confidence masks. */
class ConfidenceMaskShaderContext extends image_shader_context_1$4.MPImageShaderContext {
    getFragmentShader() {
        return FRAGMENT_SHADER;
    }
    setupTextures() {
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE1);
        this.defaultTexture = this.createTexture(gl);
        gl.activeTexture(gl.TEXTURE2);
        this.overlayTexture = this.createTexture(gl);
    }
    setupShaders() {
        super.setupShaders();
        const gl = this.gl;
        this.defaultTextureUniform = (0, image_shader_context_1$4.assertExists)(gl.getUniformLocation(this.program, 'defaultTexture'), 'Uniform location');
        this.overlayTextureUniform = (0, image_shader_context_1$4.assertExists)(gl.getUniformLocation(this.program, 'overlayTexture'), 'Uniform location');
        this.maskTextureUniform = (0, image_shader_context_1$4.assertExists)(gl.getUniformLocation(this.program, 'maskTexture'), 'Uniform location');
    }
    configureUniforms() {
        super.configureUniforms();
        const gl = this.gl;
        gl.uniform1i(this.maskTextureUniform, 0);
        gl.uniform1i(this.defaultTextureUniform, 1);
        gl.uniform1i(this.overlayTextureUniform, 2);
    }
    bindAndUploadTextures(defaultImage, overlayImage, confidenceMask) {
        // TODO: We should avoid uploading textures from CPU to GPU
        // if the textures haven't changed. This can lead to drastic performance
        // slowdowns (~50ms per frame). Users can reduce the penalty by passing a
        // canvas object instead of ImageData/HTMLImageElement.
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, confidenceMask);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.defaultTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, defaultImage);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.overlayTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, overlayImage);
    }
    unbindTextures() {
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    close() {
        if (this.defaultTexture) {
            this.gl.deleteTexture(this.defaultTexture);
        }
        if (this.overlayTexture) {
            this.gl.deleteTexture(this.overlayTexture);
        }
        super.close();
    }
}
drawing_utils_confidence_mask.ConfidenceMaskShaderContext = ConfidenceMaskShaderContext;

var mask = {};

var platform_utils = {};

/**
 * Copyright 2023 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(platform_utils, "__esModule", { value: true });
platform_utils.supportsOffscreenCanvas = platform_utils.isIOS = platform_utils.isWebKit = void 0;
/** Returns whether the underlying rendering engine is WebKit. */
function isWebKit(browser = navigator) {
    const userAgent = browser.userAgent;
    // Note that this returns true for Chrome on iOS (which is running WebKit) as
    // it uses "CriOS".
    return userAgent.includes('Safari') && !userAgent.includes('Chrome');
}
platform_utils.isWebKit = isWebKit;
/** Detect if code is running on iOS. */
function isIOS() {
    // Source:
    // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
    return [
        'iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone',
        'iPod'
        // tslint:disable-next-line:deprecation
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes('Mac') && 'ontouchend' in self.document);
}
platform_utils.isIOS = isIOS;
/**
 * Returns whether the underlying rendering engine supports obtaining a WebGL2
 * context from an OffscreenCanvas.
 */
function supportsOffscreenCanvas(browser = navigator) {
    if (typeof OffscreenCanvas === 'undefined')
        return false;
    if (isWebKit(browser)) {
        const userAgent = browser.userAgent;
        const match = userAgent.match(/Version\/([\d]+).*Safari/);
        if (match && match.length >= 1 && Number(match[1]) >= 17) {
            // Starting with version 17, Safari supports OffscreenCanvas with WebGL2
            // contexts.
            return true;
        }
        return false;
    }
    return true;
}
platform_utils.supportsOffscreenCanvas = supportsOffscreenCanvas;

/**
 * Copyright 2023 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(mask, "__esModule", { value: true });
mask.MPMask = void 0;
const image_shader_context_1$3 = image_shader_context;
const platform_utils_1$1 = platform_utils;
/** Number of instances a user can keep alive before we raise a warning. */
const INSTANCE_COUNT_WARNING_THRESHOLD$1 = 250;
/** The underlying type of the image. */
var MPMaskType;
(function (MPMaskType) {
    /** Represents the native `UInt8Array` type. */
    MPMaskType[MPMaskType["UINT8_ARRAY"] = 0] = "UINT8_ARRAY";
    /** Represents the native `Float32Array` type.  */
    MPMaskType[MPMaskType["FLOAT32_ARRAY"] = 1] = "FLOAT32_ARRAY";
    /** Represents the native `WebGLTexture` type. */
    MPMaskType[MPMaskType["WEBGL_TEXTURE"] = 2] = "WEBGL_TEXTURE";
})(MPMaskType || (MPMaskType = {}));
/**
 * The wrapper class for MediaPipe segmentation masks.
 *
 * Masks are stored as `Uint8Array`, `Float32Array` or `WebGLTexture` objects.
 * You can convert the underlying type to any other type by passing the desired
 * type to `getAs...()`. As type conversions can be expensive, it is recommended
 * to limit these conversions. You can verify what underlying types are already
 * available by invoking `has...()`.
 *
 * Masks that are returned from a MediaPipe Tasks are owned by by the
 * underlying C++ Task. If you need to extend the lifetime of these objects,
 * you can invoke the `clone()` method. To free up the resources obtained
 * during any clone or type conversion operation, it is important to invoke
 * `close()` on the `MPMask` instance.
 */
class MPMask$1 {
    /**
     * @param containers The data source for this mask as a `WebGLTexture`,
     *     `Unit8Array` or `Float32Array`. Multiple sources of the same data can
     *     be provided to reduce conversions.
     * @param interpolateValues If enabled, uses `gl.LINEAR` instead of
     *     `gl.NEAREST` to interpolate between mask values.
     * @param ownsWebGLTexture Whether the MPMask should take ownership of the
     *     `WebGLTexture` and free it when closed.
     * @param canvas The canvas to use for rendering and conversion. Must be the
     *     same canvas for any WebGL resources.
     * @param shaderContext A shader context that is shared between all masks from
     *     a single task.
     * @param width The width of the mask.
     * @param height The height of the mask.
     * @hideconstructor
     */
    constructor(containers, interpolateValues, ownsWebGLTexture, 
    /** Returns the canvas element that the mask is bound to. */
    canvas, shaderContext, 
    /** Returns the width of the mask. */
    width, 
    /** Returns the height of the mask. */
    height) {
        this.containers = containers;
        this.interpolateValues = interpolateValues;
        this.ownsWebGLTexture = ownsWebGLTexture;
        this.canvas = canvas;
        this.shaderContext = shaderContext;
        this.width = width;
        this.height = height;
        if (this.ownsWebGLTexture) {
            --MPMask$1.instancesBeforeWarning;
            if (MPMask$1.instancesBeforeWarning === 0) {
                console.error('You seem to be creating MPMask instances without invoking ' +
                    '.close(). This leaks resources.');
            }
        }
    }
    /**
     * Returns whether this `MPMask` contains a mask of type `Uint8Array`.
     * @export
     */
    hasUint8Array() {
        return !!this.getContainer(MPMaskType.UINT8_ARRAY);
    }
    /**
     * Returns whether this `MPMask` contains a mask of type `Float32Array`.
     * @export
     */
    hasFloat32Array() {
        return !!this.getContainer(MPMaskType.FLOAT32_ARRAY);
    }
    /**
     * Returns whether this `MPMask` contains a mask of type `WebGLTexture`.
     * @export
     */
    hasWebGLTexture() {
        return !!this.getContainer(MPMaskType.WEBGL_TEXTURE);
    }
    /**
     * Returns the underlying mask as a Uint8Array`. Note that this involves an
     * expensive GPU to CPU transfer if the current mask is only available as a
     * `WebGLTexture`.
     *
     * @export
     * @return The current data as a Uint8Array.
     */
    getAsUint8Array() {
        return this.convertToUint8Array();
    }
    /**
     * Returns the underlying mask as a single channel `Float32Array`. Note that
     * this involves an expensive GPU to CPU transfer if the current mask is
     * only available as a `WebGLTexture`.
     *
     * @export
     * @return The current mask as a Float32Array.
     */
    getAsFloat32Array() {
        return this.convertToFloat32Array();
    }
    /**
     * Returns the underlying mask as a `WebGLTexture` object. Note that this
     * involves a CPU to GPU transfer if the current mask is only available as
     * a CPU array. The returned texture is bound to the current canvas (see
     * `.canvas`).
     *
     * @export
     * @return The current mask as a WebGLTexture.
     */
    getAsWebGLTexture() {
        return this.convertToWebGLTexture();
    }
    /**
     * Returns the texture format used for writing float textures on this
     * platform.
     */
    getTexImage2DFormat() {
        const gl = this.getGL();
        if (!MPMask$1.texImage2DFormat) {
            // Note: This is the same check we use in
            // `SegmentationPostprocessorGl::GetSegmentationResultGpu()`.
            if (gl.getExtension('EXT_color_buffer_float') &&
                gl.getExtension('OES_texture_float_linear') &&
                gl.getExtension('EXT_float_blend')) {
                MPMask$1.texImage2DFormat = gl.R32F;
            }
            else if (gl.getExtension('EXT_color_buffer_half_float')) {
                MPMask$1.texImage2DFormat = gl.R16F;
            }
            else {
                throw new Error('GPU does not fully support 4-channel float32 or float16 formats');
            }
        }
        return MPMask$1.texImage2DFormat;
    }
    /** Returns the container for the requested storage type iff it exists. */
    getContainer(type) {
        switch (type) {
            case MPMaskType.UINT8_ARRAY:
                return this.containers.find(img => img instanceof Uint8Array);
            case MPMaskType.FLOAT32_ARRAY:
                return this.containers.find(img => img instanceof Float32Array);
            case MPMaskType.WEBGL_TEXTURE:
                return this.containers.find(img => typeof WebGLTexture !== 'undefined' &&
                    img instanceof WebGLTexture);
            default:
                throw new Error(`Type is not supported: ${type}`);
        }
    }
    /**
     * Creates a copy of the resources stored in this `MPMask`. You can
     * invoke this method to extend the lifetime of a mask returned by a
     * MediaPipe Task. Note that performance critical applications should aim to
     * only use the `MPMask` within the MediaPipe Task callback so that
     * copies can be avoided.
     *
     * @export
     */
    clone() {
        const destinationContainers = [];
        // TODO: We might only want to clone one backing datastructure
        // even if multiple are defined;
        for (const container of this.containers) {
            let destinationContainer;
            if (container instanceof Uint8Array) {
                destinationContainer = new Uint8Array(container);
            }
            else if (container instanceof Float32Array) {
                destinationContainer = new Float32Array(container);
            }
            else if (container instanceof WebGLTexture) {
                const gl = this.getGL();
                const shaderContext = this.getShaderContext();
                // Create a new texture and use it to back a framebuffer
                gl.activeTexture(gl.TEXTURE1);
                destinationContainer = shaderContext.createTexture(gl, this.interpolateValues ? gl.LINEAR : gl.NEAREST);
                gl.bindTexture(gl.TEXTURE_2D, destinationContainer);
                const format = this.getTexImage2DFormat();
                gl.texImage2D(gl.TEXTURE_2D, 0, format, this.width, this.height, 0, gl.RED, gl.FLOAT, null);
                gl.bindTexture(gl.TEXTURE_2D, null);
                shaderContext.bindFramebuffer(gl, destinationContainer);
                shaderContext.run(gl, /* flipVertically= */ false, () => {
                    this.bindTexture(); // This activates gl.TEXTURE0
                    gl.clearColor(0, 0, 0, 0);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
                    this.unbindTexture();
                });
                shaderContext.unbindFramebuffer();
                this.unbindTexture();
            }
            else {
                throw new Error(`Type is not supported: ${container}`);
            }
            destinationContainers.push(destinationContainer);
        }
        return new MPMask$1(destinationContainers, this.interpolateValues, this.hasWebGLTexture(), this.canvas, this.shaderContext, this.width, this.height);
    }
    getGL() {
        if (!this.canvas) {
            throw new Error('Conversion to different image formats require that a canvas ' +
                'is passed when initializing the image.');
        }
        if (!this.gl) {
            this.gl = (0, image_shader_context_1$3.assertExists)(this.canvas.getContext('webgl2'), 'You cannot use a canvas that is already bound to a different ' +
                'type of rendering context.');
        }
        return this.gl;
    }
    getShaderContext() {
        if (!this.shaderContext) {
            this.shaderContext = new image_shader_context_1$3.MPImageShaderContext();
        }
        return this.shaderContext;
    }
    convertToFloat32Array() {
        let float32Array = this.getContainer(MPMaskType.FLOAT32_ARRAY);
        if (!float32Array) {
            const uint8Array = this.getContainer(MPMaskType.UINT8_ARRAY);
            if (uint8Array) {
                float32Array = new Float32Array(uint8Array).map(v => v / 255);
            }
            else {
                float32Array = new Float32Array(this.width * this.height);
                const gl = this.getGL();
                const shaderContext = this.getShaderContext();
                // Create texture if needed
                const webGlTexture = this.convertToWebGLTexture();
                // Create a framebuffer from the texture and read back pixels
                shaderContext.bindFramebuffer(gl, webGlTexture);
                if ((0, platform_utils_1$1.isIOS)()) {
                    // WebKit on iOS only supports gl.HALF_FLOAT for single channel reads
                    // (as tested on iOS 16.4). HALF_FLOAT requires reading data into a
                    // Uint16Array, however, and requires a manual bitwise conversion from
                    // Uint16 to floating point numbers. This conversion is more expensive
                    // that reading back a Float32Array from the RGBA image and dropping
                    // the superfluous data, so we do this instead.
                    const outputArray = new Float32Array(this.width * this.height * 4);
                    gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.FLOAT, outputArray);
                    for (let i = 0, j = 0; i < float32Array.length; ++i, j += 4) {
                        float32Array[i] = outputArray[j];
                    }
                }
                else {
                    gl.readPixels(0, 0, this.width, this.height, gl.RED, gl.FLOAT, float32Array);
                }
            }
            this.containers.push(float32Array);
        }
        return float32Array;
    }
    convertToUint8Array() {
        let uint8Array = this.getContainer(MPMaskType.UINT8_ARRAY);
        if (!uint8Array) {
            const floatArray = this.convertToFloat32Array();
            uint8Array = new Uint8Array(floatArray.map(v => 255 * v));
            this.containers.push(uint8Array);
        }
        return uint8Array;
    }
    convertToWebGLTexture() {
        let webGLTexture = this.getContainer(MPMaskType.WEBGL_TEXTURE);
        if (!webGLTexture) {
            const gl = this.getGL();
            webGLTexture = this.bindTexture();
            const data = this.convertToFloat32Array();
            const format = this.getTexImage2DFormat();
            gl.texImage2D(gl.TEXTURE_2D, 0, format, this.width, this.height, 0, gl.RED, gl.FLOAT, data);
            this.unbindTexture();
        }
        return webGLTexture;
    }
    /**
     * Binds the backing texture to the canvas. If the texture does not yet
     * exist, creates it first.
     */
    bindTexture() {
        const gl = this.getGL();
        gl.viewport(0, 0, this.width, this.height);
        gl.activeTexture(gl.TEXTURE0);
        let webGLTexture = this.getContainer(MPMaskType.WEBGL_TEXTURE);
        if (!webGLTexture) {
            const shaderContext = this.getShaderContext();
            webGLTexture = shaderContext.createTexture(gl, this.interpolateValues ? gl.LINEAR : gl.NEAREST);
            this.containers.push(webGLTexture);
            this.ownsWebGLTexture = true;
        }
        gl.bindTexture(gl.TEXTURE_2D, webGLTexture);
        return webGLTexture;
    }
    unbindTexture() {
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }
    /**
     * Frees up any resources owned by this `MPMask` instance.
     *
     * Note that this method does not free masks that are owned by the C++
     * Task, as these are freed automatically once you leave the MediaPipe
     * callback. Additionally, some shared state is freed only once you invoke
     * the Task's `close()` method.
     *
     * @export
     */
    close() {
        if (this.ownsWebGLTexture) {
            const gl = this.getGL();
            gl.deleteTexture(this.getContainer(MPMaskType.WEBGL_TEXTURE));
        }
        // User called close(). We no longer issue warning.
        MPMask$1.instancesBeforeWarning = -1;
    }
}
mask.MPMask = MPMask$1;
/**
 * A counter to track the number of instances of MPMask that own resources.
 * This is used to raise a warning if the user does not close the instances.
 */
MPMask$1.instancesBeforeWarning = INSTANCE_COUNT_WARNING_THRESHOLD$1;

/**
 * Copyright 2023 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(drawing_utils, "__esModule", { value: true });
drawing_utils.DrawingUtils = drawing_utils.DEFAULT_CATEGORY_TO_COLOR_MAP = void 0;
const drawing_utils_category_mask_1 = drawing_utils_category_mask;
const drawing_utils_confidence_mask_1 = drawing_utils_confidence_mask;
const image_shader_context_1$2 = image_shader_context;
const mask_1$2 = mask;
/** A color map with 22 classes. Used in our demos. */
drawing_utils.DEFAULT_CATEGORY_TO_COLOR_MAP = [
    [0, 0, 0, 0], // class 0 is BG = transparent
    [255, 0, 0, 255], // class 1 is red
    [0, 255, 0, 255], // class 2 is light green
    [0, 0, 255, 255], // class 3 is blue
    [255, 255, 0, 255], // class 4 is yellow
    [255, 0, 255, 255], // class 5 is light purple / magenta
    [0, 255, 255, 255], // class 6 is light blue / aqua
    [128, 128, 128, 255], // class 7 is gray
    [255, 100, 0, 255], // class 8 is dark orange
    [128, 0, 255, 255], // class 9 is dark purple
    [0, 150, 0, 255], // class 10 is green
    [255, 255, 255, 255], // class 11 is white
    [255, 105, 180, 255], // class 12 is pink
    [255, 150, 0, 255], // class 13 is orange
    [255, 250, 224, 255], // class 14 is light yellow
    [148, 0, 211, 255], // class 15 is dark violet
    [0, 100, 0, 255], // class 16 is dark green
    [0, 0, 128, 255], // class 17 is navy blue
    [165, 42, 42, 255], // class 18 is brown
    [64, 224, 208, 255], // class 19 is turquoise
    [255, 218, 185, 255], // class 20 is peach
    [192, 192, 192, 255], // class 21 is silver
];
/**
 * This will be merged with user supplied options.
 */
const DEFAULT_OPTIONS = {
    color: 'white',
    lineWidth: 4,
    radius: 6
};
/** Merges the user's options with the default options. */
function addDefaultOptions(style) {
    style = style || {};
    return {
        ...DEFAULT_OPTIONS,
        ...{ fillColor: style.color },
        ...style,
    };
}
/**
 * Resolve the value from `value`. Invokes `value` with `data` if it is a
 * function.
 */
function resolve(value, data) {
    return value instanceof Function ? value(data) : value;
}
/** Helper class to visualize the result of a MediaPipe Vision task. */
class DrawingUtils$1 {
    constructor(cpuOrGpuGontext, gpuContext) {
        if (cpuOrGpuGontext instanceof CanvasRenderingContext2D ||
            cpuOrGpuGontext instanceof OffscreenCanvasRenderingContext2D) {
            this.context2d = cpuOrGpuGontext;
            this.contextWebGL = gpuContext;
        }
        else {
            this.contextWebGL = cpuOrGpuGontext;
        }
    }
    /**
     * Restricts a number between two endpoints (order doesn't matter).
     *
     * @export
     * @param x The number to clamp.
     * @param x0 The first boundary.
     * @param x1 The second boundary.
     * @return The clamped value.
     */
    static clamp(x, x0, x1) {
        const lo = Math.min(x0, x1);
        const hi = Math.max(x0, x1);
        return Math.max(lo, Math.min(hi, x));
    }
    /**
     * Linearly interpolates a value between two points, clamping that value to
     * the endpoints.
     *
     * @export
     * @param x The number to interpolate.
     * @param x0 The x coordinate of the start value.
     * @param x1 The x coordinate of the end value.
     * @param y0 The y coordinate of the start value.
     * @param y1 The y coordinate of the end value.
     * @return The interpolated value.
     */
    static lerp(x, x0, x1, y0, y1) {
        const out = y0 * (1 - (x - x0) / (x1 - x0)) + y1 * (1 - (x1 - x) / (x1 - x0));
        return DrawingUtils$1.clamp(out, y0, y1);
    }
    getCanvasRenderingContext() {
        if (!this.context2d) {
            throw new Error('CPU rendering requested but CanvasRenderingContext2D not provided.');
        }
        return this.context2d;
    }
    getWebGLRenderingContext() {
        if (!this.contextWebGL) {
            throw new Error('GPU rendering requested but WebGL2RenderingContext not provided.');
        }
        return this.contextWebGL;
    }
    getCategoryMaskShaderContext() {
        if (!this.categoryMaskShaderContext) {
            this.categoryMaskShaderContext = new drawing_utils_category_mask_1.CategoryMaskShaderContext();
        }
        return this.categoryMaskShaderContext;
    }
    getConfidenceMaskShaderContext() {
        if (!this.confidenceMaskShaderContext) {
            this.confidenceMaskShaderContext = new drawing_utils_confidence_mask_1.ConfidenceMaskShaderContext();
        }
        return this.confidenceMaskShaderContext;
    }
    /**
     * Draws circles onto the provided landmarks.
     *
     * This method can only be used when `DrawingUtils` is initialized with a
     * `CanvasRenderingContext2D`.
     *
     * @export
     * @param landmarks The landmarks to draw.
     * @param style The style to visualize the landmarks.
     */
    drawLandmarks(landmarks, style) {
        if (!landmarks) {
            return;
        }
        const ctx = this.getCanvasRenderingContext();
        const options = addDefaultOptions(style);
        ctx.save();
        const canvas = ctx.canvas;
        let index = 0;
        for (const landmark of landmarks) {
            // All of our points are normalized, so we need to scale the unit canvas
            // to match our actual canvas size.
            ctx.fillStyle = resolve(options.fillColor, { index, from: landmark });
            ctx.strokeStyle = resolve(options.color, { index, from: landmark });
            ctx.lineWidth = resolve(options.lineWidth, { index, from: landmark });
            const circle = new Path2D();
            // Decrease the size of the arc to compensate for the scale()
            circle.arc(landmark.x * canvas.width, landmark.y * canvas.height, resolve(options.radius, { index, from: landmark }), 0, 2 * Math.PI);
            ctx.fill(circle);
            ctx.stroke(circle);
            ++index;
        }
        ctx.restore();
    }
    /**
     * Draws lines between landmarks (given a connection graph).
     *
     * This method can only be used when `DrawingUtils` is initialized with a
     * `CanvasRenderingContext2D`.
     *
     * @export
     * @param landmarks The landmarks to draw.
     * @param connections The connections array that contains the start and the
     *     end indices for the connections to draw.
     * @param style The style to visualize the landmarks.
     */
    drawConnectors(landmarks, connections, style) {
        if (!landmarks || !connections) {
            return;
        }
        const ctx = this.getCanvasRenderingContext();
        const options = addDefaultOptions(style);
        ctx.save();
        const canvas = ctx.canvas;
        let index = 0;
        for (const connection of connections) {
            ctx.beginPath();
            const from = landmarks[connection.start];
            const to = landmarks[connection.end];
            if (from && to) {
                ctx.strokeStyle = resolve(options.color, { index, from, to });
                ctx.lineWidth = resolve(options.lineWidth, { index, from, to });
                ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
                ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
            }
            ++index;
            ctx.stroke();
        }
        ctx.restore();
    }
    /**
     * Draws a bounding box.
     *
     * This method can only be used when `DrawingUtils` is initialized with a
     * `CanvasRenderingContext2D`.
     *
     * @export
     * @param boundingBox The bounding box to draw.
     * @param style The style to visualize the boundin box.
     */
    drawBoundingBox(boundingBox, style) {
        const ctx = this.getCanvasRenderingContext();
        const options = addDefaultOptions(style);
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = resolve(options.lineWidth, {});
        ctx.strokeStyle = resolve(options.color, {});
        ctx.fillStyle = resolve(options.fillColor, {});
        ctx.moveTo(boundingBox.originX, boundingBox.originY);
        ctx.lineTo(boundingBox.originX + boundingBox.width, boundingBox.originY);
        ctx.lineTo(boundingBox.originX + boundingBox.width, boundingBox.originY + boundingBox.height);
        ctx.lineTo(boundingBox.originX, boundingBox.originY + boundingBox.height);
        ctx.lineTo(boundingBox.originX, boundingBox.originY);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
    /** Draws a category mask on a CanvasRenderingContext2D. */
    drawCategoryMask2D(mask, background, categoryToColorMap) {
        // Use the WebGL renderer to draw result on our internal canvas.
        const gl = this.getWebGLRenderingContext();
        this.runWithWebGLTexture(mask, texture => {
            this.drawCategoryMaskWebGL(texture, background, categoryToColorMap);
            // Draw the result on the user canvas.
            const ctx = this.getCanvasRenderingContext();
            ctx.drawImage(gl.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
        });
    }
    /** Draws a category mask on a WebGL2RenderingContext2D. */
    drawCategoryMaskWebGL(categoryTexture, background, categoryToColorMap) {
        const shaderContext = this.getCategoryMaskShaderContext();
        const gl = this.getWebGLRenderingContext();
        const backgroundImage = Array.isArray(background) ?
            new ImageData(new Uint8ClampedArray(background), 1, 1) :
            background;
        shaderContext.run(gl, /* flipTexturesVertically= */ true, () => {
            shaderContext.bindAndUploadTextures(categoryTexture, backgroundImage, categoryToColorMap);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            shaderContext.unbindTextures();
        });
    }
    /** @export */
    drawCategoryMask(mask, categoryToColorMap, background = [0, 0, 0, 255]) {
        if (this.context2d) {
            this.drawCategoryMask2D(mask, background, categoryToColorMap);
        }
        else {
            this.drawCategoryMaskWebGL(mask.getAsWebGLTexture(), background, categoryToColorMap);
        }
    }
    /**
     * Converts the given mask to a WebGLTexture and runs the callback. Cleans
     * up any new resources after the callback finished executing.
     */
    runWithWebGLTexture(mask, callback) {
        if (!mask.hasWebGLTexture()) {
            // Re-create the MPMask but use our the WebGL canvas so we can draw the
            // texture directly.
            const data = mask.hasFloat32Array() ? mask.getAsFloat32Array() :
                mask.getAsUint8Array();
            this.convertToWebGLTextureShaderContext =
                this.convertToWebGLTextureShaderContext ?? new image_shader_context_1$2.MPImageShaderContext();
            const gl = this.getWebGLRenderingContext();
            const convertedMask = new mask_1$2.MPMask([data], mask.interpolateValues, 
            /* ownsWebGlTexture= */ false, gl.canvas, this.convertToWebGLTextureShaderContext, mask.width, mask.height);
            callback(convertedMask.getAsWebGLTexture());
            convertedMask.close();
        }
        else {
            callback(mask.getAsWebGLTexture());
        }
    }
    /** Draws a confidence mask on a WebGL2RenderingContext2D. */
    drawConfidenceMaskWebGL(maskTexture, defaultTexture, overlayTexture) {
        const gl = this.getWebGLRenderingContext();
        const shaderContext = this.getConfidenceMaskShaderContext();
        const defaultImage = Array.isArray(defaultTexture) ?
            new ImageData(new Uint8ClampedArray(defaultTexture), 1, 1) :
            defaultTexture;
        const overlayImage = Array.isArray(overlayTexture) ?
            new ImageData(new Uint8ClampedArray(overlayTexture), 1, 1) :
            overlayTexture;
        shaderContext.run(gl, /* flipTexturesVertically= */ true, () => {
            shaderContext.bindAndUploadTextures(defaultImage, overlayImage, maskTexture);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
            gl.bindTexture(gl.TEXTURE_2D, null);
            shaderContext.unbindTextures();
        });
    }
    /** Draws a confidence mask on a CanvasRenderingContext2D. */
    drawConfidenceMask2D(mask, defaultTexture, overlayTexture) {
        // Use the WebGL renderer to draw result on our internal canvas.
        const gl = this.getWebGLRenderingContext();
        this.runWithWebGLTexture(mask, texture => {
            this.drawConfidenceMaskWebGL(texture, defaultTexture, overlayTexture);
            // Draw the result on the user canvas.
            const ctx = this.getCanvasRenderingContext();
            ctx.drawImage(gl.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
        });
    }
    /**
     * Blends two images using the provided confidence mask.
     *
     * If you are using an `ImageData` or `HTMLImageElement` as your data source
     * and drawing the result onto a `WebGL2RenderingContext`, this method uploads
     * the image data to the GPU. For still image input that gets re-used every
     * frame, you can reduce the cost of re-uploading these images by passing a
     * `HTMLCanvasElement` instead.
     *
     * @export
     * @param mask A confidence mask that was returned from a segmentation task.
     * @param defaultTexture An image or a four-channel color that will be used
     *     when confidence values are low.
     * @param overlayTexture An image or four-channel color that will be used when
     *     confidence values are high.
     */
    drawConfidenceMask(mask, defaultTexture, overlayTexture) {
        if (this.context2d) {
            this.drawConfidenceMask2D(mask, defaultTexture, overlayTexture);
        }
        else {
            this.drawConfidenceMaskWebGL(mask.getAsWebGLTexture(), defaultTexture, overlayTexture);
        }
    }
    /**
     * Frees all WebGL resources held by this class.
     * @export
     */
    close() {
        this.categoryMaskShaderContext?.close();
        this.categoryMaskShaderContext = undefined;
        this.confidenceMaskShaderContext?.close();
        this.confidenceMaskShaderContext = undefined;
        this.convertToWebGLTextureShaderContext?.close();
        this.convertToWebGLTextureShaderContext = undefined;
    }
}
drawing_utils.DrawingUtils = DrawingUtils$1;

var image = {};

/**
 * Copyright 2023 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(image, "__esModule", { value: true });
image.MPImage = void 0;
const image_shader_context_1$1 = image_shader_context;
/** Number of instances a user can keep alive before we raise a warning. */
const INSTANCE_COUNT_WARNING_THRESHOLD = 250;
/** The underlying type of the image. */
var MPImageType;
(function (MPImageType) {
    /** Represents the native `ImageData` type. */
    MPImageType[MPImageType["IMAGE_DATA"] = 0] = "IMAGE_DATA";
    /** Represents the native `ImageBitmap` type. */
    MPImageType[MPImageType["IMAGE_BITMAP"] = 1] = "IMAGE_BITMAP";
    /** Represents the native `WebGLTexture` type. */
    MPImageType[MPImageType["WEBGL_TEXTURE"] = 2] = "WEBGL_TEXTURE";
})(MPImageType || (MPImageType = {}));
/**
 * The wrapper class for MediaPipe Image objects.
 *
 * Images are stored as `ImageData`, `ImageBitmap` or `WebGLTexture` objects.
 * You can convert the underlying type to any other type by passing the
 * desired type to `getAs...()`. As type conversions can be expensive, it is
 * recommended to limit these conversions. You can verify what underlying
 * types are already available by invoking `has...()`.
 *
 * Images that are returned from a MediaPipe Tasks are owned by by the
 * underlying C++ Task. If you need to extend the lifetime of these objects,
 * you can invoke the `clone()` method. To free up the resources obtained
 * during any clone or type conversion operation, it is important to invoke
 * `close()` on the `MPImage` instance.
 *
 * Converting to and from ImageBitmap requires that the MediaPipe task is
 * initialized with an `OffscreenCanvas`. As we require WebGL2 support, this
 * places some limitations on Browser support as outlined here:
 * https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/getContext
 */
class MPImage$1 {
    /** @hideconstructor */
    constructor(containers, ownsImageBitmap, ownsWebGLTexture, 
    /** Returns the canvas element that the image is bound to. */
    canvas, shaderContext, 
    /** Returns the width of the image. */
    width, 
    /** Returns the height of the image. */
    height) {
        this.containers = containers;
        this.ownsImageBitmap = ownsImageBitmap;
        this.ownsWebGLTexture = ownsWebGLTexture;
        this.canvas = canvas;
        this.shaderContext = shaderContext;
        this.width = width;
        this.height = height;
        if (this.ownsImageBitmap || this.ownsWebGLTexture) {
            --MPImage$1.instancesBeforeWarning;
            if (MPImage$1.instancesBeforeWarning === 0) {
                console.error('You seem to be creating MPImage instances without invoking ' +
                    '.close(). This leaks resources.');
            }
        }
    }
    /**
     * Returns whether this `MPImage` contains a mask of type `ImageData`.
     * @export
     */
    hasImageData() {
        return !!this.getContainer(MPImageType.IMAGE_DATA);
    }
    /**
     * Returns whether this `MPImage` contains a mask of type `ImageBitmap`.
     * @export
     */
    hasImageBitmap() {
        return !!this.getContainer(MPImageType.IMAGE_BITMAP);
    }
    /**
     * Returns whether this `MPImage` contains a mask of type `WebGLTexture`.
     * @export
     */
    hasWebGLTexture() {
        return !!this.getContainer(MPImageType.WEBGL_TEXTURE);
    }
    /**
     * Returns the underlying image as an `ImageData` object. Note that this
     * involves an expensive GPU to CPU transfer if the current image is only
     * available as an `ImageBitmap` or `WebGLTexture`.
     *
     * @export
     * @return The current image as an ImageData object.
     */
    getAsImageData() {
        return this.convertToImageData();
    }
    /**
     * Returns the underlying image as an `ImageBitmap`. Note that
     * conversions to `ImageBitmap` are expensive, especially if the data
     * currently resides on CPU.
     *
     * Processing with `ImageBitmap`s requires that the MediaPipe Task was
     * initialized with an `OffscreenCanvas` with WebGL2 support. See
     * https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/getContext
     * for a list of supported platforms.
     *
     * @export
     * @return The current image as an ImageBitmap object.
     */
    getAsImageBitmap() {
        return this.convertToImageBitmap();
    }
    /**
     * Returns the underlying image as a `WebGLTexture` object. Note that this
     * involves a CPU to GPU transfer if the current image is only available as
     * an `ImageData` object. The returned texture is bound to the current
     * canvas (see `.canvas`).
     *
     * @export
     * @return The current image as a WebGLTexture.
     */
    getAsWebGLTexture() {
        return this.convertToWebGLTexture();
    }
    /** Returns the container for the requested storage type iff it exists. */
    getContainer(type) {
        switch (type) {
            case MPImageType.IMAGE_DATA:
                return this.containers.find(img => img instanceof ImageData);
            case MPImageType.IMAGE_BITMAP:
                return this.containers.find(img => typeof ImageBitmap !== 'undefined' &&
                    img instanceof ImageBitmap);
            case MPImageType.WEBGL_TEXTURE:
                return this.containers.find(img => typeof WebGLTexture !== 'undefined' &&
                    img instanceof WebGLTexture);
            default:
                throw new Error(`Type is not supported: ${type}`);
        }
    }
    /**
     * Creates a copy of the resources stored in this `MPImage`. You can invoke
     * this method to extend the lifetime of an image returned by a MediaPipe
     * Task. Note that performance critical applications should aim to only use
     * the `MPImage` within the MediaPipe Task callback so that copies can be
     * avoided.
     *
     * @export
     */
    clone() {
        const destinationContainers = [];
        // TODO: We might only want to clone one backing datastructure
        // even if multiple are defined;
        for (const container of this.containers) {
            let destinationContainer;
            if (container instanceof ImageData) {
                destinationContainer =
                    new ImageData(container.data, this.width, this.height);
            }
            else if (container instanceof WebGLTexture) {
                const gl = this.getGL();
                const shaderContext = this.getShaderContext();
                // Create a new texture and use it to back a framebuffer
                gl.activeTexture(gl.TEXTURE1);
                destinationContainer = shaderContext.createTexture(gl);
                gl.bindTexture(gl.TEXTURE_2D, destinationContainer);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                gl.bindTexture(gl.TEXTURE_2D, null);
                shaderContext.bindFramebuffer(gl, destinationContainer);
                shaderContext.run(gl, /* flipVertically= */ false, () => {
                    this.bindTexture(); // This activates gl.TEXTURE0
                    gl.clearColor(0, 0, 0, 0);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
                    this.unbindTexture();
                });
                shaderContext.unbindFramebuffer();
                this.unbindTexture();
            }
            else if (container instanceof ImageBitmap) {
                this.convertToWebGLTexture();
                this.bindTexture();
                destinationContainer = this.copyTextureToBitmap();
                this.unbindTexture();
            }
            else {
                throw new Error(`Type is not supported: ${container}`);
            }
            destinationContainers.push(destinationContainer);
        }
        return new MPImage$1(destinationContainers, this.hasImageBitmap(), this.hasWebGLTexture(), this.canvas, this.shaderContext, this.width, this.height);
    }
    getOffscreenCanvas() {
        if (!(this.canvas instanceof OffscreenCanvas)) {
            throw new Error('Conversion to ImageBitmap requires that the MediaPipe Tasks is ' +
                'initialized with an OffscreenCanvas');
        }
        return this.canvas;
    }
    getGL() {
        if (!this.canvas) {
            throw new Error('Conversion to different image formats require that a canvas ' +
                'is passed when iniitializing the image.');
        }
        if (!this.gl) {
            this.gl = (0, image_shader_context_1$1.assertExists)(this.canvas.getContext('webgl2'), 'You cannot use a canvas that is already bound to a different ' +
                'type of rendering context.');
        }
        return this.gl;
    }
    getShaderContext() {
        if (!this.shaderContext) {
            this.shaderContext = new image_shader_context_1$1.MPImageShaderContext();
        }
        return this.shaderContext;
    }
    convertToImageBitmap() {
        let imageBitmap = this.getContainer(MPImageType.IMAGE_BITMAP);
        if (!imageBitmap) {
            this.convertToWebGLTexture();
            imageBitmap = this.convertWebGLTextureToImageBitmap();
            this.containers.push(imageBitmap);
            this.ownsImageBitmap = true;
        }
        return imageBitmap;
    }
    convertToImageData() {
        let imageData = this.getContainer(MPImageType.IMAGE_DATA);
        if (!imageData) {
            const gl = this.getGL();
            const shaderContext = this.getShaderContext();
            const pixels = new Uint8Array(this.width * this.height * 4);
            // Create texture if needed
            const webGlTexture = this.convertToWebGLTexture();
            // Create a framebuffer from the texture and read back pixels
            shaderContext.bindFramebuffer(gl, webGlTexture);
            gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            shaderContext.unbindFramebuffer();
            imageData = new ImageData(new Uint8ClampedArray(pixels.buffer), this.width, this.height);
            this.containers.push(imageData);
        }
        return imageData;
    }
    convertToWebGLTexture() {
        let webGLTexture = this.getContainer(MPImageType.WEBGL_TEXTURE);
        if (!webGLTexture) {
            const gl = this.getGL();
            webGLTexture = this.bindTexture();
            const source = this.getContainer(MPImageType.IMAGE_BITMAP) ||
                this.convertToImageData();
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
            this.unbindTexture();
        }
        return webGLTexture;
    }
    /**
     * Binds the backing texture to the canvas. If the texture does not yet
     * exist, creates it first.
     */
    bindTexture() {
        const gl = this.getGL();
        gl.viewport(0, 0, this.width, this.height);
        gl.activeTexture(gl.TEXTURE0);
        let webGLTexture = this.getContainer(MPImageType.WEBGL_TEXTURE);
        if (!webGLTexture) {
            const shaderContext = this.getShaderContext();
            webGLTexture = shaderContext.createTexture(gl);
            this.containers.push(webGLTexture);
            this.ownsWebGLTexture = true;
        }
        gl.bindTexture(gl.TEXTURE_2D, webGLTexture);
        return webGLTexture;
    }
    unbindTexture() {
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }
    /**
     * Invokes a shader to render the current texture and return it as an
     * ImageBitmap
     */
    copyTextureToBitmap() {
        const gl = this.getGL();
        const shaderContext = this.getShaderContext();
        return shaderContext.run(gl, /* flipVertically= */ true, () => {
            return this.runWithResizedCanvas(() => {
                // Unbind any framebuffer that may be bound since
                // `transferToImageBitmap()` requires rendering into the display (null)
                // framebuffer.
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
                return this.getOffscreenCanvas().transferToImageBitmap();
            });
        });
    }
    convertWebGLTextureToImageBitmap() {
        this.bindTexture();
        const result = this.copyTextureToBitmap();
        this.unbindTexture();
        return result;
    }
    /**
     * Temporarily resizes the underlying canvas to match the dimensions of the
     * image. Runs the provided callback on the resized canvas.
     *
     * Note that while resizing is an expensive operation, it allows us to use
     * the synchronous `transferToImageBitmap()` API.
     */
    runWithResizedCanvas(callback) {
        const canvas = this.canvas;
        if (canvas.width === this.width && canvas.height === this.height) {
            return callback();
        }
        const originalWidth = canvas.width;
        const originalHeight = canvas.height;
        canvas.width = this.width;
        canvas.height = this.height;
        const result = callback();
        canvas.width = originalWidth;
        canvas.height = originalHeight;
        return result;
    }
    /**
     * Frees up any resources owned by this `MPImage` instance.
     *
     * Note that this method does not free images that are owned by the C++
     * Task, as these are freed automatically once you leave the MediaPipe
     * callback. Additionally, some shared state is freed only once you invoke the
     * Task's `close()` method.
     *
     * @export
     */
    close() {
        if (this.ownsImageBitmap) {
            this.getContainer(MPImageType.IMAGE_BITMAP).close();
        }
        if (this.ownsWebGLTexture) {
            const gl = this.getGL();
            gl.deleteTexture(this.getContainer(MPImageType.WEBGL_TEXTURE));
        }
        // User called close(). We no longer issue warning.
        MPImage$1.instancesBeforeWarning = -1;
    }
}
image.MPImage = MPImage$1;
/**
 * A counter to track the number of instances of MPImage that own resources..
 * This is used to raise a warning if the user does not close the instances.
 */
MPImage$1.instancesBeforeWarning = INSTANCE_COUNT_WARNING_THRESHOLD;

var image_segmenter = {};

var calculator_pb = {};

var googleProtobuf = {};

/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/

(function (exports) {
	var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.findInternal=function(a,b,c){a instanceof String&&(a=String(a));for(var d=a.length,e=0;e<d;e++){var f=a[e];if(b.call(c,f,e,a))return {i:e,v:f}}return {i:-1,v:void 0}};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;
	$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value);};$jscomp.getGlobal=function(a){return "undefined"!=typeof window&&window===a?a:"undefined"!=typeof commonjsGlobal&&null!=commonjsGlobal?commonjsGlobal:a};$jscomp.global=$jscomp.getGlobal(commonjsGlobal);
	$jscomp.polyfill=function(a,b,c,d){if(b){c=$jscomp.global;a=a.split(".");for(d=0;d<a.length-1;d++){var e=a[d];e in c||(c[e]={});c=c[e];}a=a[a.length-1];d=c[a];b=b(d);b!=d&&null!=b&&$jscomp.defineProperty(c,a,{configurable:!0,writable:!0,value:b});}};$jscomp.polyfill("Array.prototype.findIndex",function(a){return a?a:function(a,c){return $jscomp.findInternal(this,a,c).i}},"es6","es3");
	$jscomp.checkStringArgs=function(a,b,c){if(null==a)throw new TypeError("The 'this' value for String.prototype."+c+" must not be null or undefined");if(b instanceof RegExp)throw new TypeError("First argument to String.prototype."+c+" must not be a regular expression");return a+""};
	$jscomp.polyfill("String.prototype.endsWith",function(a){return a?a:function(a,c){var b=$jscomp.checkStringArgs(this,a,"endsWith");a+="";void 0===c&&(c=b.length);c=Math.max(0,Math.min(c|0,b.length));for(var e=a.length;0<e&&0<c;)if(b[--c]!=a[--e])return !1;return 0>=e}},"es6","es3");$jscomp.polyfill("Array.prototype.find",function(a){return a?a:function(a,c){return $jscomp.findInternal(this,a,c).v}},"es6","es3");
	$jscomp.polyfill("String.prototype.startsWith",function(a){return a?a:function(a,c){var b=$jscomp.checkStringArgs(this,a,"startsWith");a+="";var e=b.length,f=a.length;c=Math.max(0,Math.min(c|0,b.length));for(var g=0;g<f&&c<e;)if(b[c++]!=a[g++])return !1;return g>=f}},"es6","es3");
	$jscomp.polyfill("String.prototype.repeat",function(a){return a?a:function(a){var b=$jscomp.checkStringArgs(this,null,"repeat");if(0>a||1342177279<a)throw new RangeError("Invalid count value");a|=0;for(var d="";a;)if(a&1&&(d+=b),a>>>=1)b+=b;return d}},"es6","es3");var COMPILED=!0,goog=goog||{};goog.global=commonjsGlobal||self;
	goog.exportPath_=function(a,b,c){a=a.split(".");c=c||goog.global;a[0]in c||"undefined"==typeof c.execScript||c.execScript("var "+a[0]);for(var d;a.length&&(d=a.shift());)a.length||void 0===b?c=c[d]&&c[d]!==Object.prototype[d]?c[d]:c[d]={}:c[d]=b;};
	goog.define=function(a,b){return b};goog.FEATURESET_YEAR=2012;goog.DEBUG=!0;goog.LOCALE="en";goog.TRUSTED_SITE=!0;goog.STRICT_MODE_COMPATIBLE=!1;goog.DISALLOW_TEST_ONLY_CODE=!goog.DEBUG;goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING=!1;
	goog.provide=function(a){if(goog.isInModuleLoader_())throw Error("goog.provide cannot be used within a module.");goog.constructNamespace_(a);};goog.constructNamespace_=function(a,b){goog.exportPath_(a,b);};
	goog.getScriptNonce=function(a){if(a&&a!=goog.global)return goog.getScriptNonce_(a.document);null===goog.cspNonce_&&(goog.cspNonce_=goog.getScriptNonce_(goog.global.document));return goog.cspNonce_};goog.NONCE_PATTERN_=/^[\w+/_-]+[=]{0,2}$/;goog.cspNonce_=null;goog.getScriptNonce_=function(a){return (a=a.querySelector&&a.querySelector("script[nonce]"))&&(a=a.nonce||a.getAttribute("nonce"))&&goog.NONCE_PATTERN_.test(a)?a:""};goog.VALID_MODULE_RE_=/^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
	goog.module=function(a){if("string"!==typeof a||!a||-1==a.search(goog.VALID_MODULE_RE_))throw Error("Invalid module identifier");if(!goog.isInGoogModuleLoader_())throw Error("Module "+a+" has been loaded incorrectly. Note, modules cannot be loaded as normal scripts. They require some kind of pre-processing step. You're likely trying to load a module via a script tag or as a part of a concatenated bundle without rewriting the module. For more info see: https://github.com/google/closure-library/wiki/goog.module:-an-ES6-module-like-alternative-to-goog.provide.");
	if(goog.moduleLoaderState_.moduleName)throw Error("goog.module may only be called once per module.");goog.moduleLoaderState_.moduleName=a;};goog.module.get=function(a){return goog.module.getInternal_(a)};
	goog.module.getInternal_=function(a){return null};goog.ModuleType={ES6:"es6",GOOG:"goog"};goog.moduleLoaderState_=null;goog.isInModuleLoader_=function(){return goog.isInGoogModuleLoader_()||goog.isInEs6ModuleLoader_()};goog.isInGoogModuleLoader_=function(){return !!goog.moduleLoaderState_&&goog.moduleLoaderState_.type==goog.ModuleType.GOOG};
	goog.isInEs6ModuleLoader_=function(){if(goog.moduleLoaderState_&&goog.moduleLoaderState_.type==goog.ModuleType.ES6)return !0;var a=goog.global.$jscomp;return a?"function"!=typeof a.getCurrentModulePath?!1:!!a.getCurrentModulePath():!1};
	goog.module.declareLegacyNamespace=function(){goog.moduleLoaderState_.declareLegacyNamespace=!0;};
	goog.declareModuleId=function(a){if(goog.moduleLoaderState_)goog.moduleLoaderState_.moduleName=a;else {var b=goog.global.$jscomp;if(!b||"function"!=typeof b.getCurrentModulePath)throw Error('Module with namespace "'+
	a+'" has been loaded incorrectly.');b=b.require(b.getCurrentModulePath());goog.loadedModules_[a]={exports:b,type:goog.ModuleType.ES6,moduleId:a};}};goog.setTestOnly=function(a){if(goog.DISALLOW_TEST_ONLY_CODE)throw a=a||"",Error("Importing test-only code into non-debug environment"+(a?": "+a:"."));};goog.forwardDeclare=function(a){};	goog.getObjectByName=function(a,b){a=a.split(".");b=b||goog.global;for(var c=0;c<a.length;c++)if(b=b[a[c]],null==b)return null;return b};goog.globalize=function(a,b){b=b||goog.global;for(var c in a)b[c]=a[c];};goog.addDependency=function(a,b,c,d){};goog.ENABLE_DEBUG_LOADER=!0;goog.logToConsole_=function(a){goog.global.console&&goog.global.console.error(a);};
	goog.require=function(a){};goog.requireType=function(a){return {}};goog.basePath="";goog.nullFunction=function(){};
	goog.abstractMethod=function(){throw Error("unimplemented abstract method");};goog.addSingletonGetter=function(a){a.instance_=void 0;a.getInstance=function(){if(a.instance_)return a.instance_;goog.DEBUG&&(goog.instantiatedSingletons_[goog.instantiatedSingletons_.length]=a);return a.instance_=new a};};goog.instantiatedSingletons_=[];goog.LOAD_MODULE_USING_EVAL=!0;goog.SEAL_MODULE_EXPORTS=goog.DEBUG;goog.loadedModules_={};goog.DEPENDENCIES_ENABLED=!COMPILED;goog.TRANSPILE="detect";
	goog.ASSUME_ES_MODULES_TRANSPILED=!1;goog.TRANSPILE_TO_LANGUAGE="";goog.TRANSPILER="transpile.js";goog.hasBadLetScoping=null;goog.useSafari10Workaround=function(){if(null==goog.hasBadLetScoping){try{var a=!eval('"use strict";let x = 1; function f() { return typeof x; };f() == "number";');}catch(b){a=!1;}goog.hasBadLetScoping=a;}return goog.hasBadLetScoping};goog.workaroundSafari10EvalBug=function(a){return "(function(){"+a+"\n;})();\n"};
	goog.loadModule=function(a){var b=goog.moduleLoaderState_;try{goog.moduleLoaderState_={moduleName:"",declareLegacyNamespace:!1,type:goog.ModuleType.GOOG};if(goog.isFunction(a))var c=a.call(void 0,{});else if("string"===typeof a)goog.useSafari10Workaround()&&(a=goog.workaroundSafari10EvalBug(a)),c=goog.loadModuleFromSource_.call(void 0,a);else throw Error("Invalid module definition");var d=goog.moduleLoaderState_.moduleName;if("string"===typeof d&&d)goog.moduleLoaderState_.declareLegacyNamespace?goog.constructNamespace_(d,
	c):goog.SEAL_MODULE_EXPORTS&&Object.seal&&"object"==typeof c&&null!=c&&Object.seal(c),goog.loadedModules_[d]={exports:c,type:goog.ModuleType.GOOG,moduleId:goog.moduleLoaderState_.moduleName};else throw Error('Invalid module name "'+d+'"');}finally{goog.moduleLoaderState_=b;}};goog.loadModuleFromSource_=function(a){eval(a);return {}};goog.normalizePath_=function(a){a=a.split("/");for(var b=0;b<a.length;)"."==a[b]?a.splice(b,1):b&&".."==a[b]&&a[b-1]&&".."!=a[b-1]?a.splice(--b,2):b++;return a.join("/")};
	goog.loadFileSync_=function(a){if(goog.global.CLOSURE_LOAD_FILE_SYNC)return goog.global.CLOSURE_LOAD_FILE_SYNC(a);try{var b=new goog.global.XMLHttpRequest;b.open("get",a,!1);b.send();return 0==b.status||200==b.status?b.responseText:null}catch(c){return null}};
	goog.transpile_=function(a,b,c){var d=goog.global.$jscomp;d||(goog.global.$jscomp=d={});var e=d.transpile;if(!e){var f=goog.basePath+goog.TRANSPILER,g=goog.loadFileSync_(f);if(g){(function(){(0, eval)(g+"\n//# sourceURL="+f);}).call(goog.global);if(goog.global.$gwtExport&&goog.global.$gwtExport.$jscomp&&!goog.global.$gwtExport.$jscomp.transpile)throw Error('The transpiler did not properly export the "transpile" method. $gwtExport: '+JSON.stringify(goog.global.$gwtExport));goog.global.$jscomp.transpile=
	goog.global.$gwtExport.$jscomp.transpile;d=goog.global.$jscomp;e=d.transpile;}}e||(e=d.transpile=function(a,b){goog.logToConsole_(b+" requires transpilation but no transpiler was found.");return a});return e(a,b,c)};
	goog.typeOf=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return "array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return "object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return "array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return "function"}else return "null";
	else if("function"==b&&"undefined"==typeof a.call)return "object";return b};goog.isArray=function(a){return "array"==goog.typeOf(a)};goog.isArrayLike=function(a){var b=goog.typeOf(a);return "array"==b||"object"==b&&"number"==typeof a.length};goog.isDateLike=function(a){return goog.isObject(a)&&"function"==typeof a.getFullYear};goog.isFunction=function(a){return "function"==goog.typeOf(a)};goog.isObject=function(a){var b=typeof a;return "object"==b&&null!=a||"function"==b};
	goog.getUid=function(a){return Object.prototype.hasOwnProperty.call(a,goog.UID_PROPERTY_)&&a[goog.UID_PROPERTY_]||(a[goog.UID_PROPERTY_]=++goog.uidCounter_)};goog.hasUid=function(a){return !!a[goog.UID_PROPERTY_]};goog.removeUid=function(a){null!==a&&"removeAttribute"in a&&a.removeAttribute(goog.UID_PROPERTY_);try{delete a[goog.UID_PROPERTY_];}catch(b){}};goog.UID_PROPERTY_="closure_uid_"+(1E9*Math.random()>>>0);goog.uidCounter_=0;goog.getHashCode=goog.getUid;goog.removeHashCode=goog.removeUid;
	goog.cloneObject=function(a){var b=goog.typeOf(a);if("object"==b||"array"==b){if("function"===typeof a.clone)return a.clone();b="array"==b?[]:{};for(var c in a)b[c]=goog.cloneObject(a[c]);return b}return a};goog.bindNative_=function(a,b,c){return a.call.apply(a.bind,arguments)};
	goog.bindJs_=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}};goog.bind=function(a,b,c){Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?goog.bind=goog.bindNative_:goog.bind=goog.bindJs_;return goog.bind.apply(null,arguments)};
	goog.partial=function(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}};goog.mixin=function(a,b){for(var c in b)a[c]=b[c];};goog.now=goog.TRUSTED_SITE&&Date.now||function(){return +new Date};
	goog.globalEval=function(a){if(goog.global.execScript)goog.global.execScript(a,"JavaScript");else if(goog.global.eval){if(null==goog.evalWorksForGlobals_){try{goog.global.eval("var _evalTest_ = 1;");}catch(d){}if("undefined"!=typeof goog.global._evalTest_){try{delete goog.global._evalTest_;}catch(d){}goog.evalWorksForGlobals_=!0;}else goog.evalWorksForGlobals_=!1;}if(goog.evalWorksForGlobals_)goog.global.eval(a);else {var b=goog.global.document,c=b.createElement("script");c.type="text/javascript";c.defer=
	!1;c.appendChild(b.createTextNode(a));b.head.appendChild(c);b.head.removeChild(c);}}else throw Error("goog.globalEval not available");};goog.evalWorksForGlobals_=null;
	goog.getCssName=function(a,b){if("."==String(a).charAt(0))throw Error('className passed in goog.getCssName must not start with ".". You passed: '+a);var c=function(a){return goog.cssNameMapping_[a]||a},d=function(a){a=a.split("-");for(var b=[],d=0;d<a.length;d++)b.push(c(a[d]));return b.join("-")};d=goog.cssNameMapping_?"BY_WHOLE"==goog.cssNameMappingStyle_?c:d:function(a){return a};a=b?a+"-"+d(b):d(a);return goog.global.CLOSURE_CSS_NAME_MAP_FN?goog.global.CLOSURE_CSS_NAME_MAP_FN(a):a};
	goog.setCssNameMapping=function(a,b){goog.cssNameMapping_=a;goog.cssNameMappingStyle_=b;};goog.getMsg=function(a,b,c){c&&c.html&&(a=a.replace(/</g,"&lt;"));b&&(a=a.replace(/\{\$([^}]+)}/g,function(a,c){return null!=b&&c in b?b[c]:a}));return a};goog.getMsgWithFallback=function(a,b){return a};goog.exportSymbol=function(a,b,c){goog.exportPath_(a,b,c);};
	goog.exportProperty=function(a,b,c){a[b]=c;};goog.inherits=function(a,b){function c(){}c.prototype=b.prototype;a.superClass_=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.base=function(a,c,f){for(var d=Array(arguments.length-2),e=2;e<arguments.length;e++)d[e-2]=arguments[e];return b.prototype[c].apply(a,d)};};goog.scope=function(a){if(goog.isInModuleLoader_())throw Error("goog.scope is not supported within a module.");a.call(goog.global);};	goog.defineClass=function(a,b){var c=b.constructor,d=b.statics;c&&c!=Object.prototype.constructor||(c=function(){throw Error("cannot instantiate an interface (no constructor defined).");});c=goog.defineClass.createSealingConstructor_(c,a);a&&goog.inherits(c,a);delete b.constructor;delete b.statics;goog.defineClass.applyProperties_(c.prototype,b);null!=d&&(d instanceof Function?d(c):goog.defineClass.applyProperties_(c,d));return c};goog.defineClass.SEAL_CLASS_INSTANCES=goog.DEBUG;
	goog.defineClass.createSealingConstructor_=function(a,b){if(!goog.defineClass.SEAL_CLASS_INSTANCES)return a;var c=!goog.defineClass.isUnsealable_(b),d=function(){var b=a.apply(this,arguments)||this;b[goog.UID_PROPERTY_]=b[goog.UID_PROPERTY_];this.constructor===d&&c&&Object.seal instanceof Function&&Object.seal(b);return b};return d};goog.defineClass.isUnsealable_=function(a){return a&&a.prototype&&a.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]};goog.defineClass.OBJECT_PROTOTYPE_FIELDS_="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
	goog.defineClass.applyProperties_=function(a,b){for(var c in b)Object.prototype.hasOwnProperty.call(b,c)&&(a[c]=b[c]);for(var d=0;d<goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;d++)c=goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[d],Object.prototype.hasOwnProperty.call(b,c)&&(a[c]=b[c]);};goog.tagUnsealableClass=function(a){};goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_="goog_defineClass_legacy_unsealable";
goog.TRUSTED_TYPES_POLICY_NAME="";goog.identity_=function(a){return a};goog.createTrustedTypesPolicy=function(a){var b=null,c=goog.global.trustedTypes||goog.global.TrustedTypes;if(!c||!c.createPolicy)return b;try{b=c.createPolicy(a,{createHTML:goog.identity_,createScript:goog.identity_,createScriptURL:goog.identity_,createURL:goog.identity_});}catch(d){goog.logToConsole_(d.message);}return b};
	goog.TRUSTED_TYPES_POLICY_=goog.TRUSTED_TYPES_POLICY_NAME?goog.createTrustedTypesPolicy(goog.TRUSTED_TYPES_POLICY_NAME+"#base"):null;goog.object={};goog.object.is=function(a,b){return a===b?0!==a||1/a===1/b:a!==a&&b!==b};goog.object.forEach=function(a,b,c){for(var d in a)b.call(c,a[d],d,a);};goog.object.filter=function(a,b,c){var d={},e;for(e in a)b.call(c,a[e],e,a)&&(d[e]=a[e]);return d};goog.object.map=function(a,b,c){var d={},e;for(e in a)d[e]=b.call(c,a[e],e,a);return d};goog.object.some=function(a,b,c){for(var d in a)if(b.call(c,a[d],d,a))return !0;return !1};
	goog.object.every=function(a,b,c){for(var d in a)if(!b.call(c,a[d],d,a))return !1;return !0};goog.object.getCount=function(a){var b=0,c;for(c in a)b++;return b};goog.object.getAnyKey=function(a){for(var b in a)return b};goog.object.getAnyValue=function(a){for(var b in a)return a[b]};goog.object.contains=function(a,b){return goog.object.containsValue(a,b)};goog.object.getValues=function(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b};
	goog.object.getKeys=function(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b};goog.object.getValueByKeys=function(a,b){var c=goog.isArrayLike(b),d=c?b:arguments;for(c=c?0:1;c<d.length;c++){if(null==a)return;a=a[d[c]];}return a};goog.object.containsKey=function(a,b){return null!==a&&b in a};goog.object.containsValue=function(a,b){for(var c in a)if(a[c]==b)return !0;return !1};goog.object.findKey=function(a,b,c){for(var d in a)if(b.call(c,a[d],d,a))return d};
	goog.object.findValue=function(a,b,c){return (b=goog.object.findKey(a,b,c))&&a[b]};goog.object.isEmpty=function(a){for(var b in a)return !1;return !0};goog.object.clear=function(a){for(var b in a)delete a[b];};goog.object.remove=function(a,b){var c;(c=b in a)&&delete a[b];return c};goog.object.add=function(a,b,c){if(null!==a&&b in a)throw Error('The object already contains the key "'+b+'"');goog.object.set(a,b,c);};goog.object.get=function(a,b,c){return null!==a&&b in a?a[b]:c};
	goog.object.set=function(a,b,c){a[b]=c;};goog.object.setIfUndefined=function(a,b,c){return b in a?a[b]:a[b]=c};goog.object.setWithReturnValueIfNotSet=function(a,b,c){if(b in a)return a[b];c=c();return a[b]=c};goog.object.equals=function(a,b){for(var c in a)if(!(c in b)||a[c]!==b[c])return !1;for(var d in b)if(!(d in a))return !1;return !0};goog.object.clone=function(a){var b={},c;for(c in a)b[c]=a[c];return b};
	goog.object.unsafeClone=function(a){var b=goog.typeOf(a);if("object"==b||"array"==b){if(goog.isFunction(a.clone))return a.clone();b="array"==b?[]:{};for(var c in a)b[c]=goog.object.unsafeClone(a[c]);return b}return a};goog.object.transpose=function(a){var b={},c;for(c in a)b[a[c]]=c;return b};goog.object.PROTOTYPE_FIELDS_="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
	goog.object.extend=function(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<goog.object.PROTOTYPE_FIELDS_.length;f++)c=goog.object.PROTOTYPE_FIELDS_[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c]);}};
	goog.object.create=function(a){var b=arguments.length;if(1==b&&Array.isArray(arguments[0]))return goog.object.create.apply(null,arguments[0]);if(b%2)throw Error("Uneven number of arguments");for(var c={},d=0;d<b;d+=2)c[arguments[d]]=arguments[d+1];return c};goog.object.createSet=function(a){var b=arguments.length;if(1==b&&Array.isArray(arguments[0]))return goog.object.createSet.apply(null,arguments[0]);for(var c={},d=0;d<b;d++)c[arguments[d]]=!0;return c};
	goog.object.createImmutableView=function(a){var b=a;Object.isFrozen&&!Object.isFrozen(a)&&(b=Object.create(a),Object.freeze(b));return b};goog.object.isImmutableView=function(a){return !!Object.isFrozen&&Object.isFrozen(a)};
	goog.object.getAllPropertyNames=function(a,b,c){if(!a)return [];if(!Object.getOwnPropertyNames||!Object.getPrototypeOf)return goog.object.getKeys(a);for(var d={};a&&(a!==Object.prototype||b)&&(a!==Function.prototype||c);){for(var e=Object.getOwnPropertyNames(a),f=0;f<e.length;f++)d[e[f]]=!0;a=Object.getPrototypeOf(a);}return goog.object.getKeys(d)};goog.object.getSuperClass=function(a){return (a=Object.getPrototypeOf(a.prototype))&&a.constructor};var jspb={asserts:{}};jspb.asserts.doAssertFailure=function(a,b,c,d){var e="Assertion failed";if(c){e+=": "+c;var f=d;}else a&&(e+=": "+a,f=b);throw Error(""+e,f||[]);};jspb.asserts.assert=function(a,b,c){for(var d=[],e=2;e<arguments.length;++e)d[e-2]=arguments[e];a||jspb.asserts.doAssertFailure("",null,b,d);return a};
	jspb.asserts.assertString=function(a,b,c){for(var d=[],e=2;e<arguments.length;++e)d[e-2]=arguments[e];"string"!==typeof a&&jspb.asserts.doAssertFailure("Expected string but got %s: %s.",[goog.typeOf(a),a],b,d);return a};jspb.asserts.assertArray=function(a,b,c){for(var d=[],e=2;e<arguments.length;++e)d[e-2]=arguments[e];Array.isArray(a)||jspb.asserts.doAssertFailure("Expected array but got %s: %s.",[goog.typeOf(a),a],b,d);return a};
	jspb.asserts.fail=function(a,b){for(var c=[],d=1;d<arguments.length;++d)c[d-1]=arguments[d];throw Error("Failure"+(a?": "+a:""),c);};jspb.asserts.assertInstanceof=function(a,b,c,d){for(var e=[],f=3;f<arguments.length;++f)e[f-3]=arguments[f];a instanceof b||jspb.asserts.doAssertFailure("Expected instanceof %s but got %s.",[jspb.asserts.getType(b),jspb.asserts.getType(a)],c,e);return a};
	jspb.asserts.getType=function(a){return a instanceof Function?a.displayName||a.name||"unknown type name":a instanceof Object?a.constructor.displayName||a.constructor.name||Object.prototype.toString.call(a):null===a?"null":typeof a};jspb.BinaryConstants={};jspb.ConstBinaryMessage=function(){};jspb.BinaryMessage=function(){};jspb.BinaryConstants.FieldType={INVALID:-1,DOUBLE:1,FLOAT:2,INT64:3,UINT64:4,INT32:5,FIXED64:6,FIXED32:7,BOOL:8,STRING:9,GROUP:10,MESSAGE:11,BYTES:12,UINT32:13,ENUM:14,SFIXED32:15,SFIXED64:16,SINT32:17,SINT64:18,FHASH64:30,VHASH64:31};jspb.BinaryConstants.WireType={INVALID:-1,VARINT:0,FIXED64:1,DELIMITED:2,START_GROUP:3,END_GROUP:4,FIXED32:5};
	jspb.BinaryConstants.FieldTypeToWireType=function(a){var b=jspb.BinaryConstants.FieldType,c=jspb.BinaryConstants.WireType;switch(a){case b.INT32:case b.INT64:case b.UINT32:case b.UINT64:case b.SINT32:case b.SINT64:case b.BOOL:case b.ENUM:case b.VHASH64:return c.VARINT;case b.DOUBLE:case b.FIXED64:case b.SFIXED64:case b.FHASH64:return c.FIXED64;case b.STRING:case b.MESSAGE:case b.BYTES:return c.DELIMITED;case b.FLOAT:case b.FIXED32:case b.SFIXED32:return c.FIXED32;default:return c.INVALID}};
	jspb.BinaryConstants.INVALID_FIELD_NUMBER=-1;jspb.BinaryConstants.FLOAT32_EPS=1.401298464324817E-45;jspb.BinaryConstants.FLOAT32_MIN=1.1754943508222875E-38;jspb.BinaryConstants.FLOAT32_MAX=3.4028234663852886E38;jspb.BinaryConstants.FLOAT64_EPS=4.9E-324;jspb.BinaryConstants.FLOAT64_MIN=2.2250738585072014E-308;jspb.BinaryConstants.FLOAT64_MAX=1.7976931348623157E308;jspb.BinaryConstants.TWO_TO_20=1048576;jspb.BinaryConstants.TWO_TO_23=8388608;jspb.BinaryConstants.TWO_TO_31=2147483648;
	jspb.BinaryConstants.TWO_TO_32=4294967296;jspb.BinaryConstants.TWO_TO_52=4503599627370496;jspb.BinaryConstants.TWO_TO_63=0x7fffffffffffffff;jspb.BinaryConstants.TWO_TO_64=1.8446744073709552E19;jspb.BinaryConstants.ZERO_HASH="\x00\x00\x00\x00\x00\x00\x00\x00";goog.debug={};goog.debug.Error=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,goog.debug.Error);else {var b=Error().stack;b&&(this.stack=b);}a&&(this.message=String(a));this.reportErrorToServer=!0;};goog.inherits(goog.debug.Error,Error);goog.debug.Error.prototype.name="CustomError";goog.dom={};goog.dom.NodeType={ELEMENT:1,ATTRIBUTE:2,TEXT:3,CDATA_SECTION:4,ENTITY_REFERENCE:5,ENTITY:6,PROCESSING_INSTRUCTION:7,COMMENT:8,DOCUMENT:9,DOCUMENT_TYPE:10,DOCUMENT_FRAGMENT:11,NOTATION:12};goog.asserts={};goog.asserts.ENABLE_ASSERTS=goog.DEBUG;goog.asserts.AssertionError=function(a,b){goog.debug.Error.call(this,goog.asserts.subs_(a,b));this.messagePattern=a;};goog.inherits(goog.asserts.AssertionError,goog.debug.Error);goog.asserts.AssertionError.prototype.name="AssertionError";goog.asserts.DEFAULT_ERROR_HANDLER=function(a){throw a;};goog.asserts.errorHandler_=goog.asserts.DEFAULT_ERROR_HANDLER;
	goog.asserts.subs_=function(a,b){a=a.split("%s");for(var c="",d=a.length-1,e=0;e<d;e++)c+=a[e]+(e<b.length?b[e]:"%s");return c+a[d]};goog.asserts.doAssertFailure_=function(a,b,c,d){var e="Assertion failed";if(c){e+=": "+c;var f=d;}else a&&(e+=": "+a,f=b);a=new goog.asserts.AssertionError(""+e,f||[]);goog.asserts.errorHandler_(a);};goog.asserts.setErrorHandler=function(a){goog.asserts.ENABLE_ASSERTS&&(goog.asserts.errorHandler_=a);};
	goog.asserts.assert=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!a&&goog.asserts.doAssertFailure_("",null,b,Array.prototype.slice.call(arguments,2));return a};goog.asserts.assertExists=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&null==a&&goog.asserts.doAssertFailure_("Expected to exist: %s.",[a],b,Array.prototype.slice.call(arguments,2));return a};
	goog.asserts.fail=function(a,b){goog.asserts.ENABLE_ASSERTS&&goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1)));};goog.asserts.assertNumber=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&"number"!==typeof a&&goog.asserts.doAssertFailure_("Expected number but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};
	goog.asserts.assertString=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&"string"!==typeof a&&goog.asserts.doAssertFailure_("Expected string but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};goog.asserts.assertFunction=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isFunction(a)&&goog.asserts.doAssertFailure_("Expected function but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};
	goog.asserts.assertObject=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isObject(a)&&goog.asserts.doAssertFailure_("Expected object but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};goog.asserts.assertArray=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!Array.isArray(a)&&goog.asserts.doAssertFailure_("Expected array but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};
	goog.asserts.assertBoolean=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&"boolean"!==typeof a&&goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};goog.asserts.assertElement=function(a,b,c){!goog.asserts.ENABLE_ASSERTS||goog.isObject(a)&&a.nodeType==goog.dom.NodeType.ELEMENT||goog.asserts.doAssertFailure_("Expected Element but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};
	goog.asserts.assertInstanceof=function(a,b,c,d){!goog.asserts.ENABLE_ASSERTS||a instanceof b||goog.asserts.doAssertFailure_("Expected instanceof %s but got %s.",[goog.asserts.getType_(b),goog.asserts.getType_(a)],c,Array.prototype.slice.call(arguments,3));return a};goog.asserts.assertFinite=function(a,b,c){!goog.asserts.ENABLE_ASSERTS||"number"==typeof a&&isFinite(a)||goog.asserts.doAssertFailure_("Expected %s to be a finite number but it is not.",[a],b,Array.prototype.slice.call(arguments,2));return a};
	goog.asserts.assertObjectPrototypeIsIntact=function(){for(var a in Object.prototype)goog.asserts.fail(a+" should not be enumerable in Object.prototype.");};goog.asserts.getType_=function(a){return a instanceof Function?a.displayName||a.name||"unknown type name":a instanceof Object?a.constructor.displayName||a.constructor.name||Object.prototype.toString.call(a):null===a?"null":typeof a};goog.array={};goog.NATIVE_ARRAY_PROTOTYPES=goog.TRUSTED_SITE;goog.array.ASSUME_NATIVE_FUNCTIONS=2012<goog.FEATURESET_YEAR;goog.array.peek=function(a){return a[a.length-1]};goog.array.last=goog.array.peek;
	goog.array.indexOf=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.indexOf)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if("string"===typeof a)return "string"!==typeof b||1!=b.length?-1:a.indexOf(b,c);for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return -1};
	goog.array.lastIndexOf=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.lastIndexOf)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.lastIndexOf.call(a,b,null==c?a.length-1:c)}:function(a,b,c){c=null==c?a.length-1:c;0>c&&(c=Math.max(0,a.length+c));if("string"===typeof a)return "string"!==typeof b||1!=b.length?-1:a.lastIndexOf(b,c);for(;0<=c;c--)if(c in a&&a[c]===b)return c;return -1};
	goog.array.forEach=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.forEach)?function(a,b,c){goog.asserts.assert(null!=a.length);Array.prototype.forEach.call(a,b,c);}:function(a,b,c){for(var d=a.length,e="string"===typeof a?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a);};goog.array.forEachRight=function(a,b,c){var d=a.length,e="string"===typeof a?a.split(""):a;for(--d;0<=d;--d)d in e&&b.call(c,e[d],d,a);};
	goog.array.filter=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.filter)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,g="string"===typeof a?a.split(""):a,h=0;h<d;h++)if(h in g){var k=g[h];b.call(c,k,h,a)&&(e[f++]=k);}return e};
	goog.array.map=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.map)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f="string"===typeof a?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e};
	goog.array.reduce=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.reduce)?function(a,b,c,d){goog.asserts.assert(null!=a.length);d&&(b=goog.bind(b,d));return Array.prototype.reduce.call(a,b,c)}:function(a,b,c,d){var e=c;goog.array.forEach(a,function(c,g){e=b.call(d,e,c,g,a);});return e};
	goog.array.reduceRight=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.reduceRight)?function(a,b,c,d){goog.asserts.assert(null!=a.length);goog.asserts.assert(null!=b);d&&(b=goog.bind(b,d));return Array.prototype.reduceRight.call(a,b,c)}:function(a,b,c,d){var e=c;goog.array.forEachRight(a,function(c,g){e=b.call(d,e,c,g,a);});return e};
	goog.array.some=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.some)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.some.call(a,b,c)}:function(a,b,c){for(var d=a.length,e="string"===typeof a?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return !0;return !1};
	goog.array.every=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.every)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,e="string"===typeof a?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return !1;return !0};goog.array.count=function(a,b,c){var d=0;goog.array.forEach(a,function(a,f,g){b.call(c,a,f,g)&&++d;},c);return d};
	goog.array.find=function(a,b,c){b=goog.array.findIndex(a,b,c);return 0>b?null:"string"===typeof a?a.charAt(b):a[b]};goog.array.findIndex=function(a,b,c){for(var d=a.length,e="string"===typeof a?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return f;return -1};goog.array.findRight=function(a,b,c){b=goog.array.findIndexRight(a,b,c);return 0>b?null:"string"===typeof a?a.charAt(b):a[b]};
	goog.array.findIndexRight=function(a,b,c){var d=a.length,e="string"===typeof a?a.split(""):a;for(--d;0<=d;d--)if(d in e&&b.call(c,e[d],d,a))return d;return -1};goog.array.contains=function(a,b){return 0<=goog.array.indexOf(a,b)};goog.array.isEmpty=function(a){return 0==a.length};goog.array.clear=function(a){if(!Array.isArray(a))for(var b=a.length-1;0<=b;b--)delete a[b];a.length=0;};goog.array.insert=function(a,b){goog.array.contains(a,b)||a.push(b);};
	goog.array.insertAt=function(a,b,c){goog.array.splice(a,c,0,b);};goog.array.insertArrayAt=function(a,b,c){goog.partial(goog.array.splice,a,c,0).apply(null,b);};goog.array.insertBefore=function(a,b,c){var d;2==arguments.length||0>(d=goog.array.indexOf(a,c))?a.push(b):goog.array.insertAt(a,b,d);};goog.array.remove=function(a,b){b=goog.array.indexOf(a,b);var c;(c=0<=b)&&goog.array.removeAt(a,b);return c};
	goog.array.removeLast=function(a,b){b=goog.array.lastIndexOf(a,b);return 0<=b?(goog.array.removeAt(a,b),!0):!1};goog.array.removeAt=function(a,b){goog.asserts.assert(null!=a.length);return 1==Array.prototype.splice.call(a,b,1).length};goog.array.removeIf=function(a,b,c){b=goog.array.findIndex(a,b,c);return 0<=b?(goog.array.removeAt(a,b),!0):!1};goog.array.removeAllIf=function(a,b,c){var d=0;goog.array.forEachRight(a,function(e,f){b.call(c,e,f,a)&&goog.array.removeAt(a,f)&&d++;});return d};
	goog.array.concat=function(a){return Array.prototype.concat.apply([],arguments)};goog.array.join=function(a){return Array.prototype.concat.apply([],arguments)};goog.array.toArray=function(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return []};goog.array.clone=goog.array.toArray;goog.array.extend=function(a,b){for(var c=1;c<arguments.length;c++){var d=arguments[c];if(goog.isArrayLike(d)){var e=a.length||0,f=d.length||0;a.length=e+f;for(var g=0;g<f;g++)a[e+g]=d[g];}else a.push(d);}};
	goog.array.splice=function(a,b,c,d){goog.asserts.assert(null!=a.length);return Array.prototype.splice.apply(a,goog.array.slice(arguments,1))};goog.array.slice=function(a,b,c){goog.asserts.assert(null!=a.length);return 2>=arguments.length?Array.prototype.slice.call(a,b):Array.prototype.slice.call(a,b,c)};
	goog.array.removeDuplicates=function(a,b,c){b=b||a;var d=function(a){return goog.isObject(a)?"o"+goog.getUid(a):(typeof a).charAt(0)+a};c=c||d;d={};for(var e=0,f=0;f<a.length;){var g=a[f++],h=c(g);Object.prototype.hasOwnProperty.call(d,h)||(d[h]=!0,b[e++]=g);}b.length=e;};goog.array.binarySearch=function(a,b,c){return goog.array.binarySearch_(a,c||goog.array.defaultCompare,!1,b)};goog.array.binarySelect=function(a,b,c){return goog.array.binarySearch_(a,b,!0,void 0,c)};
	goog.array.binarySearch_=function(a,b,c,d,e){for(var f=0,g=a.length,h;f<g;){var k=f+(g-f>>>1);var l=c?b.call(e,a[k],k,a):b(d,a[k]);0<l?f=k+1:(g=k,h=!l);}return h?f:-f-1};goog.array.sort=function(a,b){a.sort(b||goog.array.defaultCompare);};goog.array.stableSort=function(a,b){for(var c=Array(a.length),d=0;d<a.length;d++)c[d]={index:d,value:a[d]};var e=b||goog.array.defaultCompare;goog.array.sort(c,function(a,b){return e(a.value,b.value)||a.index-b.index});for(d=0;d<a.length;d++)a[d]=c[d].value;};
	goog.array.sortByKey=function(a,b,c){var d=c||goog.array.defaultCompare;goog.array.sort(a,function(a,c){return d(b(a),b(c))});};goog.array.sortObjectsByKey=function(a,b,c){goog.array.sortByKey(a,function(a){return a[b]},c);};goog.array.isSorted=function(a,b,c){b=b||goog.array.defaultCompare;for(var d=1;d<a.length;d++){var e=b(a[d-1],a[d]);if(0<e||0==e&&c)return !1}return !0};
	goog.array.equals=function(a,b,c){if(!goog.isArrayLike(a)||!goog.isArrayLike(b)||a.length!=b.length)return !1;var d=a.length;c=c||goog.array.defaultCompareEquality;for(var e=0;e<d;e++)if(!c(a[e],b[e]))return !1;return !0};goog.array.compare3=function(a,b,c){c=c||goog.array.defaultCompare;for(var d=Math.min(a.length,b.length),e=0;e<d;e++){var f=c(a[e],b[e]);if(0!=f)return f}return goog.array.defaultCompare(a.length,b.length)};goog.array.defaultCompare=function(a,b){return a>b?1:a<b?-1:0};
	goog.array.inverseDefaultCompare=function(a,b){return -goog.array.defaultCompare(a,b)};goog.array.defaultCompareEquality=function(a,b){return a===b};goog.array.binaryInsert=function(a,b,c){c=goog.array.binarySearch(a,b,c);return 0>c?(goog.array.insertAt(a,b,-(c+1)),!0):!1};goog.array.binaryRemove=function(a,b,c){b=goog.array.binarySearch(a,b,c);return 0<=b?goog.array.removeAt(a,b):!1};
	goog.array.bucket=function(a,b,c){for(var d={},e=0;e<a.length;e++){var f=a[e],g=b.call(c,f,e,a);void 0!==g&&(d[g]||(d[g]=[])).push(f);}return d};goog.array.toObject=function(a,b,c){var d={};goog.array.forEach(a,function(e,f){d[b.call(c,e,f,a)]=e;});return d};goog.array.range=function(a,b,c){var d=[],e=0,f=a;c=c||1;void 0!==b&&(e=a,f=b);if(0>c*(f-e))return [];if(0<c)for(a=e;a<f;a+=c)d.push(a);else for(a=e;a>f;a+=c)d.push(a);return d};goog.array.repeat=function(a,b){for(var c=[],d=0;d<b;d++)c[d]=a;return c};
	goog.array.flatten=function(a){for(var b=[],c=0;c<arguments.length;c++){var d=arguments[c];if(Array.isArray(d))for(var e=0;e<d.length;e+=8192){var f=goog.array.slice(d,e,e+8192);f=goog.array.flatten.apply(null,f);for(var g=0;g<f.length;g++)b.push(f[g]);}else b.push(d);}return b};goog.array.rotate=function(a,b){goog.asserts.assert(null!=a.length);a.length&&(b%=a.length,0<b?Array.prototype.unshift.apply(a,a.splice(-b,b)):0>b&&Array.prototype.push.apply(a,a.splice(0,-b)));return a};
	goog.array.moveItem=function(a,b,c){goog.asserts.assert(0<=b&&b<a.length);goog.asserts.assert(0<=c&&c<a.length);b=Array.prototype.splice.call(a,b,1);Array.prototype.splice.call(a,c,0,b[0]);};goog.array.zip=function(a){if(!arguments.length)return [];for(var b=[],c=arguments[0].length,d=1;d<arguments.length;d++)arguments[d].length<c&&(c=arguments[d].length);for(d=0;d<c;d++){for(var e=[],f=0;f<arguments.length;f++)e.push(arguments[f][d]);b.push(e);}return b};
	goog.array.shuffle=function(a,b){b=b||Math.random;for(var c=a.length-1;0<c;c--){var d=Math.floor(b()*(c+1)),e=a[c];a[c]=a[d];a[d]=e;}};goog.array.copyByIndex=function(a,b){var c=[];goog.array.forEach(b,function(b){c.push(a[b]);});return c};goog.array.concatMap=function(a,b,c){return goog.array.concat.apply([],goog.array.map(a,b,c))};goog.crypt={};goog.crypt.stringToByteArray=function(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a.charCodeAt(d);255<e&&(b[c++]=e&255,e>>=8);b[c++]=e;}return b};goog.crypt.byteArrayToString=function(a){if(8192>=a.length)return String.fromCharCode.apply(null,a);for(var b="",c=0;c<a.length;c+=8192){var d=goog.array.slice(a,c,c+8192);b+=String.fromCharCode.apply(null,d);}return b};
	goog.crypt.byteArrayToHex=function(a,b){return goog.array.map(a,function(a){a=a.toString(16);return 1<a.length?a:"0"+a}).join(b||"")};goog.crypt.hexToByteArray=function(a){goog.asserts.assert(0==a.length%2,"Key string length must be multiple of 2");for(var b=[],c=0;c<a.length;c+=2)b.push(parseInt(a.substring(c,c+2),16));return b};
	goog.crypt.stringToUtf8ByteArray=function(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a.charCodeAt(d);128>e?b[c++]=e:(2048>e?b[c++]=e>>6|192:(55296==(e&64512)&&d+1<a.length&&56320==(a.charCodeAt(d+1)&64512)?(e=65536+((e&1023)<<10)+(a.charCodeAt(++d)&1023),b[c++]=e>>18|240,b[c++]=e>>12&63|128):b[c++]=e>>12|224,b[c++]=e>>6&63|128),b[c++]=e&63|128);}return b};
	goog.crypt.utf8ByteArrayToString=function(a){for(var b=[],c=0,d=0;c<a.length;){var e=a[c++];if(128>e)b[d++]=String.fromCharCode(e);else if(191<e&&224>e){var f=a[c++];b[d++]=String.fromCharCode((e&31)<<6|f&63);}else if(239<e&&365>e){f=a[c++];var g=a[c++],h=a[c++];e=((e&7)<<18|(f&63)<<12|(g&63)<<6|h&63)-65536;b[d++]=String.fromCharCode(55296+(e>>10));b[d++]=String.fromCharCode(56320+(e&1023));}else f=a[c++],g=a[c++],b[d++]=String.fromCharCode((e&15)<<12|(f&63)<<6|g&63);}return b.join("")};
	goog.crypt.xorByteArray=function(a,b){goog.asserts.assert(a.length==b.length,"XOR array lengths must match");for(var c=[],d=0;d<a.length;d++)c.push(a[d]^b[d]);return c};goog.dom.asserts={};goog.dom.asserts.assertIsLocation=function(a){if(goog.asserts.ENABLE_ASSERTS){var b=goog.dom.asserts.getWindow_(a);b&&(!a||!(a instanceof b.Location)&&a instanceof b.Element)&&goog.asserts.fail("Argument is not a Location (or a non-Element mock); got: %s",goog.dom.asserts.debugStringForType_(a));}return a};
	goog.dom.asserts.assertIsElementType_=function(a,b){if(goog.asserts.ENABLE_ASSERTS){var c=goog.dom.asserts.getWindow_(a);c&&"undefined"!=typeof c[b]&&(a&&(a instanceof c[b]||!(a instanceof c.Location||a instanceof c.Element))||goog.asserts.fail("Argument is not a %s (or a non-Element, non-Location mock); got: %s",b,goog.dom.asserts.debugStringForType_(a)));}return a};goog.dom.asserts.assertIsHTMLAnchorElement=function(a){return goog.dom.asserts.assertIsElementType_(a,"HTMLAnchorElement")};
	goog.dom.asserts.assertIsHTMLButtonElement=function(a){return goog.dom.asserts.assertIsElementType_(a,"HTMLButtonElement")};goog.dom.asserts.assertIsHTMLLinkElement=function(a){return goog.dom.asserts.assertIsElementType_(a,"HTMLLinkElement")};goog.dom.asserts.assertIsHTMLImageElement=function(a){return goog.dom.asserts.assertIsElementType_(a,"HTMLImageElement")};goog.dom.asserts.assertIsHTMLAudioElement=function(a){return goog.dom.asserts.assertIsElementType_(a,"HTMLAudioElement")};
	goog.dom.asserts.assertIsHTMLVideoElement=function(a){return goog.dom.asserts.assertIsElementType_(a,"HTMLVideoElement")};goog.dom.asserts.assertIsHTMLInputElement=function(a){return goog.dom.asserts.assertIsElementType_(a,"HTMLInputElement")};goog.dom.asserts.assertIsHTMLTextAreaElement=function(a){return goog.dom.asserts.assertIsElementType_(a,"HTMLTextAreaElement")};goog.dom.asserts.assertIsHTMLCanvasElement=function(a){return goog.dom.asserts.assertIsElementType_(a,"HTMLCanvasElement")};
	goog.dom.asserts.assertIsHTMLEmbedElement=function(a){return goog.dom.asserts.assertIsElementType_(a,"HTMLEmbedElement")};goog.dom.asserts.assertIsHTMLFormElement=function(a){return goog.dom.asserts.assertIsElementType_(a,"HTMLFormElement")};goog.dom.asserts.assertIsHTMLFrameElement=function(a){return goog.dom.asserts.assertIsElementType_(a,"HTMLFrameElement")};goog.dom.asserts.assertIsHTMLIFrameElement=function(a){return goog.dom.asserts.assertIsElementType_(a,"HTMLIFrameElement")};
	goog.dom.asserts.assertIsHTMLObjectElement=function(a){return goog.dom.asserts.assertIsElementType_(a,"HTMLObjectElement")};goog.dom.asserts.assertIsHTMLScriptElement=function(a){return goog.dom.asserts.assertIsElementType_(a,"HTMLScriptElement")};
	goog.dom.asserts.debugStringForType_=function(a){if(goog.isObject(a))try{return a.constructor.displayName||a.constructor.name||Object.prototype.toString.call(a)}catch(b){return "<object could not be stringified>"}else return void 0===a?"undefined":null===a?"null":typeof a};goog.dom.asserts.getWindow_=function(a){try{var b=a&&a.ownerDocument,c=b&&(b.defaultView||b.parentWindow);c=c||goog.global;if(c.Element&&c.Location)return c}catch(d){}return null};goog.functions={};goog.functions.constant=function(a){return function(){return a}};goog.functions.FALSE=function(){return !1};goog.functions.TRUE=function(){return !0};goog.functions.NULL=function(){return null};goog.functions.identity=function(a,b){return a};goog.functions.error=function(a){return function(){throw Error(a);}};goog.functions.fail=function(a){return function(){throw a;}};
	goog.functions.lock=function(a,b){b=b||0;return function(){return a.apply(this,Array.prototype.slice.call(arguments,0,b))}};goog.functions.nth=function(a){return function(){return arguments[a]}};goog.functions.partialRight=function(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=Array.prototype.slice.call(arguments);b.push.apply(b,c);return a.apply(this,b)}};goog.functions.withReturnValue=function(a,b){return goog.functions.sequence(a,goog.functions.constant(b))};
	goog.functions.equalTo=function(a,b){return function(c){return b?a==c:a===c}};goog.functions.compose=function(a,b){var c=arguments,d=c.length;return function(){var a;d&&(a=c[d-1].apply(this,arguments));for(var b=d-2;0<=b;b--)a=c[b].call(this,a);return a}};goog.functions.sequence=function(a){var b=arguments,c=b.length;return function(){for(var a,e=0;e<c;e++)a=b[e].apply(this,arguments);return a}};
	goog.functions.and=function(a){var b=arguments,c=b.length;return function(){for(var a=0;a<c;a++)if(!b[a].apply(this,arguments))return !1;return !0}};goog.functions.or=function(a){var b=arguments,c=b.length;return function(){for(var a=0;a<c;a++)if(b[a].apply(this,arguments))return !0;return !1}};goog.functions.not=function(a){return function(){return !a.apply(this,arguments)}};
	goog.functions.create=function(a,b){var c=function(){};c.prototype=a.prototype;c=new c;a.apply(c,Array.prototype.slice.call(arguments,1));return c};goog.functions.CACHE_RETURN_VALUE=!0;goog.functions.cacheReturnValue=function(a){var b=!1,c;return function(){if(!goog.functions.CACHE_RETURN_VALUE)return a();b||(c=a(),b=!0);return c}};goog.functions.once=function(a){var b=a;return function(){if(b){var a=b;b=null;a();}}};
	goog.functions.debounce=function(a,b,c){var d=0;return function(e){goog.global.clearTimeout(d);var f=arguments;d=goog.global.setTimeout(function(){a.apply(c,f);},b);}};goog.functions.throttle=function(a,b,c){var d=0,e=!1,f=[],g=function(){d=0;e&&(e=!1,h());},h=function(){d=goog.global.setTimeout(g,b);a.apply(c,f);};return function(a){f=arguments;d?e=!0:h();}};goog.functions.rateLimit=function(a,b,c){var d=0,e=function(){d=0;};return function(f){d||(d=goog.global.setTimeout(e,b),a.apply(c,arguments));}};goog.dom.HtmlElement=function(){};goog.dom.TagName=function(a){this.tagName_=a;};goog.dom.TagName.prototype.toString=function(){return this.tagName_};goog.dom.TagName.A=new goog.dom.TagName("A");goog.dom.TagName.ABBR=new goog.dom.TagName("ABBR");goog.dom.TagName.ACRONYM=new goog.dom.TagName("ACRONYM");goog.dom.TagName.ADDRESS=new goog.dom.TagName("ADDRESS");goog.dom.TagName.APPLET=new goog.dom.TagName("APPLET");goog.dom.TagName.AREA=new goog.dom.TagName("AREA");goog.dom.TagName.ARTICLE=new goog.dom.TagName("ARTICLE");
	goog.dom.TagName.ASIDE=new goog.dom.TagName("ASIDE");goog.dom.TagName.AUDIO=new goog.dom.TagName("AUDIO");goog.dom.TagName.B=new goog.dom.TagName("B");goog.dom.TagName.BASE=new goog.dom.TagName("BASE");goog.dom.TagName.BASEFONT=new goog.dom.TagName("BASEFONT");goog.dom.TagName.BDI=new goog.dom.TagName("BDI");goog.dom.TagName.BDO=new goog.dom.TagName("BDO");goog.dom.TagName.BIG=new goog.dom.TagName("BIG");goog.dom.TagName.BLOCKQUOTE=new goog.dom.TagName("BLOCKQUOTE");goog.dom.TagName.BODY=new goog.dom.TagName("BODY");
	goog.dom.TagName.BR=new goog.dom.TagName("BR");goog.dom.TagName.BUTTON=new goog.dom.TagName("BUTTON");goog.dom.TagName.CANVAS=new goog.dom.TagName("CANVAS");goog.dom.TagName.CAPTION=new goog.dom.TagName("CAPTION");goog.dom.TagName.CENTER=new goog.dom.TagName("CENTER");goog.dom.TagName.CITE=new goog.dom.TagName("CITE");goog.dom.TagName.CODE=new goog.dom.TagName("CODE");goog.dom.TagName.COL=new goog.dom.TagName("COL");goog.dom.TagName.COLGROUP=new goog.dom.TagName("COLGROUP");
	goog.dom.TagName.COMMAND=new goog.dom.TagName("COMMAND");goog.dom.TagName.DATA=new goog.dom.TagName("DATA");goog.dom.TagName.DATALIST=new goog.dom.TagName("DATALIST");goog.dom.TagName.DD=new goog.dom.TagName("DD");goog.dom.TagName.DEL=new goog.dom.TagName("DEL");goog.dom.TagName.DETAILS=new goog.dom.TagName("DETAILS");goog.dom.TagName.DFN=new goog.dom.TagName("DFN");goog.dom.TagName.DIALOG=new goog.dom.TagName("DIALOG");goog.dom.TagName.DIR=new goog.dom.TagName("DIR");goog.dom.TagName.DIV=new goog.dom.TagName("DIV");
	goog.dom.TagName.DL=new goog.dom.TagName("DL");goog.dom.TagName.DT=new goog.dom.TagName("DT");goog.dom.TagName.EM=new goog.dom.TagName("EM");goog.dom.TagName.EMBED=new goog.dom.TagName("EMBED");goog.dom.TagName.FIELDSET=new goog.dom.TagName("FIELDSET");goog.dom.TagName.FIGCAPTION=new goog.dom.TagName("FIGCAPTION");goog.dom.TagName.FIGURE=new goog.dom.TagName("FIGURE");goog.dom.TagName.FONT=new goog.dom.TagName("FONT");goog.dom.TagName.FOOTER=new goog.dom.TagName("FOOTER");goog.dom.TagName.FORM=new goog.dom.TagName("FORM");
	goog.dom.TagName.FRAME=new goog.dom.TagName("FRAME");goog.dom.TagName.FRAMESET=new goog.dom.TagName("FRAMESET");goog.dom.TagName.H1=new goog.dom.TagName("H1");goog.dom.TagName.H2=new goog.dom.TagName("H2");goog.dom.TagName.H3=new goog.dom.TagName("H3");goog.dom.TagName.H4=new goog.dom.TagName("H4");goog.dom.TagName.H5=new goog.dom.TagName("H5");goog.dom.TagName.H6=new goog.dom.TagName("H6");goog.dom.TagName.HEAD=new goog.dom.TagName("HEAD");goog.dom.TagName.HEADER=new goog.dom.TagName("HEADER");
	goog.dom.TagName.HGROUP=new goog.dom.TagName("HGROUP");goog.dom.TagName.HR=new goog.dom.TagName("HR");goog.dom.TagName.HTML=new goog.dom.TagName("HTML");goog.dom.TagName.I=new goog.dom.TagName("I");goog.dom.TagName.IFRAME=new goog.dom.TagName("IFRAME");goog.dom.TagName.IMG=new goog.dom.TagName("IMG");goog.dom.TagName.INPUT=new goog.dom.TagName("INPUT");goog.dom.TagName.INS=new goog.dom.TagName("INS");goog.dom.TagName.ISINDEX=new goog.dom.TagName("ISINDEX");goog.dom.TagName.KBD=new goog.dom.TagName("KBD");
	goog.dom.TagName.KEYGEN=new goog.dom.TagName("KEYGEN");goog.dom.TagName.LABEL=new goog.dom.TagName("LABEL");goog.dom.TagName.LEGEND=new goog.dom.TagName("LEGEND");goog.dom.TagName.LI=new goog.dom.TagName("LI");goog.dom.TagName.LINK=new goog.dom.TagName("LINK");goog.dom.TagName.MAIN=new goog.dom.TagName("MAIN");goog.dom.TagName.MAP=new goog.dom.TagName("MAP");goog.dom.TagName.MARK=new goog.dom.TagName("MARK");goog.dom.TagName.MATH=new goog.dom.TagName("MATH");goog.dom.TagName.MENU=new goog.dom.TagName("MENU");
	goog.dom.TagName.MENUITEM=new goog.dom.TagName("MENUITEM");goog.dom.TagName.META=new goog.dom.TagName("META");goog.dom.TagName.METER=new goog.dom.TagName("METER");goog.dom.TagName.NAV=new goog.dom.TagName("NAV");goog.dom.TagName.NOFRAMES=new goog.dom.TagName("NOFRAMES");goog.dom.TagName.NOSCRIPT=new goog.dom.TagName("NOSCRIPT");goog.dom.TagName.OBJECT=new goog.dom.TagName("OBJECT");goog.dom.TagName.OL=new goog.dom.TagName("OL");goog.dom.TagName.OPTGROUP=new goog.dom.TagName("OPTGROUP");
	goog.dom.TagName.OPTION=new goog.dom.TagName("OPTION");goog.dom.TagName.OUTPUT=new goog.dom.TagName("OUTPUT");goog.dom.TagName.P=new goog.dom.TagName("P");goog.dom.TagName.PARAM=new goog.dom.TagName("PARAM");goog.dom.TagName.PICTURE=new goog.dom.TagName("PICTURE");goog.dom.TagName.PRE=new goog.dom.TagName("PRE");goog.dom.TagName.PROGRESS=new goog.dom.TagName("PROGRESS");goog.dom.TagName.Q=new goog.dom.TagName("Q");goog.dom.TagName.RP=new goog.dom.TagName("RP");goog.dom.TagName.RT=new goog.dom.TagName("RT");
	goog.dom.TagName.RTC=new goog.dom.TagName("RTC");goog.dom.TagName.RUBY=new goog.dom.TagName("RUBY");goog.dom.TagName.S=new goog.dom.TagName("S");goog.dom.TagName.SAMP=new goog.dom.TagName("SAMP");goog.dom.TagName.SCRIPT=new goog.dom.TagName("SCRIPT");goog.dom.TagName.SECTION=new goog.dom.TagName("SECTION");goog.dom.TagName.SELECT=new goog.dom.TagName("SELECT");goog.dom.TagName.SMALL=new goog.dom.TagName("SMALL");goog.dom.TagName.SOURCE=new goog.dom.TagName("SOURCE");goog.dom.TagName.SPAN=new goog.dom.TagName("SPAN");
	goog.dom.TagName.STRIKE=new goog.dom.TagName("STRIKE");goog.dom.TagName.STRONG=new goog.dom.TagName("STRONG");goog.dom.TagName.STYLE=new goog.dom.TagName("STYLE");goog.dom.TagName.SUB=new goog.dom.TagName("SUB");goog.dom.TagName.SUMMARY=new goog.dom.TagName("SUMMARY");goog.dom.TagName.SUP=new goog.dom.TagName("SUP");goog.dom.TagName.SVG=new goog.dom.TagName("SVG");goog.dom.TagName.TABLE=new goog.dom.TagName("TABLE");goog.dom.TagName.TBODY=new goog.dom.TagName("TBODY");goog.dom.TagName.TD=new goog.dom.TagName("TD");
	goog.dom.TagName.TEMPLATE=new goog.dom.TagName("TEMPLATE");goog.dom.TagName.TEXTAREA=new goog.dom.TagName("TEXTAREA");goog.dom.TagName.TFOOT=new goog.dom.TagName("TFOOT");goog.dom.TagName.TH=new goog.dom.TagName("TH");goog.dom.TagName.THEAD=new goog.dom.TagName("THEAD");goog.dom.TagName.TIME=new goog.dom.TagName("TIME");goog.dom.TagName.TITLE=new goog.dom.TagName("TITLE");goog.dom.TagName.TR=new goog.dom.TagName("TR");goog.dom.TagName.TRACK=new goog.dom.TagName("TRACK");goog.dom.TagName.TT=new goog.dom.TagName("TT");
	goog.dom.TagName.U=new goog.dom.TagName("U");goog.dom.TagName.UL=new goog.dom.TagName("UL");goog.dom.TagName.VAR=new goog.dom.TagName("VAR");goog.dom.TagName.VIDEO=new goog.dom.TagName("VIDEO");goog.dom.TagName.WBR=new goog.dom.TagName("WBR");goog.dom.tags={};goog.dom.tags.VOID_TAGS_={area:!0,base:!0,br:!0,col:!0,command:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0};goog.dom.tags.isVoidTag=function(a){return !0===goog.dom.tags.VOID_TAGS_[a]};goog.html={};goog.html.trustedtypes={};goog.html.trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY=goog.TRUSTED_TYPES_POLICY_NAME?goog.createTrustedTypesPolicy(goog.TRUSTED_TYPES_POLICY_NAME+"#html"):null;goog.string={};goog.string.TypedString=function(){};goog.string.Const=function(a,b){this.stringConstValueWithSecurityContract__googStringSecurityPrivate_=a===goog.string.Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_&&b||"";this.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_=goog.string.Const.TYPE_MARKER_;};goog.string.Const.prototype.implementsGoogStringTypedString=!0;goog.string.Const.prototype.getTypedStringValue=function(){return this.stringConstValueWithSecurityContract__googStringSecurityPrivate_};
	goog.DEBUG&&(goog.string.Const.prototype.toString=function(){return "Const{"+this.stringConstValueWithSecurityContract__googStringSecurityPrivate_+"}"});goog.string.Const.unwrap=function(a){if(a instanceof goog.string.Const&&a.constructor===goog.string.Const&&a.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_===goog.string.Const.TYPE_MARKER_)return a.stringConstValueWithSecurityContract__googStringSecurityPrivate_;goog.asserts.fail("expected object of type Const, got '"+a+"'");return "type_error:Const"};
	goog.string.Const.from=function(a){return new goog.string.Const(goog.string.Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_,a)};goog.string.Const.TYPE_MARKER_={};goog.string.Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_={};goog.string.Const.EMPTY=goog.string.Const.from("");goog.html.SafeScript=function(){this.privateDoNotAccessOrElseSafeScriptWrappedValue_="";this.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_=goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;};goog.html.SafeScript.prototype.implementsGoogStringTypedString=!0;goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_={};goog.html.SafeScript.fromConstant=function(a){a=goog.string.Const.unwrap(a);return 0===a.length?goog.html.SafeScript.EMPTY:goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(a)};
	goog.html.SafeScript.fromConstantAndArgs=function(a,b){for(var c=[],d=1;d<arguments.length;d++)c.push(goog.html.SafeScript.stringify_(arguments[d]));return goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse("("+goog.string.Const.unwrap(a)+")("+c.join(", ")+");")};goog.html.SafeScript.fromJson=function(a){return goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(goog.html.SafeScript.stringify_(a))};goog.html.SafeScript.prototype.getTypedStringValue=function(){return this.privateDoNotAccessOrElseSafeScriptWrappedValue_.toString()};
	goog.DEBUG&&(goog.html.SafeScript.prototype.toString=function(){return "SafeScript{"+this.privateDoNotAccessOrElseSafeScriptWrappedValue_+"}"});goog.html.SafeScript.unwrap=function(a){return goog.html.SafeScript.unwrapTrustedScript(a).toString()};
	goog.html.SafeScript.unwrapTrustedScript=function(a){if(a instanceof goog.html.SafeScript&&a.constructor===goog.html.SafeScript&&a.SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_===goog.html.SafeScript.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_)return a.privateDoNotAccessOrElseSafeScriptWrappedValue_;goog.asserts.fail("expected object of type SafeScript, got '"+a+"' of type "+goog.typeOf(a));return "type_error:SafeScript"};
	goog.html.SafeScript.stringify_=function(a){return JSON.stringify(a).replace(/</g,"\\x3c")};goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse=function(a){return (new goog.html.SafeScript).initSecurityPrivateDoNotAccessOrElse_(a)};
	goog.html.SafeScript.prototype.initSecurityPrivateDoNotAccessOrElse_=function(a){this.privateDoNotAccessOrElseSafeScriptWrappedValue_=goog.html.trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY?goog.html.trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY.createScript(a):a;return this};goog.html.SafeScript.EMPTY=goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse("");goog.fs={};goog.fs.url={};goog.fs.url.createObjectUrl=function(a){return goog.fs.url.getUrlObject_().createObjectURL(a)};goog.fs.url.revokeObjectUrl=function(a){goog.fs.url.getUrlObject_().revokeObjectURL(a);};goog.fs.url.UrlObject_=function(){};goog.fs.url.UrlObject_.prototype.createObjectURL=function(a){};goog.fs.url.UrlObject_.prototype.revokeObjectURL=function(a){};
	goog.fs.url.getUrlObject_=function(){var a=goog.fs.url.findUrlObject_();if(null!=a)return a;throw Error("This browser doesn't seem to support blob URLs");};goog.fs.url.findUrlObject_=function(){return void 0!==goog.global.URL&&void 0!==goog.global.URL.createObjectURL?goog.global.URL:void 0!==goog.global.webkitURL&&void 0!==goog.global.webkitURL.createObjectURL?goog.global.webkitURL:void 0!==goog.global.createObjectURL?goog.global:null};
	goog.fs.url.browserSupportsObjectUrls=function(){return null!=goog.fs.url.findUrlObject_()};goog.fs.blob={};goog.fs.blob.getBlob=function(a){var b=goog.global.BlobBuilder||goog.global.WebKitBlobBuilder;if(void 0!==b){b=new b;for(var c=0;c<arguments.length;c++)b.append(arguments[c]);return b.getBlob()}return goog.fs.blob.getBlobWithProperties(goog.array.toArray(arguments))};
	goog.fs.blob.getBlobWithProperties=function(a,b,c){var d=goog.global.BlobBuilder||goog.global.WebKitBlobBuilder;if(void 0!==d){d=new d;for(var e=0;e<a.length;e++)d.append(a[e],c);return d.getBlob(b)}if(void 0!==goog.global.Blob)return d={},b&&(d.type=b),c&&(d.endings=c),new Blob(a,d);throw Error("This browser doesn't seem to support creating Blobs");};goog.i18n={};goog.i18n.bidi={};goog.i18n.bidi.FORCE_RTL=!1;
	goog.i18n.bidi.IS_RTL=goog.i18n.bidi.FORCE_RTL||("ar"==goog.LOCALE.substring(0,2).toLowerCase()||"fa"==goog.LOCALE.substring(0,2).toLowerCase()||"he"==goog.LOCALE.substring(0,2).toLowerCase()||"iw"==goog.LOCALE.substring(0,2).toLowerCase()||"ps"==goog.LOCALE.substring(0,2).toLowerCase()||"sd"==goog.LOCALE.substring(0,2).toLowerCase()||"ug"==goog.LOCALE.substring(0,2).toLowerCase()||"ur"==goog.LOCALE.substring(0,2).toLowerCase()||"yi"==goog.LOCALE.substring(0,2).toLowerCase())&&(2==goog.LOCALE.length||
	"-"==goog.LOCALE.substring(2,3)||"_"==goog.LOCALE.substring(2,3))||3<=goog.LOCALE.length&&"ckb"==goog.LOCALE.substring(0,3).toLowerCase()&&(3==goog.LOCALE.length||"-"==goog.LOCALE.substring(3,4)||"_"==goog.LOCALE.substring(3,4))||7<=goog.LOCALE.length&&("-"==goog.LOCALE.substring(2,3)||"_"==goog.LOCALE.substring(2,3))&&("adlm"==goog.LOCALE.substring(3,7).toLowerCase()||"arab"==goog.LOCALE.substring(3,7).toLowerCase()||"hebr"==goog.LOCALE.substring(3,7).toLowerCase()||"nkoo"==goog.LOCALE.substring(3,
	7).toLowerCase()||"rohg"==goog.LOCALE.substring(3,7).toLowerCase()||"thaa"==goog.LOCALE.substring(3,7).toLowerCase())||8<=goog.LOCALE.length&&("-"==goog.LOCALE.substring(3,4)||"_"==goog.LOCALE.substring(3,4))&&("adlm"==goog.LOCALE.substring(4,8).toLowerCase()||"arab"==goog.LOCALE.substring(4,8).toLowerCase()||"hebr"==goog.LOCALE.substring(4,8).toLowerCase()||"nkoo"==goog.LOCALE.substring(4,8).toLowerCase()||"rohg"==goog.LOCALE.substring(4,8).toLowerCase()||"thaa"==goog.LOCALE.substring(4,8).toLowerCase());
	goog.i18n.bidi.Format={LRE:"\u202a",RLE:"\u202b",PDF:"\u202c",LRM:"\u200e",RLM:"\u200f"};goog.i18n.bidi.Dir={LTR:1,RTL:-1,NEUTRAL:0};goog.i18n.bidi.RIGHT="right";goog.i18n.bidi.LEFT="left";goog.i18n.bidi.I18N_RIGHT=goog.i18n.bidi.IS_RTL?goog.i18n.bidi.LEFT:goog.i18n.bidi.RIGHT;goog.i18n.bidi.I18N_LEFT=goog.i18n.bidi.IS_RTL?goog.i18n.bidi.RIGHT:goog.i18n.bidi.LEFT;
	goog.i18n.bidi.toDir=function(a,b){return "number"==typeof a?0<a?goog.i18n.bidi.Dir.LTR:0>a?goog.i18n.bidi.Dir.RTL:b?null:goog.i18n.bidi.Dir.NEUTRAL:null==a?null:a?goog.i18n.bidi.Dir.RTL:goog.i18n.bidi.Dir.LTR};goog.i18n.bidi.ltrChars_="A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0900-\u1fff\u200e\u2c00-\ud801\ud804-\ud839\ud83c-\udbff\uf900-\ufb1c\ufe00-\ufe6f\ufefd-\uffff";goog.i18n.bidi.rtlChars_="\u0591-\u06ef\u06fa-\u08ff\u200f\ud802-\ud803\ud83a-\ud83b\ufb1d-\ufdff\ufe70-\ufefc";
	goog.i18n.bidi.htmlSkipReg_=/<[^>]*>|&[^;]+;/g;goog.i18n.bidi.stripHtmlIfNeeded_=function(a,b){return b?a.replace(goog.i18n.bidi.htmlSkipReg_,""):a};goog.i18n.bidi.rtlCharReg_=new RegExp("["+goog.i18n.bidi.rtlChars_+"]");goog.i18n.bidi.ltrCharReg_=new RegExp("["+goog.i18n.bidi.ltrChars_+"]");goog.i18n.bidi.hasAnyRtl=function(a,b){return goog.i18n.bidi.rtlCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a,b))};goog.i18n.bidi.hasRtlChar=goog.i18n.bidi.hasAnyRtl;
	goog.i18n.bidi.hasAnyLtr=function(a,b){return goog.i18n.bidi.ltrCharReg_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a,b))};goog.i18n.bidi.ltrRe_=new RegExp("^["+goog.i18n.bidi.ltrChars_+"]");goog.i18n.bidi.rtlRe_=new RegExp("^["+goog.i18n.bidi.rtlChars_+"]");goog.i18n.bidi.isRtlChar=function(a){return goog.i18n.bidi.rtlRe_.test(a)};goog.i18n.bidi.isLtrChar=function(a){return goog.i18n.bidi.ltrRe_.test(a)};goog.i18n.bidi.isNeutralChar=function(a){return !goog.i18n.bidi.isLtrChar(a)&&!goog.i18n.bidi.isRtlChar(a)};
	goog.i18n.bidi.ltrDirCheckRe_=new RegExp("^[^"+goog.i18n.bidi.rtlChars_+"]*["+goog.i18n.bidi.ltrChars_+"]");goog.i18n.bidi.rtlDirCheckRe_=new RegExp("^[^"+goog.i18n.bidi.ltrChars_+"]*["+goog.i18n.bidi.rtlChars_+"]");goog.i18n.bidi.startsWithRtl=function(a,b){return goog.i18n.bidi.rtlDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a,b))};goog.i18n.bidi.isRtlText=goog.i18n.bidi.startsWithRtl;
	goog.i18n.bidi.startsWithLtr=function(a,b){return goog.i18n.bidi.ltrDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a,b))};goog.i18n.bidi.isLtrText=goog.i18n.bidi.startsWithLtr;goog.i18n.bidi.isRequiredLtrRe_=/^http:\/\/.*/;goog.i18n.bidi.isNeutralText=function(a,b){a=goog.i18n.bidi.stripHtmlIfNeeded_(a,b);return goog.i18n.bidi.isRequiredLtrRe_.test(a)||!goog.i18n.bidi.hasAnyLtr(a)&&!goog.i18n.bidi.hasAnyRtl(a)};
	goog.i18n.bidi.ltrExitDirCheckRe_=new RegExp("["+goog.i18n.bidi.ltrChars_+"][^"+goog.i18n.bidi.rtlChars_+"]*$");goog.i18n.bidi.rtlExitDirCheckRe_=new RegExp("["+goog.i18n.bidi.rtlChars_+"][^"+goog.i18n.bidi.ltrChars_+"]*$");goog.i18n.bidi.endsWithLtr=function(a,b){return goog.i18n.bidi.ltrExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a,b))};goog.i18n.bidi.isLtrExitText=goog.i18n.bidi.endsWithLtr;
	goog.i18n.bidi.endsWithRtl=function(a,b){return goog.i18n.bidi.rtlExitDirCheckRe_.test(goog.i18n.bidi.stripHtmlIfNeeded_(a,b))};goog.i18n.bidi.isRtlExitText=goog.i18n.bidi.endsWithRtl;goog.i18n.bidi.rtlLocalesRe_=/^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;goog.i18n.bidi.isRtlLanguage=function(a){return goog.i18n.bidi.rtlLocalesRe_.test(a)};goog.i18n.bidi.bracketGuardTextRe_=/(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;
	goog.i18n.bidi.guardBracketInText=function(a,b){b=(void 0===b?goog.i18n.bidi.hasAnyRtl(a):b)?goog.i18n.bidi.Format.RLM:goog.i18n.bidi.Format.LRM;return a.replace(goog.i18n.bidi.bracketGuardTextRe_,b+"$&"+b)};goog.i18n.bidi.enforceRtlInHtml=function(a){return "<"==a.charAt(0)?a.replace(/<\w+/,"$& dir=rtl"):"\n<span dir=rtl>"+a+"</span>"};goog.i18n.bidi.enforceRtlInText=function(a){return goog.i18n.bidi.Format.RLE+a+goog.i18n.bidi.Format.PDF};
	goog.i18n.bidi.enforceLtrInHtml=function(a){return "<"==a.charAt(0)?a.replace(/<\w+/,"$& dir=ltr"):"\n<span dir=ltr>"+a+"</span>"};goog.i18n.bidi.enforceLtrInText=function(a){return goog.i18n.bidi.Format.LRE+a+goog.i18n.bidi.Format.PDF};goog.i18n.bidi.dimensionsRe_=/:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;goog.i18n.bidi.leftRe_=/left/gi;goog.i18n.bidi.rightRe_=/right/gi;goog.i18n.bidi.tempRe_=/%%%%/g;
	goog.i18n.bidi.mirrorCSS=function(a){return a.replace(goog.i18n.bidi.dimensionsRe_,":$1 $4 $3 $2").replace(goog.i18n.bidi.leftRe_,"%%%%").replace(goog.i18n.bidi.rightRe_,goog.i18n.bidi.LEFT).replace(goog.i18n.bidi.tempRe_,goog.i18n.bidi.RIGHT)};goog.i18n.bidi.doubleQuoteSubstituteRe_=/([\u0591-\u05f2])"/g;goog.i18n.bidi.singleQuoteSubstituteRe_=/([\u0591-\u05f2])'/g;
	goog.i18n.bidi.normalizeHebrewQuote=function(a){return a.replace(goog.i18n.bidi.doubleQuoteSubstituteRe_,"$1\u05f4").replace(goog.i18n.bidi.singleQuoteSubstituteRe_,"$1\u05f3")};goog.i18n.bidi.wordSeparatorRe_=/\s+/;goog.i18n.bidi.hasNumeralsRe_=/[\d\u06f0-\u06f9]/;goog.i18n.bidi.rtlDetectionThreshold_=.4;
	goog.i18n.bidi.estimateDirection=function(a,b){var c=0,d=0,e=!1;a=goog.i18n.bidi.stripHtmlIfNeeded_(a,b).split(goog.i18n.bidi.wordSeparatorRe_);for(b=0;b<a.length;b++){var f=a[b];goog.i18n.bidi.startsWithRtl(f)?(c++,d++):goog.i18n.bidi.isRequiredLtrRe_.test(f)?e=!0:goog.i18n.bidi.hasAnyLtr(f)?d++:goog.i18n.bidi.hasNumeralsRe_.test(f)&&(e=!0);}return 0==d?e?goog.i18n.bidi.Dir.LTR:goog.i18n.bidi.Dir.NEUTRAL:c/d>goog.i18n.bidi.rtlDetectionThreshold_?goog.i18n.bidi.Dir.RTL:goog.i18n.bidi.Dir.LTR};
	goog.i18n.bidi.detectRtlDirectionality=function(a,b){return goog.i18n.bidi.estimateDirection(a,b)==goog.i18n.bidi.Dir.RTL};goog.i18n.bidi.setElementDirAndAlign=function(a,b){a&&(b=goog.i18n.bidi.toDir(b))&&(a.style.textAlign=b==goog.i18n.bidi.Dir.RTL?goog.i18n.bidi.RIGHT:goog.i18n.bidi.LEFT,a.dir=b==goog.i18n.bidi.Dir.RTL?"rtl":"ltr");};
	goog.i18n.bidi.setElementDirByTextDirectionality=function(a,b){switch(goog.i18n.bidi.estimateDirection(b)){case goog.i18n.bidi.Dir.LTR:a.dir="ltr";break;case goog.i18n.bidi.Dir.RTL:a.dir="rtl";break;default:a.removeAttribute("dir");}};goog.i18n.bidi.DirectionalString=function(){};goog.html.TrustedResourceUrl=function(a,b){this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_=a===goog.html.TrustedResourceUrl.CONSTRUCTOR_TOKEN_PRIVATE_&&b||"";this.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_=goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;};goog.html.TrustedResourceUrl.prototype.implementsGoogStringTypedString=!0;goog.html.TrustedResourceUrl.prototype.getTypedStringValue=function(){return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_.toString()};
	goog.html.TrustedResourceUrl.prototype.implementsGoogI18nBidiDirectionalString=!0;goog.html.TrustedResourceUrl.prototype.getDirection=function(){return goog.i18n.bidi.Dir.LTR};
	goog.html.TrustedResourceUrl.prototype.cloneWithParams=function(a,b){var c=goog.html.TrustedResourceUrl.unwrap(this);c=goog.html.TrustedResourceUrl.URL_PARAM_PARSER_.exec(c);var d=c[3]||"";return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(c[1]+goog.html.TrustedResourceUrl.stringifyParams_("?",c[2]||"",a)+goog.html.TrustedResourceUrl.stringifyParams_("#",d,b))};
	goog.DEBUG&&(goog.html.TrustedResourceUrl.prototype.toString=function(){return "TrustedResourceUrl{"+this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_+"}"});goog.html.TrustedResourceUrl.unwrap=function(a){return goog.html.TrustedResourceUrl.unwrapTrustedScriptURL(a).toString()};
	goog.html.TrustedResourceUrl.unwrapTrustedScriptURL=function(a){if(a instanceof goog.html.TrustedResourceUrl&&a.constructor===goog.html.TrustedResourceUrl&&a.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_===goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_)return a.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;goog.asserts.fail("expected object of type TrustedResourceUrl, got '"+a+"' of type "+goog.typeOf(a));return "type_error:TrustedResourceUrl"};
	goog.html.TrustedResourceUrl.format=function(a,b){var c=goog.string.Const.unwrap(a);if(!goog.html.TrustedResourceUrl.BASE_URL_.test(c))throw Error("Invalid TrustedResourceUrl format: "+c);a=c.replace(goog.html.TrustedResourceUrl.FORMAT_MARKER_,function(a,e){if(!Object.prototype.hasOwnProperty.call(b,e))throw Error('Found marker, "'+e+'", in format string, "'+c+'", but no valid label mapping found in args: '+JSON.stringify(b));a=b[e];return a instanceof goog.string.Const?goog.string.Const.unwrap(a):
	encodeURIComponent(String(a))});return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(a)};goog.html.TrustedResourceUrl.FORMAT_MARKER_=/%{(\w+)}/g;goog.html.TrustedResourceUrl.BASE_URL_=/^((https:)?\/\/[0-9a-z.:[\]-]+\/|\/[^/\\]|[^:/\\%]+\/|[^:/\\%]*[?#]|about:blank#)/i;goog.html.TrustedResourceUrl.URL_PARAM_PARSER_=/^([^?#]*)(\?[^#]*)?(#[\s\S]*)?/;
	goog.html.TrustedResourceUrl.formatWithParams=function(a,b,c,d){return goog.html.TrustedResourceUrl.format(a,b).cloneWithParams(c,d)};goog.html.TrustedResourceUrl.fromConstant=function(a){return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(goog.string.Const.unwrap(a))};goog.html.TrustedResourceUrl.fromConstants=function(a){for(var b="",c=0;c<a.length;c++)b+=goog.string.Const.unwrap(a[c]);return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(b)};
	goog.html.TrustedResourceUrl.fromSafeScript=function(a){a=goog.fs.blob.getBlobWithProperties([goog.html.SafeScript.unwrap(a)],"text/javascript");a=goog.fs.url.createObjectUrl(a);return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(a)};goog.html.TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_={};
	goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse=function(a){a=goog.html.trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY?goog.html.trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY.createScriptURL(a):a;return new goog.html.TrustedResourceUrl(goog.html.TrustedResourceUrl.CONSTRUCTOR_TOKEN_PRIVATE_,a)};
	goog.html.TrustedResourceUrl.stringifyParams_=function(a,b,c){if(null==c)return b;if("string"===typeof c)return c?a+encodeURIComponent(c):"";for(var d in c){var e=c[d];e=Array.isArray(e)?e:[e];for(var f=0;f<e.length;f++){var g=e[f];null!=g&&(b||(b=a),b+=(b.length>a.length?"&":"")+encodeURIComponent(d)+"="+encodeURIComponent(String(g)));}}return b};goog.html.TrustedResourceUrl.CONSTRUCTOR_TOKEN_PRIVATE_={};goog.string.internal={};goog.string.internal.startsWith=function(a,b){return 0==a.lastIndexOf(b,0)};goog.string.internal.endsWith=function(a,b){var c=a.length-b.length;return 0<=c&&a.indexOf(b,c)==c};goog.string.internal.caseInsensitiveStartsWith=function(a,b){return 0==goog.string.internal.caseInsensitiveCompare(b,a.substr(0,b.length))};goog.string.internal.caseInsensitiveEndsWith=function(a,b){return 0==goog.string.internal.caseInsensitiveCompare(b,a.substr(a.length-b.length,b.length))};
	goog.string.internal.caseInsensitiveEquals=function(a,b){return a.toLowerCase()==b.toLowerCase()};goog.string.internal.isEmptyOrWhitespace=function(a){return /^[\s\xa0]*$/.test(a)};goog.string.internal.trim=goog.TRUSTED_SITE&&String.prototype.trim?function(a){return a.trim()}:function(a){return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]};goog.string.internal.caseInsensitiveCompare=function(a,b){a=String(a).toLowerCase();b=String(b).toLowerCase();return a<b?-1:a==b?0:1};
	goog.string.internal.newLineToBr=function(a,b){return a.replace(/(\r\n|\r|\n)/g,b?"<br />":"<br>")};
	goog.string.internal.htmlEscape=function(a,b){if(b)a=a.replace(goog.string.internal.AMP_RE_,"&amp;").replace(goog.string.internal.LT_RE_,"&lt;").replace(goog.string.internal.GT_RE_,"&gt;").replace(goog.string.internal.QUOT_RE_,"&quot;").replace(goog.string.internal.SINGLE_QUOTE_RE_,"&#39;").replace(goog.string.internal.NULL_RE_,"&#0;");else {if(!goog.string.internal.ALL_RE_.test(a))return a;-1!=a.indexOf("&")&&(a=a.replace(goog.string.internal.AMP_RE_,"&amp;"));-1!=a.indexOf("<")&&(a=a.replace(goog.string.internal.LT_RE_,
	"&lt;"));-1!=a.indexOf(">")&&(a=a.replace(goog.string.internal.GT_RE_,"&gt;"));-1!=a.indexOf('"')&&(a=a.replace(goog.string.internal.QUOT_RE_,"&quot;"));-1!=a.indexOf("'")&&(a=a.replace(goog.string.internal.SINGLE_QUOTE_RE_,"&#39;"));-1!=a.indexOf("\x00")&&(a=a.replace(goog.string.internal.NULL_RE_,"&#0;"));}return a};goog.string.internal.AMP_RE_=/&/g;goog.string.internal.LT_RE_=/</g;goog.string.internal.GT_RE_=/>/g;goog.string.internal.QUOT_RE_=/"/g;goog.string.internal.SINGLE_QUOTE_RE_=/'/g;
	goog.string.internal.NULL_RE_=/\x00/g;goog.string.internal.ALL_RE_=/[\x00&<>"']/;goog.string.internal.whitespaceEscape=function(a,b){return goog.string.internal.newLineToBr(a.replace(/  /g," &#160;"),b)};goog.string.internal.contains=function(a,b){return -1!=a.indexOf(b)};goog.string.internal.caseInsensitiveContains=function(a,b){return goog.string.internal.contains(a.toLowerCase(),b.toLowerCase())};
	goog.string.internal.compareVersions=function(a,b){var c=0;a=goog.string.internal.trim(String(a)).split(".");b=goog.string.internal.trim(String(b)).split(".");for(var d=Math.max(a.length,b.length),e=0;0==c&&e<d;e++){var f=a[e]||"",g=b[e]||"";do{f=/(\d*)(\D*)(.*)/.exec(f)||["","","",""];g=/(\d*)(\D*)(.*)/.exec(g)||["","","",""];if(0==f[0].length&&0==g[0].length)break;c=0==f[1].length?0:parseInt(f[1],10);var h=0==g[1].length?0:parseInt(g[1],10);c=goog.string.internal.compareElements_(c,h)||goog.string.internal.compareElements_(0==
	f[2].length,0==g[2].length)||goog.string.internal.compareElements_(f[2],g[2]);f=f[3];g=g[3];}while(0==c)}return c};goog.string.internal.compareElements_=function(a,b){return a<b?-1:a>b?1:0};goog.html.SafeUrl=function(a,b){this.privateDoNotAccessOrElseSafeUrlWrappedValue_=a===goog.html.SafeUrl.CONSTRUCTOR_TOKEN_PRIVATE_&&b||"";this.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_=goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;};goog.html.SafeUrl.INNOCUOUS_STRING="about:invalid#zClosurez";goog.html.SafeUrl.prototype.implementsGoogStringTypedString=!0;goog.html.SafeUrl.prototype.getTypedStringValue=function(){return this.privateDoNotAccessOrElseSafeUrlWrappedValue_.toString()};
	goog.html.SafeUrl.prototype.implementsGoogI18nBidiDirectionalString=!0;goog.html.SafeUrl.prototype.getDirection=function(){return goog.i18n.bidi.Dir.LTR};goog.DEBUG&&(goog.html.SafeUrl.prototype.toString=function(){return "SafeUrl{"+this.privateDoNotAccessOrElseSafeUrlWrappedValue_+"}"});
	goog.html.SafeUrl.unwrap=function(a){if(a instanceof goog.html.SafeUrl&&a.constructor===goog.html.SafeUrl&&a.SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_===goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_)return a.privateDoNotAccessOrElseSafeUrlWrappedValue_;goog.asserts.fail("expected object of type SafeUrl, got '"+a+"' of type "+goog.typeOf(a));return "type_error:SafeUrl"};goog.html.SafeUrl.fromConstant=function(a){return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(goog.string.Const.unwrap(a))};
	goog.html.SAFE_MIME_TYPE_PATTERN_=/^(?:audio\/(?:3gpp2|3gpp|aac|L16|midi|mp3|mp4|mpeg|oga|ogg|opus|x-m4a|x-matroska|x-wav|wav|webm)|image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp|x-icon)|text\/csv|video\/(?:mpeg|mp4|ogg|webm|quicktime|x-matroska))(?:;\w+=(?:\w+|"[\w;,= ]+"))*$/i;goog.html.SafeUrl.isSafeMimeType=function(a){return goog.html.SAFE_MIME_TYPE_PATTERN_.test(a)};
	goog.html.SafeUrl.fromBlob=function(a){a=goog.html.SafeUrl.isSafeMimeType(a.type)?goog.fs.url.createObjectUrl(a):goog.html.SafeUrl.INNOCUOUS_STRING;return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)};goog.html.SafeUrl.fromMediaSource=function(a){goog.asserts.assert("MediaSource"in goog.global,"No support for MediaSource");a=a instanceof MediaSource?goog.fs.url.createObjectUrl(a):goog.html.SafeUrl.INNOCUOUS_STRING;return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)};
	goog.html.DATA_URL_PATTERN_=/^data:(.*);base64,[a-z0-9+\/]+=*$/i;goog.html.SafeUrl.fromDataUrl=function(a){a=a.replace(/(%0A|%0D)/g,"");var b=a.match(goog.html.DATA_URL_PATTERN_);b=b&&goog.html.SafeUrl.isSafeMimeType(b[1]);return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(b?a:goog.html.SafeUrl.INNOCUOUS_STRING)};goog.html.SafeUrl.fromTelUrl=function(a){goog.string.internal.caseInsensitiveStartsWith(a,"tel:")||(a=goog.html.SafeUrl.INNOCUOUS_STRING);return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)};
	goog.html.SIP_URL_PATTERN_=/^sip[s]?:[+a-z0-9_.!$%&'*\/=^`{|}~-]+@([a-z0-9-]+\.)+[a-z0-9]{2,63}$/i;goog.html.SafeUrl.fromSipUrl=function(a){goog.html.SIP_URL_PATTERN_.test(decodeURIComponent(a))||(a=goog.html.SafeUrl.INNOCUOUS_STRING);return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)};goog.html.SafeUrl.fromFacebookMessengerUrl=function(a){goog.string.internal.caseInsensitiveStartsWith(a,"fb-messenger://share")||(a=goog.html.SafeUrl.INNOCUOUS_STRING);return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)};
	goog.html.SafeUrl.fromWhatsAppUrl=function(a){goog.string.internal.caseInsensitiveStartsWith(a,"whatsapp://send")||(a=goog.html.SafeUrl.INNOCUOUS_STRING);return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)};goog.html.SafeUrl.fromSmsUrl=function(a){goog.string.internal.caseInsensitiveStartsWith(a,"sms:")&&goog.html.SafeUrl.isSmsUrlBodyValid_(a)||(a=goog.html.SafeUrl.INNOCUOUS_STRING);return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)};
	goog.html.SafeUrl.isSmsUrlBodyValid_=function(a){var b=a.indexOf("#");0<b&&(a=a.substring(0,b));b=a.match(/[?&]body=/gi);if(!b)return !0;if(1<b.length)return !1;a=a.match(/[?&]body=([^&]*)/)[1];if(!a)return !0;try{decodeURIComponent(a);}catch(c){return !1}return /^(?:[a-z0-9\-_.~]|%[0-9a-f]{2})+$/i.test(a)};goog.html.SafeUrl.fromSshUrl=function(a){goog.string.internal.caseInsensitiveStartsWith(a,"ssh://")||(a=goog.html.SafeUrl.INNOCUOUS_STRING);return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)};
	goog.html.SafeUrl.sanitizeChromeExtensionUrl=function(a,b){return goog.html.SafeUrl.sanitizeExtensionUrl_(/^chrome-extension:\/\/([^\/]+)\//,a,b)};goog.html.SafeUrl.sanitizeFirefoxExtensionUrl=function(a,b){return goog.html.SafeUrl.sanitizeExtensionUrl_(/^moz-extension:\/\/([^\/]+)\//,a,b)};goog.html.SafeUrl.sanitizeEdgeExtensionUrl=function(a,b){return goog.html.SafeUrl.sanitizeExtensionUrl_(/^ms-browser-extension:\/\/([^\/]+)\//,a,b)};
	goog.html.SafeUrl.sanitizeExtensionUrl_=function(a,b,c){(a=a.exec(b))?(a=a[1],-1==(c instanceof goog.string.Const?[goog.string.Const.unwrap(c)]:c.map(function(a){return goog.string.Const.unwrap(a)})).indexOf(a)&&(b=goog.html.SafeUrl.INNOCUOUS_STRING)):b=goog.html.SafeUrl.INNOCUOUS_STRING;return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(b)};goog.html.SafeUrl.fromTrustedResourceUrl=function(a){return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(goog.html.TrustedResourceUrl.unwrap(a))};
	goog.html.SAFE_URL_PATTERN_=/^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;goog.html.SafeUrl.SAFE_URL_PATTERN=goog.html.SAFE_URL_PATTERN_;goog.html.SafeUrl.sanitize=function(a){if(a instanceof goog.html.SafeUrl)return a;a="object"==typeof a&&a.implementsGoogStringTypedString?a.getTypedStringValue():String(a);goog.html.SAFE_URL_PATTERN_.test(a)||(a=goog.html.SafeUrl.INNOCUOUS_STRING);return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)};
	goog.html.SafeUrl.sanitizeAssertUnchanged=function(a,b){if(a instanceof goog.html.SafeUrl)return a;a="object"==typeof a&&a.implementsGoogStringTypedString?a.getTypedStringValue():String(a);if(b&&/^data:/i.test(a)&&(b=goog.html.SafeUrl.fromDataUrl(a),b.getTypedStringValue()==a))return b;goog.asserts.assert(goog.html.SAFE_URL_PATTERN_.test(a),"%s does not match the safe URL pattern",a)||(a=goog.html.SafeUrl.INNOCUOUS_STRING);return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(a)};
	goog.html.SafeUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_={};goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse=function(a){return new goog.html.SafeUrl(goog.html.SafeUrl.CONSTRUCTOR_TOKEN_PRIVATE_,a)};goog.html.SafeUrl.ABOUT_BLANK=goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse("about:blank");goog.html.SafeUrl.CONSTRUCTOR_TOKEN_PRIVATE_={};goog.html.SafeStyle=function(){this.privateDoNotAccessOrElseSafeStyleWrappedValue_="";this.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_=goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;};goog.html.SafeStyle.prototype.implementsGoogStringTypedString=!0;goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_={};
	goog.html.SafeStyle.fromConstant=function(a){a=goog.string.Const.unwrap(a);if(0===a.length)return goog.html.SafeStyle.EMPTY;goog.asserts.assert(goog.string.internal.endsWith(a,";"),"Last character of style string is not ';': "+a);goog.asserts.assert(goog.string.internal.contains(a,":"),"Style string must contain at least one ':', to specify a \"name: value\" pair: "+a);return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(a)};
	goog.html.SafeStyle.prototype.getTypedStringValue=function(){return this.privateDoNotAccessOrElseSafeStyleWrappedValue_};goog.DEBUG&&(goog.html.SafeStyle.prototype.toString=function(){return "SafeStyle{"+this.privateDoNotAccessOrElseSafeStyleWrappedValue_+"}"});
	goog.html.SafeStyle.unwrap=function(a){if(a instanceof goog.html.SafeStyle&&a.constructor===goog.html.SafeStyle&&a.SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_===goog.html.SafeStyle.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_)return a.privateDoNotAccessOrElseSafeStyleWrappedValue_;goog.asserts.fail("expected object of type SafeStyle, got '"+a+"' of type "+goog.typeOf(a));return "type_error:SafeStyle"};goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse=function(a){return (new goog.html.SafeStyle).initSecurityPrivateDoNotAccessOrElse_(a)};
	goog.html.SafeStyle.prototype.initSecurityPrivateDoNotAccessOrElse_=function(a){this.privateDoNotAccessOrElseSafeStyleWrappedValue_=a;return this};goog.html.SafeStyle.EMPTY=goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse("");goog.html.SafeStyle.INNOCUOUS_STRING="zClosurez";
	goog.html.SafeStyle.create=function(a){var b="",c;for(c in a){if(!/^[-_a-zA-Z0-9]+$/.test(c))throw Error("Name allows only [-_a-zA-Z0-9], got: "+c);var d=a[c];null!=d&&(d=Array.isArray(d)?goog.array.map(d,goog.html.SafeStyle.sanitizePropertyValue_).join(" "):goog.html.SafeStyle.sanitizePropertyValue_(d),b+=c+":"+d+";");}return b?goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(b):goog.html.SafeStyle.EMPTY};
	goog.html.SafeStyle.sanitizePropertyValue_=function(a){if(a instanceof goog.html.SafeUrl)return 'url("'+goog.html.SafeUrl.unwrap(a).replace(/</g,"%3c").replace(/[\\"]/g,"\\$&")+'")';a=a instanceof goog.string.Const?goog.string.Const.unwrap(a):goog.html.SafeStyle.sanitizePropertyValueString_(String(a));if(/[{;}]/.test(a))throw new goog.asserts.AssertionError("Value does not allow [{;}], got: %s.",[a]);return a};
	goog.html.SafeStyle.sanitizePropertyValueString_=function(a){var b=a.replace(goog.html.SafeStyle.FUNCTIONS_RE_,"$1").replace(goog.html.SafeStyle.FUNCTIONS_RE_,"$1").replace(goog.html.SafeStyle.URL_RE_,"url");if(goog.html.SafeStyle.VALUE_RE_.test(b)){if(goog.html.SafeStyle.COMMENT_RE_.test(a))return goog.asserts.fail("String value disallows comments, got: "+a),goog.html.SafeStyle.INNOCUOUS_STRING;if(!goog.html.SafeStyle.hasBalancedQuotes_(a))return goog.asserts.fail("String value requires balanced quotes, got: "+
	a),goog.html.SafeStyle.INNOCUOUS_STRING;if(!goog.html.SafeStyle.hasBalancedSquareBrackets_(a))return goog.asserts.fail("String value requires balanced square brackets and one identifier per pair of brackets, got: "+a),goog.html.SafeStyle.INNOCUOUS_STRING}else return goog.asserts.fail("String value allows only "+goog.html.SafeStyle.VALUE_ALLOWED_CHARS_+" and simple functions, got: "+a),goog.html.SafeStyle.INNOCUOUS_STRING;return goog.html.SafeStyle.sanitizeUrl_(a)};
	goog.html.SafeStyle.hasBalancedQuotes_=function(a){for(var b=!0,c=!0,d=0;d<a.length;d++){var e=a.charAt(d);"'"==e&&c?b=!b:'"'==e&&b&&(c=!c);}return b&&c};goog.html.SafeStyle.hasBalancedSquareBrackets_=function(a){for(var b=!0,c=/^[-_a-zA-Z0-9]$/,d=0;d<a.length;d++){var e=a.charAt(d);if("]"==e){if(b)return !1;b=!0;}else if("["==e){if(!b)return !1;b=!1;}else if(!b&&!c.test(e))return !1}return b};goog.html.SafeStyle.VALUE_ALLOWED_CHARS_="[-,.\"'%_!# a-zA-Z0-9\\[\\]]";
	goog.html.SafeStyle.VALUE_RE_=new RegExp("^"+goog.html.SafeStyle.VALUE_ALLOWED_CHARS_+"+$");goog.html.SafeStyle.URL_RE_=/\b(url\([ \t\n]*)('[ -&(-\[\]-~]*'|"[ !#-\[\]-~]*"|[!#-&*-\[\]-~]*)([ \t\n]*\))/g;goog.html.SafeStyle.ALLOWED_FUNCTIONS_="calc cubic-bezier fit-content hsl hsla linear-gradient matrix minmax repeat rgb rgba (rotate|scale|translate)(X|Y|Z|3d)?".split(" ");
	goog.html.SafeStyle.FUNCTIONS_RE_=new RegExp("\\b("+goog.html.SafeStyle.ALLOWED_FUNCTIONS_.join("|")+")\\([-+*/0-9a-z.%\\[\\], ]+\\)","g");goog.html.SafeStyle.COMMENT_RE_=/\/\*/;goog.html.SafeStyle.sanitizeUrl_=function(a){return a.replace(goog.html.SafeStyle.URL_RE_,function(a,c,d,e){var b="";d=d.replace(/^(['"])(.*)\1$/,function(a,c,d){b=c;return d});a=goog.html.SafeUrl.sanitize(d).getTypedStringValue();return c+b+a+b+e})};
	goog.html.SafeStyle.concat=function(a){var b="",c=function(a){Array.isArray(a)?goog.array.forEach(a,c):b+=goog.html.SafeStyle.unwrap(a);};goog.array.forEach(arguments,c);return b?goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(b):goog.html.SafeStyle.EMPTY};goog.html.SafeStyleSheet=function(){this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_="";this.SAFE_STYLE_SHEET_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_=goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;};goog.html.SafeStyleSheet.prototype.implementsGoogStringTypedString=!0;goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_={};
	goog.html.SafeStyleSheet.createRule=function(a,b){if(goog.string.internal.contains(a,"<"))throw Error("Selector does not allow '<', got: "+a);var c=a.replace(/('|")((?!\1)[^\r\n\f\\]|\\[\s\S])*\1/g,"");if(!/^[-_a-zA-Z0-9#.:* ,>+~[\]()=^$|]+$/.test(c))throw Error("Selector allows only [-_a-zA-Z0-9#.:* ,>+~[\\]()=^$|] and strings, got: "+a);if(!goog.html.SafeStyleSheet.hasBalancedBrackets_(c))throw Error("() and [] in selector must be balanced, got: "+a);b instanceof goog.html.SafeStyle||(b=goog.html.SafeStyle.create(b));
	a=a+"{"+goog.html.SafeStyle.unwrap(b).replace(/</g,"\\3C ")+"}";return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(a)};goog.html.SafeStyleSheet.hasBalancedBrackets_=function(a){for(var b={"(":")","[":"]"},c=[],d=0;d<a.length;d++){var e=a[d];if(b[e])c.push(b[e]);else if(goog.object.contains(b,e)&&c.pop()!=e)return !1}return 0==c.length};
	goog.html.SafeStyleSheet.concat=function(a){var b="",c=function(a){Array.isArray(a)?goog.array.forEach(a,c):b+=goog.html.SafeStyleSheet.unwrap(a);};goog.array.forEach(arguments,c);return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(b)};
	goog.html.SafeStyleSheet.fromConstant=function(a){a=goog.string.Const.unwrap(a);if(0===a.length)return goog.html.SafeStyleSheet.EMPTY;goog.asserts.assert(!goog.string.internal.contains(a,"<"),"Forbidden '<' character in style sheet string: "+a);return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(a)};goog.html.SafeStyleSheet.prototype.getTypedStringValue=function(){return this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_};
	goog.DEBUG&&(goog.html.SafeStyleSheet.prototype.toString=function(){return "SafeStyleSheet{"+this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_+"}"});
	goog.html.SafeStyleSheet.unwrap=function(a){if(a instanceof goog.html.SafeStyleSheet&&a.constructor===goog.html.SafeStyleSheet&&a.SAFE_STYLE_SHEET_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_===goog.html.SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_)return a.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;goog.asserts.fail("expected object of type SafeStyleSheet, got '"+a+"' of type "+goog.typeOf(a));return "type_error:SafeStyleSheet"};
	goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse=function(a){return (new goog.html.SafeStyleSheet).initSecurityPrivateDoNotAccessOrElse_(a)};goog.html.SafeStyleSheet.prototype.initSecurityPrivateDoNotAccessOrElse_=function(a){this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_=a;return this};goog.html.SafeStyleSheet.EMPTY=goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse("");goog.labs={};goog.labs.userAgent={};goog.labs.userAgent.util={};goog.labs.userAgent.util.getNativeUserAgentString_=function(){var a=goog.labs.userAgent.util.getNavigator_();return a&&(a=a.userAgent)?a:""};goog.labs.userAgent.util.getNavigator_=function(){return goog.global.navigator};goog.labs.userAgent.util.userAgent_=goog.labs.userAgent.util.getNativeUserAgentString_();goog.labs.userAgent.util.setUserAgent=function(a){goog.labs.userAgent.util.userAgent_=a||goog.labs.userAgent.util.getNativeUserAgentString_();};
	goog.labs.userAgent.util.getUserAgent=function(){return goog.labs.userAgent.util.userAgent_};goog.labs.userAgent.util.matchUserAgent=function(a){var b=goog.labs.userAgent.util.getUserAgent();return goog.string.internal.contains(b,a)};goog.labs.userAgent.util.matchUserAgentIgnoreCase=function(a){var b=goog.labs.userAgent.util.getUserAgent();return goog.string.internal.caseInsensitiveContains(b,a)};
	goog.labs.userAgent.util.extractVersionTuples=function(a){for(var b=/(\w[\w ]+)\/([^\s]+)\s*(?:\((.*?)\))?/g,c=[],d;d=b.exec(a);)c.push([d[1],d[2],d[3]||void 0]);return c};goog.labs.userAgent.browser={};goog.labs.userAgent.browser.matchOpera_=function(){return goog.labs.userAgent.util.matchUserAgent("Opera")};goog.labs.userAgent.browser.matchIE_=function(){return goog.labs.userAgent.util.matchUserAgent("Trident")||goog.labs.userAgent.util.matchUserAgent("MSIE")};goog.labs.userAgent.browser.matchEdgeHtml_=function(){return goog.labs.userAgent.util.matchUserAgent("Edge")};goog.labs.userAgent.browser.matchEdgeChromium_=function(){return goog.labs.userAgent.util.matchUserAgent("Edg/")};
	goog.labs.userAgent.browser.matchOperaChromium_=function(){return goog.labs.userAgent.util.matchUserAgent("OPR")};goog.labs.userAgent.browser.matchFirefox_=function(){return goog.labs.userAgent.util.matchUserAgent("Firefox")||goog.labs.userAgent.util.matchUserAgent("FxiOS")};
	goog.labs.userAgent.browser.matchSafari_=function(){return goog.labs.userAgent.util.matchUserAgent("Safari")&&!(goog.labs.userAgent.browser.matchChrome_()||goog.labs.userAgent.browser.matchCoast_()||goog.labs.userAgent.browser.matchOpera_()||goog.labs.userAgent.browser.matchEdgeHtml_()||goog.labs.userAgent.browser.matchEdgeChromium_()||goog.labs.userAgent.browser.matchOperaChromium_()||goog.labs.userAgent.browser.matchFirefox_()||goog.labs.userAgent.browser.isSilk()||goog.labs.userAgent.util.matchUserAgent("Android"))};
	goog.labs.userAgent.browser.matchCoast_=function(){return goog.labs.userAgent.util.matchUserAgent("Coast")};goog.labs.userAgent.browser.matchIosWebview_=function(){return (goog.labs.userAgent.util.matchUserAgent("iPad")||goog.labs.userAgent.util.matchUserAgent("iPhone"))&&!goog.labs.userAgent.browser.matchSafari_()&&!goog.labs.userAgent.browser.matchChrome_()&&!goog.labs.userAgent.browser.matchCoast_()&&!goog.labs.userAgent.browser.matchFirefox_()&&goog.labs.userAgent.util.matchUserAgent("AppleWebKit")};
	goog.labs.userAgent.browser.matchChrome_=function(){return (goog.labs.userAgent.util.matchUserAgent("Chrome")||goog.labs.userAgent.util.matchUserAgent("CriOS"))&&!goog.labs.userAgent.browser.matchEdgeHtml_()};goog.labs.userAgent.browser.matchAndroidBrowser_=function(){return goog.labs.userAgent.util.matchUserAgent("Android")&&!(goog.labs.userAgent.browser.isChrome()||goog.labs.userAgent.browser.isFirefox()||goog.labs.userAgent.browser.isOpera()||goog.labs.userAgent.browser.isSilk())};
	goog.labs.userAgent.browser.isOpera=goog.labs.userAgent.browser.matchOpera_;goog.labs.userAgent.browser.isIE=goog.labs.userAgent.browser.matchIE_;goog.labs.userAgent.browser.isEdge=goog.labs.userAgent.browser.matchEdgeHtml_;goog.labs.userAgent.browser.isEdgeChromium=goog.labs.userAgent.browser.matchEdgeChromium_;goog.labs.userAgent.browser.isOperaChromium=goog.labs.userAgent.browser.matchOperaChromium_;goog.labs.userAgent.browser.isFirefox=goog.labs.userAgent.browser.matchFirefox_;
	goog.labs.userAgent.browser.isSafari=goog.labs.userAgent.browser.matchSafari_;goog.labs.userAgent.browser.isCoast=goog.labs.userAgent.browser.matchCoast_;goog.labs.userAgent.browser.isIosWebview=goog.labs.userAgent.browser.matchIosWebview_;goog.labs.userAgent.browser.isChrome=goog.labs.userAgent.browser.matchChrome_;goog.labs.userAgent.browser.isAndroidBrowser=goog.labs.userAgent.browser.matchAndroidBrowser_;goog.labs.userAgent.browser.isSilk=function(){return goog.labs.userAgent.util.matchUserAgent("Silk")};
	goog.labs.userAgent.browser.getVersion=function(){function a(a){a=goog.array.find(a,d);return c[a]||""}var b=goog.labs.userAgent.util.getUserAgent();if(goog.labs.userAgent.browser.isIE())return goog.labs.userAgent.browser.getIEVersion_(b);b=goog.labs.userAgent.util.extractVersionTuples(b);var c={};goog.array.forEach(b,function(a){c[a[0]]=a[1];});var d=goog.partial(goog.object.containsKey,c);return goog.labs.userAgent.browser.isOpera()?a(["Version","Opera"]):goog.labs.userAgent.browser.isEdge()?a(["Edge"]):
	goog.labs.userAgent.browser.isEdgeChromium()?a(["Edg"]):goog.labs.userAgent.browser.isChrome()?a(["Chrome","CriOS","HeadlessChrome"]):(b=b[2])&&b[1]||""};goog.labs.userAgent.browser.isVersionOrHigher=function(a){return 0<=goog.string.internal.compareVersions(goog.labs.userAgent.browser.getVersion(),a)};
	goog.labs.userAgent.browser.getIEVersion_=function(a){var b=/rv: *([\d\.]*)/.exec(a);if(b&&b[1])return b[1];b="";var c=/MSIE +([\d\.]+)/.exec(a);if(c&&c[1])if(a=/Trident\/(\d.\d)/.exec(a),"7.0"==c[1])if(a&&a[1])switch(a[1]){case "4.0":b="8.0";break;case "5.0":b="9.0";break;case "6.0":b="10.0";break;case "7.0":b="11.0";}else b="7.0";else b=c[1];return b};goog.html.SafeHtml=function(){this.privateDoNotAccessOrElseSafeHtmlWrappedValue_="";this.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_=goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;this.dir_=null;};goog.html.SafeHtml.ENABLE_ERROR_MESSAGES=goog.DEBUG;goog.html.SafeHtml.SUPPORT_STYLE_ATTRIBUTE=!0;goog.html.SafeHtml.prototype.implementsGoogI18nBidiDirectionalString=!0;goog.html.SafeHtml.prototype.getDirection=function(){return this.dir_};
	goog.html.SafeHtml.prototype.implementsGoogStringTypedString=!0;goog.html.SafeHtml.prototype.getTypedStringValue=function(){return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_.toString()};goog.DEBUG&&(goog.html.SafeHtml.prototype.toString=function(){return "SafeHtml{"+this.privateDoNotAccessOrElseSafeHtmlWrappedValue_+"}"});goog.html.SafeHtml.unwrap=function(a){return goog.html.SafeHtml.unwrapTrustedHTML(a).toString()};
	goog.html.SafeHtml.unwrapTrustedHTML=function(a){if(a instanceof goog.html.SafeHtml&&a.constructor===goog.html.SafeHtml&&a.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_===goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_)return a.privateDoNotAccessOrElseSafeHtmlWrappedValue_;goog.asserts.fail("expected object of type SafeHtml, got '"+a+"' of type "+goog.typeOf(a));return "type_error:SafeHtml"};
	goog.html.SafeHtml.htmlEscape=function(a){if(a instanceof goog.html.SafeHtml)return a;var b="object"==typeof a,c=null;b&&a.implementsGoogI18nBidiDirectionalString&&(c=a.getDirection());a=b&&a.implementsGoogStringTypedString?a.getTypedStringValue():String(a);return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.internal.htmlEscape(a),c)};
	goog.html.SafeHtml.htmlEscapePreservingNewlines=function(a){if(a instanceof goog.html.SafeHtml)return a;a=goog.html.SafeHtml.htmlEscape(a);return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.internal.newLineToBr(goog.html.SafeHtml.unwrap(a)),a.getDirection())};
	goog.html.SafeHtml.htmlEscapePreservingNewlinesAndSpaces=function(a){if(a instanceof goog.html.SafeHtml)return a;a=goog.html.SafeHtml.htmlEscape(a);return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(goog.string.internal.whitespaceEscape(goog.html.SafeHtml.unwrap(a)),a.getDirection())};goog.html.SafeHtml.from=goog.html.SafeHtml.htmlEscape;
	goog.html.SafeHtml.comment=function(a){return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("\x3c!--"+goog.string.internal.htmlEscape(a)+"--\x3e",null)};goog.html.SafeHtml.VALID_NAMES_IN_TAG_=/^[a-zA-Z0-9-]+$/;goog.html.SafeHtml.URL_ATTRIBUTES_={action:!0,cite:!0,data:!0,formaction:!0,href:!0,manifest:!0,poster:!0,src:!0};goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_={APPLET:!0,BASE:!0,EMBED:!0,IFRAME:!0,LINK:!0,MATH:!0,META:!0,OBJECT:!0,SCRIPT:!0,STYLE:!0,SVG:!0,TEMPLATE:!0};
	goog.html.SafeHtml.create=function(a,b,c){goog.html.SafeHtml.verifyTagName(String(a));return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(String(a),b,c)};
	goog.html.SafeHtml.verifyTagName=function(a){if(!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(a))throw Error(goog.html.SafeHtml.ENABLE_ERROR_MESSAGES?"Invalid tag name <"+a+">.":"");if(a.toUpperCase()in goog.html.SafeHtml.NOT_ALLOWED_TAG_NAMES_)throw Error(goog.html.SafeHtml.ENABLE_ERROR_MESSAGES?"Tag name <"+a+"> is not allowed for SafeHtml.":"");};
	goog.html.SafeHtml.createIframe=function(a,b,c,d){a&&goog.html.TrustedResourceUrl.unwrap(a);var e={};e.src=a||null;e.srcdoc=b&&goog.html.SafeHtml.unwrap(b);a=goog.html.SafeHtml.combineAttributes(e,{sandbox:""},c);return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("iframe",a,d)};
	goog.html.SafeHtml.createSandboxIframe=function(a,b,c,d){if(!goog.html.SafeHtml.canUseSandboxIframe())throw Error(goog.html.SafeHtml.ENABLE_ERROR_MESSAGES?"The browser does not support sandboxed iframes.":"");var e={};e.src=a?goog.html.SafeUrl.unwrap(goog.html.SafeUrl.sanitize(a)):null;e.srcdoc=b||null;e.sandbox="";a=goog.html.SafeHtml.combineAttributes(e,{},c);return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("iframe",a,d)};
	goog.html.SafeHtml.canUseSandboxIframe=function(){return goog.global.HTMLIFrameElement&&"sandbox"in goog.global.HTMLIFrameElement.prototype};goog.html.SafeHtml.createScriptSrc=function(a,b){goog.html.TrustedResourceUrl.unwrap(a);a=goog.html.SafeHtml.combineAttributes({src:a},{},b);return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("script",a)};
	goog.html.SafeHtml.createScript=function(a,b){for(var c in b){var d=c.toLowerCase();if("language"==d||"src"==d||"text"==d||"type"==d)throw Error(goog.html.SafeHtml.ENABLE_ERROR_MESSAGES?'Cannot set "'+d+'" attribute':"");}c="";a=goog.array.concat(a);for(d=0;d<a.length;d++)c+=goog.html.SafeScript.unwrap(a[d]);a=goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(c,goog.i18n.bidi.Dir.NEUTRAL);return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("script",b,a)};
	goog.html.SafeHtml.createStyle=function(a,b){b=goog.html.SafeHtml.combineAttributes({type:"text/css"},{},b);var c="";a=goog.array.concat(a);for(var d=0;d<a.length;d++)c+=goog.html.SafeStyleSheet.unwrap(a[d]);a=goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(c,goog.i18n.bidi.Dir.NEUTRAL);return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("style",b,a)};
	goog.html.SafeHtml.createMetaRefresh=function(a,b){a=goog.html.SafeUrl.unwrap(goog.html.SafeUrl.sanitize(a));(goog.labs.userAgent.browser.isIE()||goog.labs.userAgent.browser.isEdge())&&goog.string.internal.contains(a,";")&&(a="'"+a.replace(/'/g,"%27")+"'");return goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse("meta",{"http-equiv":"refresh",content:(b||0)+"; url="+a})};
	goog.html.SafeHtml.getAttrNameAndValue_=function(a,b,c){if(c instanceof goog.string.Const)c=goog.string.Const.unwrap(c);else if("style"==b.toLowerCase())if(goog.html.SafeHtml.SUPPORT_STYLE_ATTRIBUTE)c=goog.html.SafeHtml.getStyleValue_(c);else throw Error(goog.html.SafeHtml.ENABLE_ERROR_MESSAGES?'Attribute "style" not supported.':"");else {if(/^on/i.test(b))throw Error(goog.html.SafeHtml.ENABLE_ERROR_MESSAGES?'Attribute "'+b+'" requires goog.string.Const value, "'+c+'" given.':"");if(b.toLowerCase()in
	goog.html.SafeHtml.URL_ATTRIBUTES_)if(c instanceof goog.html.TrustedResourceUrl)c=goog.html.TrustedResourceUrl.unwrap(c);else if(c instanceof goog.html.SafeUrl)c=goog.html.SafeUrl.unwrap(c);else if("string"===typeof c)c=goog.html.SafeUrl.sanitize(c).getTypedStringValue();else throw Error(goog.html.SafeHtml.ENABLE_ERROR_MESSAGES?'Attribute "'+b+'" on tag "'+a+'" requires goog.html.SafeUrl, goog.string.Const, or string, value "'+c+'" given.':"");}c.implementsGoogStringTypedString&&(c=c.getTypedStringValue());
	goog.asserts.assert("string"===typeof c||"number"===typeof c,"String or number value expected, got "+typeof c+" with value: "+c);return b+'="'+goog.string.internal.htmlEscape(String(c))+'"'};goog.html.SafeHtml.getStyleValue_=function(a){if(!goog.isObject(a))throw Error(goog.html.SafeHtml.ENABLE_ERROR_MESSAGES?'The "style" attribute requires goog.html.SafeStyle or map of style properties, '+typeof a+" given: "+a:"");a instanceof goog.html.SafeStyle||(a=goog.html.SafeStyle.create(a));return goog.html.SafeStyle.unwrap(a)};
	goog.html.SafeHtml.createWithDir=function(a,b,c,d){b=goog.html.SafeHtml.create(b,c,d);b.dir_=a;return b};
	goog.html.SafeHtml.join=function(a,b){a=goog.html.SafeHtml.htmlEscape(a);var c=a.getDirection(),d=[],e=function(a){Array.isArray(a)?goog.array.forEach(a,e):(a=goog.html.SafeHtml.htmlEscape(a),d.push(goog.html.SafeHtml.unwrap(a)),a=a.getDirection(),c==goog.i18n.bidi.Dir.NEUTRAL?c=a:a!=goog.i18n.bidi.Dir.NEUTRAL&&c!=a&&(c=null));};goog.array.forEach(b,e);return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(d.join(goog.html.SafeHtml.unwrap(a)),c)};
	goog.html.SafeHtml.concat=function(a){return goog.html.SafeHtml.join(goog.html.SafeHtml.EMPTY,Array.prototype.slice.call(arguments))};goog.html.SafeHtml.concatWithDir=function(a,b){var c=goog.html.SafeHtml.concat(goog.array.slice(arguments,1));c.dir_=a;return c};goog.html.SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_={};goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse=function(a,b){return (new goog.html.SafeHtml).initSecurityPrivateDoNotAccessOrElse_(a,b)};
	goog.html.SafeHtml.prototype.initSecurityPrivateDoNotAccessOrElse_=function(a,b){this.privateDoNotAccessOrElseSafeHtmlWrappedValue_=goog.html.trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY?goog.html.trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY.createHTML(a):a;this.dir_=b;return this};
	goog.html.SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse=function(a,b,c){var d=null;var e="<"+a+goog.html.SafeHtml.stringifyAttributes(a,b);null==c?c=[]:Array.isArray(c)||(c=[c]);goog.dom.tags.isVoidTag(a.toLowerCase())?(goog.asserts.assert(!c.length,"Void tag <"+a+"> does not allow content."),e+=">"):(d=goog.html.SafeHtml.concat(c),e+=">"+goog.html.SafeHtml.unwrap(d)+"</"+a+">",d=d.getDirection());(a=b&&b.dir)&&(d=/^(ltr|rtl|auto)$/i.test(a)?goog.i18n.bidi.Dir.NEUTRAL:null);return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(e,
	d)};goog.html.SafeHtml.stringifyAttributes=function(a,b){var c="";if(b)for(var d in b){if(!goog.html.SafeHtml.VALID_NAMES_IN_TAG_.test(d))throw Error(goog.html.SafeHtml.ENABLE_ERROR_MESSAGES?'Invalid attribute name "'+d+'".':"");var e=b[d];null!=e&&(c+=" "+goog.html.SafeHtml.getAttrNameAndValue_(a,d,e));}return c};
	goog.html.SafeHtml.combineAttributes=function(a,b,c){var d={},e;for(e in a)goog.asserts.assert(e.toLowerCase()==e,"Must be lower case"),d[e]=a[e];for(e in b)goog.asserts.assert(e.toLowerCase()==e,"Must be lower case"),d[e]=b[e];if(c)for(e in c){var f=e.toLowerCase();if(f in a)throw Error(goog.html.SafeHtml.ENABLE_ERROR_MESSAGES?'Cannot override "'+f+'" attribute, got "'+e+'" with value "'+c[e]+'"':"");f in b&&delete d[f];d[e]=c[e];}return d};
	goog.html.SafeHtml.DOCTYPE_HTML=goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("<!DOCTYPE html>",goog.i18n.bidi.Dir.NEUTRAL);goog.html.SafeHtml.EMPTY=goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("",goog.i18n.bidi.Dir.NEUTRAL);goog.html.SafeHtml.BR=goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse("<br>",goog.i18n.bidi.Dir.NEUTRAL);goog.html.uncheckedconversions={};goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract=function(a,b,c){goog.asserts.assertString(goog.string.Const.unwrap(a),"must provide justification");goog.asserts.assert(!goog.string.internal.isEmptyOrWhitespace(goog.string.Const.unwrap(a)),"must provide non-empty justification");return goog.html.SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(b,c||null)};
	goog.html.uncheckedconversions.safeScriptFromStringKnownToSatisfyTypeContract=function(a,b){goog.asserts.assertString(goog.string.Const.unwrap(a),"must provide justification");goog.asserts.assert(!goog.string.internal.isEmptyOrWhitespace(goog.string.Const.unwrap(a)),"must provide non-empty justification");return goog.html.SafeScript.createSafeScriptSecurityPrivateDoNotAccessOrElse(b)};
	goog.html.uncheckedconversions.safeStyleFromStringKnownToSatisfyTypeContract=function(a,b){goog.asserts.assertString(goog.string.Const.unwrap(a),"must provide justification");goog.asserts.assert(!goog.string.internal.isEmptyOrWhitespace(goog.string.Const.unwrap(a)),"must provide non-empty justification");return goog.html.SafeStyle.createSafeStyleSecurityPrivateDoNotAccessOrElse(b)};
	goog.html.uncheckedconversions.safeStyleSheetFromStringKnownToSatisfyTypeContract=function(a,b){goog.asserts.assertString(goog.string.Const.unwrap(a),"must provide justification");goog.asserts.assert(!goog.string.internal.isEmptyOrWhitespace(goog.string.Const.unwrap(a)),"must provide non-empty justification");return goog.html.SafeStyleSheet.createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(b)};
	goog.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract=function(a,b){goog.asserts.assertString(goog.string.Const.unwrap(a),"must provide justification");goog.asserts.assert(!goog.string.internal.isEmptyOrWhitespace(goog.string.Const.unwrap(a)),"must provide non-empty justification");return goog.html.SafeUrl.createSafeUrlSecurityPrivateDoNotAccessOrElse(b)};
	goog.html.uncheckedconversions.trustedResourceUrlFromStringKnownToSatisfyTypeContract=function(a,b){goog.asserts.assertString(goog.string.Const.unwrap(a),"must provide justification");goog.asserts.assert(!goog.string.internal.isEmptyOrWhitespace(goog.string.Const.unwrap(a)),"must provide non-empty justification");return goog.html.TrustedResourceUrl.createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(b)};goog.dom.safe={};goog.dom.safe.InsertAdjacentHtmlPosition={AFTERBEGIN:"afterbegin",AFTEREND:"afterend",BEFOREBEGIN:"beforebegin",BEFOREEND:"beforeend"};goog.dom.safe.insertAdjacentHtml=function(a,b,c){a.insertAdjacentHTML(b,goog.html.SafeHtml.unwrapTrustedHTML(c));};goog.dom.safe.SET_INNER_HTML_DISALLOWED_TAGS_={MATH:!0,SCRIPT:!0,STYLE:!0,SVG:!0,TEMPLATE:!0};
	goog.dom.safe.isInnerHtmlCleanupRecursive_=goog.functions.cacheReturnValue(function(){if(goog.DEBUG&&"undefined"===typeof document)return !1;var a=document.createElement("div"),b=document.createElement("div");b.appendChild(document.createElement("div"));a.appendChild(b);if(goog.DEBUG&&!a.firstChild)return !1;b=a.firstChild.firstChild;a.innerHTML=goog.html.SafeHtml.unwrapTrustedHTML(goog.html.SafeHtml.EMPTY);return !b.parentElement});
	goog.dom.safe.unsafeSetInnerHtmlDoNotUseOrElse=function(a,b){if(goog.dom.safe.isInnerHtmlCleanupRecursive_())for(;a.lastChild;)a.removeChild(a.lastChild);a.innerHTML=goog.html.SafeHtml.unwrapTrustedHTML(b);};
	goog.dom.safe.setInnerHtml=function(a,b){if(goog.asserts.ENABLE_ASSERTS){var c=a.tagName.toUpperCase();if(goog.dom.safe.SET_INNER_HTML_DISALLOWED_TAGS_[c])throw Error("goog.dom.safe.setInnerHtml cannot be used to set content of "+a.tagName+".");}goog.dom.safe.unsafeSetInnerHtmlDoNotUseOrElse(a,b);};goog.dom.safe.setOuterHtml=function(a,b){a.outerHTML=goog.html.SafeHtml.unwrapTrustedHTML(b);};
	goog.dom.safe.setFormElementAction=function(a,b){b=b instanceof goog.html.SafeUrl?b:goog.html.SafeUrl.sanitizeAssertUnchanged(b);goog.dom.asserts.assertIsHTMLFormElement(a).action=goog.html.SafeUrl.unwrap(b);};goog.dom.safe.setButtonFormAction=function(a,b){b=b instanceof goog.html.SafeUrl?b:goog.html.SafeUrl.sanitizeAssertUnchanged(b);goog.dom.asserts.assertIsHTMLButtonElement(a).formAction=goog.html.SafeUrl.unwrap(b);};
	goog.dom.safe.setInputFormAction=function(a,b){b=b instanceof goog.html.SafeUrl?b:goog.html.SafeUrl.sanitizeAssertUnchanged(b);goog.dom.asserts.assertIsHTMLInputElement(a).formAction=goog.html.SafeUrl.unwrap(b);};goog.dom.safe.setStyle=function(a,b){a.style.cssText=goog.html.SafeStyle.unwrap(b);};goog.dom.safe.documentWrite=function(a,b){a.write(goog.html.SafeHtml.unwrapTrustedHTML(b));};
	goog.dom.safe.setAnchorHref=function(a,b){goog.dom.asserts.assertIsHTMLAnchorElement(a);b=b instanceof goog.html.SafeUrl?b:goog.html.SafeUrl.sanitizeAssertUnchanged(b);a.href=goog.html.SafeUrl.unwrap(b);};goog.dom.safe.setImageSrc=function(a,b){goog.dom.asserts.assertIsHTMLImageElement(a);if(!(b instanceof goog.html.SafeUrl)){var c=/^data:image\//i.test(b);b=goog.html.SafeUrl.sanitizeAssertUnchanged(b,c);}a.src=goog.html.SafeUrl.unwrap(b);};
	goog.dom.safe.setAudioSrc=function(a,b){goog.dom.asserts.assertIsHTMLAudioElement(a);if(!(b instanceof goog.html.SafeUrl)){var c=/^data:audio\//i.test(b);b=goog.html.SafeUrl.sanitizeAssertUnchanged(b,c);}a.src=goog.html.SafeUrl.unwrap(b);};goog.dom.safe.setVideoSrc=function(a,b){goog.dom.asserts.assertIsHTMLVideoElement(a);if(!(b instanceof goog.html.SafeUrl)){var c=/^data:video\//i.test(b);b=goog.html.SafeUrl.sanitizeAssertUnchanged(b,c);}a.src=goog.html.SafeUrl.unwrap(b);};
	goog.dom.safe.setEmbedSrc=function(a,b){goog.dom.asserts.assertIsHTMLEmbedElement(a);a.src=goog.html.TrustedResourceUrl.unwrapTrustedScriptURL(b);};goog.dom.safe.setFrameSrc=function(a,b){goog.dom.asserts.assertIsHTMLFrameElement(a);a.src=goog.html.TrustedResourceUrl.unwrap(b);};goog.dom.safe.setIframeSrc=function(a,b){goog.dom.asserts.assertIsHTMLIFrameElement(a);a.src=goog.html.TrustedResourceUrl.unwrap(b);};
	goog.dom.safe.setIframeSrcdoc=function(a,b){goog.dom.asserts.assertIsHTMLIFrameElement(a);a.srcdoc=goog.html.SafeHtml.unwrapTrustedHTML(b);};
	goog.dom.safe.setLinkHrefAndRel=function(a,b,c){goog.dom.asserts.assertIsHTMLLinkElement(a);a.rel=c;goog.string.internal.caseInsensitiveContains(c,"stylesheet")?(goog.asserts.assert(b instanceof goog.html.TrustedResourceUrl,'URL must be TrustedResourceUrl because "rel" contains "stylesheet"'),a.href=goog.html.TrustedResourceUrl.unwrap(b)):a.href=b instanceof goog.html.TrustedResourceUrl?goog.html.TrustedResourceUrl.unwrap(b):b instanceof goog.html.SafeUrl?goog.html.SafeUrl.unwrap(b):goog.html.SafeUrl.unwrap(goog.html.SafeUrl.sanitizeAssertUnchanged(b));};
	goog.dom.safe.setObjectData=function(a,b){goog.dom.asserts.assertIsHTMLObjectElement(a);a.data=goog.html.TrustedResourceUrl.unwrapTrustedScriptURL(b);};goog.dom.safe.setScriptSrc=function(a,b){goog.dom.asserts.assertIsHTMLScriptElement(a);a.src=goog.html.TrustedResourceUrl.unwrapTrustedScriptURL(b);(b=goog.getScriptNonce())&&a.setAttribute("nonce",b);};
	goog.dom.safe.setScriptContent=function(a,b){goog.dom.asserts.assertIsHTMLScriptElement(a);a.text=goog.html.SafeScript.unwrapTrustedScript(b);(b=goog.getScriptNonce())&&a.setAttribute("nonce",b);};goog.dom.safe.setLocationHref=function(a,b){goog.dom.asserts.assertIsLocation(a);b=b instanceof goog.html.SafeUrl?b:goog.html.SafeUrl.sanitizeAssertUnchanged(b);a.href=goog.html.SafeUrl.unwrap(b);};
	goog.dom.safe.assignLocation=function(a,b){goog.dom.asserts.assertIsLocation(a);b=b instanceof goog.html.SafeUrl?b:goog.html.SafeUrl.sanitizeAssertUnchanged(b);a.assign(goog.html.SafeUrl.unwrap(b));};goog.dom.safe.replaceLocation=function(a,b){b=b instanceof goog.html.SafeUrl?b:goog.html.SafeUrl.sanitizeAssertUnchanged(b);a.replace(goog.html.SafeUrl.unwrap(b));};
	goog.dom.safe.openInWindow=function(a,b,c,d,e){a=a instanceof goog.html.SafeUrl?a:goog.html.SafeUrl.sanitizeAssertUnchanged(a);b=b||goog.global;c=c instanceof goog.string.Const?goog.string.Const.unwrap(c):c||"";return b.open(goog.html.SafeUrl.unwrap(a),c,d,e)};goog.dom.safe.parseFromStringHtml=function(a,b){return goog.dom.safe.parseFromString(a,b,"text/html")};goog.dom.safe.parseFromString=function(a,b,c){return a.parseFromString(goog.html.SafeHtml.unwrapTrustedHTML(b),c)};
	goog.dom.safe.createImageFromBlob=function(a){if(!/^image\/.*/g.test(a.type))throw Error("goog.dom.safe.createImageFromBlob only accepts MIME type image/.*.");var b=goog.global.URL.createObjectURL(a);a=new goog.global.Image;a.onload=function(){goog.global.URL.revokeObjectURL(b);};goog.dom.safe.setImageSrc(a,goog.html.uncheckedconversions.safeUrlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Image blob URL."),b));return a};goog.string.DETECT_DOUBLE_ESCAPING=!1;goog.string.FORCE_NON_DOM_HTML_UNESCAPING=!1;goog.string.Unicode={NBSP:"\u00a0"};goog.string.startsWith=goog.string.internal.startsWith;goog.string.endsWith=goog.string.internal.endsWith;goog.string.caseInsensitiveStartsWith=goog.string.internal.caseInsensitiveStartsWith;goog.string.caseInsensitiveEndsWith=goog.string.internal.caseInsensitiveEndsWith;goog.string.caseInsensitiveEquals=goog.string.internal.caseInsensitiveEquals;
	goog.string.subs=function(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")};goog.string.collapseWhitespace=function(a){return a.replace(/[\s\xa0]+/g," ").replace(/^\s+|\s+$/g,"")};goog.string.isEmptyOrWhitespace=goog.string.internal.isEmptyOrWhitespace;goog.string.isEmptyString=function(a){return 0==a.length};goog.string.isEmpty=goog.string.isEmptyOrWhitespace;goog.string.isEmptyOrWhitespaceSafe=function(a){return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(a))};
	goog.string.isEmptySafe=goog.string.isEmptyOrWhitespaceSafe;goog.string.isBreakingWhitespace=function(a){return !/[^\t\n\r ]/.test(a)};goog.string.isAlpha=function(a){return !/[^a-zA-Z]/.test(a)};goog.string.isNumeric=function(a){return !/[^0-9]/.test(a)};goog.string.isAlphaNumeric=function(a){return !/[^a-zA-Z0-9]/.test(a)};goog.string.isSpace=function(a){return " "==a};goog.string.isUnicodeChar=function(a){return 1==a.length&&" "<=a&&"~">=a||"\u0080"<=a&&"\ufffd">=a};
	goog.string.stripNewlines=function(a){return a.replace(/(\r\n|\r|\n)+/g," ")};goog.string.canonicalizeNewlines=function(a){return a.replace(/(\r\n|\r|\n)/g,"\n")};goog.string.normalizeWhitespace=function(a){return a.replace(/\xa0|\s/g," ")};goog.string.normalizeSpaces=function(a){return a.replace(/\xa0|[ \t]+/g," ")};goog.string.collapseBreakingSpaces=function(a){return a.replace(/[\t\r\n ]+/g," ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g,"")};goog.string.trim=goog.string.internal.trim;
	goog.string.trimLeft=function(a){return a.replace(/^[\s\xa0]+/,"")};goog.string.trimRight=function(a){return a.replace(/[\s\xa0]+$/,"")};goog.string.caseInsensitiveCompare=goog.string.internal.caseInsensitiveCompare;
	goog.string.numberAwareCompare_=function(a,b,c){if(a==b)return 0;if(!a)return -1;if(!b)return 1;for(var d=a.toLowerCase().match(c),e=b.toLowerCase().match(c),f=Math.min(d.length,e.length),g=0;g<f;g++){c=d[g];var h=e[g];if(c!=h)return a=parseInt(c,10),!isNaN(a)&&(b=parseInt(h,10),!isNaN(b)&&a-b)?a-b:c<h?-1:1}return d.length!=e.length?d.length-e.length:a<b?-1:1};goog.string.intAwareCompare=function(a,b){return goog.string.numberAwareCompare_(a,b,/\d+|\D+/g)};
	goog.string.floatAwareCompare=function(a,b){return goog.string.numberAwareCompare_(a,b,/\d+|\.\d+|\D+/g)};goog.string.numerateCompare=goog.string.floatAwareCompare;goog.string.urlEncode=function(a){return encodeURIComponent(String(a))};goog.string.urlDecode=function(a){return decodeURIComponent(a.replace(/\+/g," "))};goog.string.newLineToBr=goog.string.internal.newLineToBr;
	goog.string.htmlEscape=function(a,b){a=goog.string.internal.htmlEscape(a,b);goog.string.DETECT_DOUBLE_ESCAPING&&(a=a.replace(goog.string.E_RE_,"&#101;"));return a};goog.string.E_RE_=/e/g;goog.string.unescapeEntities=function(a){return goog.string.contains(a,"&")?!goog.string.FORCE_NON_DOM_HTML_UNESCAPING&&"document"in goog.global?goog.string.unescapeEntitiesUsingDom_(a):goog.string.unescapePureXmlEntities_(a):a};
	goog.string.unescapeEntitiesWithDocument=function(a,b){return goog.string.contains(a,"&")?goog.string.unescapeEntitiesUsingDom_(a,b):a};
	goog.string.unescapeEntitiesUsingDom_=function(a,b){var c={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"'};var d=b?b.createElement("div"):goog.global.document.createElement("div");return a.replace(goog.string.HTML_ENTITY_PATTERN_,function(a,b){var e=c[a];if(e)return e;"#"==b.charAt(0)&&(b=Number("0"+b.substr(1)),isNaN(b)||(e=String.fromCharCode(b)));e||(goog.dom.safe.setInnerHtml(d,goog.html.uncheckedconversions.safeHtmlFromStringKnownToSatisfyTypeContract(goog.string.Const.from("Single HTML entity."),
	a+" ")),e=d.firstChild.nodeValue.slice(0,-1));return c[a]=e})};goog.string.unescapePureXmlEntities_=function(a){return a.replace(/&([^;]+);/g,function(a,c){switch(c){case "amp":return "&";case "lt":return "<";case "gt":return ">";case "quot":return '"';default:return "#"!=c.charAt(0)||(c=Number("0"+c.substr(1)),isNaN(c))?a:String.fromCharCode(c)}})};goog.string.HTML_ENTITY_PATTERN_=/&([^;\s<&]+);?/g;goog.string.whitespaceEscape=function(a,b){return goog.string.newLineToBr(a.replace(/  /g," &#160;"),b)};
	goog.string.preserveSpaces=function(a){return a.replace(/(^|[\n ]) /g,"$1"+goog.string.Unicode.NBSP)};goog.string.stripQuotes=function(a,b){for(var c=b.length,d=0;d<c;d++){var e=1==c?b:b.charAt(d);if(a.charAt(0)==e&&a.charAt(a.length-1)==e)return a.substring(1,a.length-1)}return a};goog.string.truncate=function(a,b,c){c&&(a=goog.string.unescapeEntities(a));a.length>b&&(a=a.substring(0,b-3)+"...");c&&(a=goog.string.htmlEscape(a));return a};
	goog.string.truncateMiddle=function(a,b,c,d){c&&(a=goog.string.unescapeEntities(a));if(d&&a.length>b){d>b&&(d=b);var e=a.length-d;a=a.substring(0,b-d)+"..."+a.substring(e);}else a.length>b&&(d=Math.floor(b/2),e=a.length-d,a=a.substring(0,d+b%2)+"..."+a.substring(e));c&&(a=goog.string.htmlEscape(a));return a};goog.string.specialEscapeChars_={"\x00":"\\0","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\x0B",'"':'\\"',"\\":"\\\\","<":"\\u003C"};goog.string.jsEscapeCache_={"'":"\\'"};
	goog.string.quote=function(a){a=String(a);for(var b=['"'],c=0;c<a.length;c++){var d=a.charAt(c),e=d.charCodeAt(0);b[c+1]=goog.string.specialEscapeChars_[d]||(31<e&&127>e?d:goog.string.escapeChar(d));}b.push('"');return b.join("")};goog.string.escapeString=function(a){for(var b=[],c=0;c<a.length;c++)b[c]=goog.string.escapeChar(a.charAt(c));return b.join("")};
	goog.string.escapeChar=function(a){if(a in goog.string.jsEscapeCache_)return goog.string.jsEscapeCache_[a];if(a in goog.string.specialEscapeChars_)return goog.string.jsEscapeCache_[a]=goog.string.specialEscapeChars_[a];var b=a.charCodeAt(0);if(31<b&&127>b)var c=a;else {if(256>b){if(c="\\x",16>b||256<b)c+="0";}else c="\\u",4096>b&&(c+="0");c+=b.toString(16).toUpperCase();}return goog.string.jsEscapeCache_[a]=c};goog.string.contains=goog.string.internal.contains;goog.string.caseInsensitiveContains=goog.string.internal.caseInsensitiveContains;
	goog.string.countOf=function(a,b){return a&&b?a.split(b).length-1:0};goog.string.removeAt=function(a,b,c){var d=a;0<=b&&b<a.length&&0<c&&(d=a.substr(0,b)+a.substr(b+c,a.length-b-c));return d};goog.string.remove=function(a,b){return a.replace(b,"")};goog.string.removeAll=function(a,b){b=new RegExp(goog.string.regExpEscape(b),"g");return a.replace(b,"")};goog.string.replaceAll=function(a,b,c){b=new RegExp(goog.string.regExpEscape(b),"g");return a.replace(b,c.replace(/\$/g,"$$$$"))};
	goog.string.regExpEscape=function(a){return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08")};goog.string.repeat=String.prototype.repeat?function(a,b){return a.repeat(b)}:function(a,b){return Array(b+1).join(a)};goog.string.padNumber=function(a,b,c){a=void 0!==c?a.toFixed(c):String(a);c=a.indexOf(".");-1==c&&(c=a.length);return goog.string.repeat("0",Math.max(0,b-c))+a};goog.string.makeSafe=function(a){return null==a?"":String(a)};
	goog.string.buildString=function(a){return Array.prototype.join.call(arguments,"")};goog.string.getRandomString=function(){return Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^goog.now()).toString(36)};goog.string.compareVersions=goog.string.internal.compareVersions;goog.string.hashCode=function(a){for(var b=0,c=0;c<a.length;++c)b=31*b+a.charCodeAt(c)>>>0;return b};goog.string.uniqueStringCounter_=2147483648*Math.random()|0;
	goog.string.createUniqueString=function(){return "goog_"+goog.string.uniqueStringCounter_++};goog.string.toNumber=function(a){var b=Number(a);return 0==b&&goog.string.isEmptyOrWhitespace(a)?NaN:b};goog.string.isLowerCamelCase=function(a){return /^[a-z]+([A-Z][a-z]*)*$/.test(a)};goog.string.isUpperCamelCase=function(a){return /^([A-Z][a-z]*)+$/.test(a)};goog.string.toCamelCase=function(a){return String(a).replace(/\-([a-z])/g,function(a,c){return c.toUpperCase()})};
	goog.string.toSelectorCase=function(a){return String(a).replace(/([A-Z])/g,"-$1").toLowerCase()};goog.string.toTitleCase=function(a,b){b="string"===typeof b?goog.string.regExpEscape(b):"\\s";return a.replace(new RegExp("(^"+(b?"|["+b+"]+":"")+")([a-z])","g"),function(a,b,e){return b+e.toUpperCase()})};goog.string.capitalize=function(a){return String(a.charAt(0)).toUpperCase()+String(a.substr(1)).toLowerCase()};
	goog.string.parseInt=function(a){isFinite(a)&&(a=String(a));return "string"===typeof a?/^\s*-?0x/i.test(a)?parseInt(a,16):parseInt(a,10):NaN};goog.string.splitLimit=function(a,b,c){a=a.split(b);for(var d=[];0<c&&a.length;)d.push(a.shift()),c--;a.length&&d.push(a.join(b));return d};goog.string.lastComponent=function(a,b){if(b)"string"==typeof b&&(b=[b]);else return a;for(var c=-1,d=0;d<b.length;d++)if(""!=b[d]){var e=a.lastIndexOf(b[d]);e>c&&(c=e);}return -1==c?a:a.slice(c+1)};
	goog.string.editDistance=function(a,b){var c=[],d=[];if(a==b)return 0;if(!a.length||!b.length)return Math.max(a.length,b.length);for(var e=0;e<b.length+1;e++)c[e]=e;for(e=0;e<a.length;e++){d[0]=e+1;for(var f=0;f<b.length;f++)d[f+1]=Math.min(d[f]+1,c[f+1]+1,c[f]+Number(a[e]!=b[f]));for(f=0;f<c.length;f++)c[f]=d[f];}return d[b.length]};goog.labs.userAgent.engine={};goog.labs.userAgent.engine.isPresto=function(){return goog.labs.userAgent.util.matchUserAgent("Presto")};goog.labs.userAgent.engine.isTrident=function(){return goog.labs.userAgent.util.matchUserAgent("Trident")||goog.labs.userAgent.util.matchUserAgent("MSIE")};goog.labs.userAgent.engine.isEdge=function(){return goog.labs.userAgent.util.matchUserAgent("Edge")};
	goog.labs.userAgent.engine.isWebKit=function(){return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit")&&!goog.labs.userAgent.engine.isEdge()};goog.labs.userAgent.engine.isGecko=function(){return goog.labs.userAgent.util.matchUserAgent("Gecko")&&!goog.labs.userAgent.engine.isWebKit()&&!goog.labs.userAgent.engine.isTrident()&&!goog.labs.userAgent.engine.isEdge()};
	goog.labs.userAgent.engine.getVersion=function(){var a=goog.labs.userAgent.util.getUserAgent();if(a){a=goog.labs.userAgent.util.extractVersionTuples(a);var b=goog.labs.userAgent.engine.getEngineTuple_(a);if(b)return "Gecko"==b[0]?goog.labs.userAgent.engine.getVersionForKey_(a,"Firefox"):b[1];a=a[0];var c;if(a&&(c=a[2])&&(c=/Trident\/([^\s;]+)/.exec(c)))return c[1]}return ""};
	goog.labs.userAgent.engine.getEngineTuple_=function(a){if(!goog.labs.userAgent.engine.isEdge())return a[1];for(var b=0;b<a.length;b++){var c=a[b];if("Edge"==c[0])return c}};goog.labs.userAgent.engine.isVersionOrHigher=function(a){return 0<=goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(),a)};goog.labs.userAgent.engine.getVersionForKey_=function(a,b){return (a=goog.array.find(a,function(a){return b==a[0]}))&&a[1]||""};goog.labs.userAgent.platform={};goog.labs.userAgent.platform.isAndroid=function(){return goog.labs.userAgent.util.matchUserAgent("Android")};goog.labs.userAgent.platform.isIpod=function(){return goog.labs.userAgent.util.matchUserAgent("iPod")};goog.labs.userAgent.platform.isIphone=function(){return goog.labs.userAgent.util.matchUserAgent("iPhone")&&!goog.labs.userAgent.util.matchUserAgent("iPod")&&!goog.labs.userAgent.util.matchUserAgent("iPad")};goog.labs.userAgent.platform.isIpad=function(){return goog.labs.userAgent.util.matchUserAgent("iPad")};
	goog.labs.userAgent.platform.isIos=function(){return goog.labs.userAgent.platform.isIphone()||goog.labs.userAgent.platform.isIpad()||goog.labs.userAgent.platform.isIpod()};goog.labs.userAgent.platform.isMacintosh=function(){return goog.labs.userAgent.util.matchUserAgent("Macintosh")};goog.labs.userAgent.platform.isLinux=function(){return goog.labs.userAgent.util.matchUserAgent("Linux")};goog.labs.userAgent.platform.isWindows=function(){return goog.labs.userAgent.util.matchUserAgent("Windows")};
	goog.labs.userAgent.platform.isChromeOS=function(){return goog.labs.userAgent.util.matchUserAgent("CrOS")};goog.labs.userAgent.platform.isChromecast=function(){return goog.labs.userAgent.util.matchUserAgent("CrKey")};goog.labs.userAgent.platform.isKaiOS=function(){return goog.labs.userAgent.util.matchUserAgentIgnoreCase("KaiOS")};
	goog.labs.userAgent.platform.getVersion=function(){var a=goog.labs.userAgent.util.getUserAgent(),b="";goog.labs.userAgent.platform.isWindows()?(b=/Windows (?:NT|Phone) ([0-9.]+)/,b=(a=b.exec(a))?a[1]:"0.0"):goog.labs.userAgent.platform.isIos()?(b=/(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/,b=(a=b.exec(a))&&a[1].replace(/_/g,".")):goog.labs.userAgent.platform.isMacintosh()?(b=/Mac OS X ([0-9_.]+)/,b=(a=b.exec(a))?a[1].replace(/_/g,"."):"10"):goog.labs.userAgent.platform.isKaiOS()?(b=/(?:KaiOS)\/(\S+)/i,
	b=(a=b.exec(a))&&a[1]):goog.labs.userAgent.platform.isAndroid()?(b=/Android\s+([^\);]+)(\)|;)/,b=(a=b.exec(a))&&a[1]):goog.labs.userAgent.platform.isChromeOS()&&(b=/(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/,b=(a=b.exec(a))&&a[1]);return b||""};goog.labs.userAgent.platform.isVersionOrHigher=function(a){return 0<=goog.string.compareVersions(goog.labs.userAgent.platform.getVersion(),a)};goog.reflect={};goog.reflect.object=function(a,b){return b};goog.reflect.objectProperty=function(a,b){return a};goog.reflect.sinkValue=function(a){goog.reflect.sinkValue[" "](a);return a};goog.reflect.sinkValue[" "]=goog.nullFunction;goog.reflect.canAccessProperty=function(a,b){try{return goog.reflect.sinkValue(a[b]),!0}catch(c){}return !1};goog.reflect.cache=function(a,b,c,d){d=d?d(b):b;return Object.prototype.hasOwnProperty.call(a,d)?a[d]:a[d]=c(b)};goog.userAgent={};goog.userAgent.ASSUME_IE=!1;goog.userAgent.ASSUME_EDGE=!1;goog.userAgent.ASSUME_GECKO=!1;goog.userAgent.ASSUME_WEBKIT=!1;goog.userAgent.ASSUME_MOBILE_WEBKIT=!1;goog.userAgent.ASSUME_OPERA=!1;goog.userAgent.ASSUME_ANY_VERSION=!1;goog.userAgent.BROWSER_KNOWN_=goog.userAgent.ASSUME_IE||goog.userAgent.ASSUME_EDGE||goog.userAgent.ASSUME_GECKO||goog.userAgent.ASSUME_MOBILE_WEBKIT||goog.userAgent.ASSUME_WEBKIT||goog.userAgent.ASSUME_OPERA;goog.userAgent.getUserAgentString=function(){return goog.labs.userAgent.util.getUserAgent()};
	goog.userAgent.getNavigatorTyped=function(){return goog.global.navigator||null};goog.userAgent.getNavigator=function(){return goog.userAgent.getNavigatorTyped()};goog.userAgent.OPERA=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_OPERA:goog.labs.userAgent.browser.isOpera();goog.userAgent.IE=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_IE:goog.labs.userAgent.browser.isIE();goog.userAgent.EDGE=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_EDGE:goog.labs.userAgent.engine.isEdge();
	goog.userAgent.EDGE_OR_IE=goog.userAgent.EDGE||goog.userAgent.IE;goog.userAgent.GECKO=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_GECKO:goog.labs.userAgent.engine.isGecko();goog.userAgent.WEBKIT=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_WEBKIT||goog.userAgent.ASSUME_MOBILE_WEBKIT:goog.labs.userAgent.engine.isWebKit();goog.userAgent.isMobile_=function(){return goog.userAgent.WEBKIT&&goog.labs.userAgent.util.matchUserAgent("Mobile")};
	goog.userAgent.MOBILE=goog.userAgent.ASSUME_MOBILE_WEBKIT||goog.userAgent.isMobile_();goog.userAgent.SAFARI=goog.userAgent.WEBKIT;goog.userAgent.determinePlatform_=function(){var a=goog.userAgent.getNavigatorTyped();return a&&a.platform||""};goog.userAgent.PLATFORM=goog.userAgent.determinePlatform_();goog.userAgent.ASSUME_MAC=!1;goog.userAgent.ASSUME_WINDOWS=!1;goog.userAgent.ASSUME_LINUX=!1;goog.userAgent.ASSUME_X11=!1;goog.userAgent.ASSUME_ANDROID=!1;goog.userAgent.ASSUME_IPHONE=!1;
	goog.userAgent.ASSUME_IPAD=!1;goog.userAgent.ASSUME_IPOD=!1;goog.userAgent.ASSUME_KAIOS=!1;goog.userAgent.PLATFORM_KNOWN_=goog.userAgent.ASSUME_MAC||goog.userAgent.ASSUME_WINDOWS||goog.userAgent.ASSUME_LINUX||goog.userAgent.ASSUME_X11||goog.userAgent.ASSUME_ANDROID||goog.userAgent.ASSUME_IPHONE||goog.userAgent.ASSUME_IPAD||goog.userAgent.ASSUME_IPOD;goog.userAgent.MAC=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_MAC:goog.labs.userAgent.platform.isMacintosh();
	goog.userAgent.WINDOWS=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_WINDOWS:goog.labs.userAgent.platform.isWindows();goog.userAgent.isLegacyLinux_=function(){return goog.labs.userAgent.platform.isLinux()||goog.labs.userAgent.platform.isChromeOS()};goog.userAgent.LINUX=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_LINUX:goog.userAgent.isLegacyLinux_();goog.userAgent.isX11_=function(){var a=goog.userAgent.getNavigatorTyped();return !!a&&goog.string.contains(a.appVersion||"","X11")};
	goog.userAgent.X11=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_X11:goog.userAgent.isX11_();goog.userAgent.ANDROID=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_ANDROID:goog.labs.userAgent.platform.isAndroid();goog.userAgent.IPHONE=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_IPHONE:goog.labs.userAgent.platform.isIphone();goog.userAgent.IPAD=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_IPAD:goog.labs.userAgent.platform.isIpad();
	goog.userAgent.IPOD=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_IPOD:goog.labs.userAgent.platform.isIpod();goog.userAgent.IOS=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_IPHONE||goog.userAgent.ASSUME_IPAD||goog.userAgent.ASSUME_IPOD:goog.labs.userAgent.platform.isIos();goog.userAgent.KAIOS=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_KAIOS:goog.labs.userAgent.platform.isKaiOS();
	goog.userAgent.determineVersion_=function(){var a="",b=goog.userAgent.getVersionRegexResult_();b&&(a=b?b[1]:"");return goog.userAgent.IE&&(b=goog.userAgent.getDocumentMode_(),null!=b&&b>parseFloat(a))?String(b):a};
	goog.userAgent.getVersionRegexResult_=function(){var a=goog.userAgent.getUserAgentString();if(goog.userAgent.GECKO)return /rv:([^\);]+)(\)|;)/.exec(a);if(goog.userAgent.EDGE)return /Edge\/([\d\.]+)/.exec(a);if(goog.userAgent.IE)return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(goog.userAgent.WEBKIT)return /WebKit\/(\S+)/.exec(a);if(goog.userAgent.OPERA)return /(?:Version)[ \/]?(\S+)/.exec(a)};goog.userAgent.getDocumentMode_=function(){var a=goog.global.document;return a?a.documentMode:void 0};
	goog.userAgent.VERSION=goog.userAgent.determineVersion_();goog.userAgent.compare=function(a,b){return goog.string.compareVersions(a,b)};goog.userAgent.isVersionOrHigherCache_={};goog.userAgent.isVersionOrHigher=function(a){return goog.userAgent.ASSUME_ANY_VERSION||goog.reflect.cache(goog.userAgent.isVersionOrHigherCache_,a,function(){return 0<=goog.string.compareVersions(goog.userAgent.VERSION,a)})};goog.userAgent.isVersion=goog.userAgent.isVersionOrHigher;
	goog.userAgent.isDocumentModeOrHigher=function(a){return Number(goog.userAgent.DOCUMENT_MODE)>=a};goog.userAgent.isDocumentMode=goog.userAgent.isDocumentModeOrHigher;goog.userAgent.DOCUMENT_MODE=function(){if(goog.global.document&&goog.userAgent.IE){var a=goog.userAgent.getDocumentMode_();return a?a:parseInt(goog.userAgent.VERSION,10)||void 0}}();goog.userAgent.product={};goog.userAgent.product.ASSUME_FIREFOX=!1;goog.userAgent.product.ASSUME_IPHONE=!1;goog.userAgent.product.ASSUME_IPAD=!1;goog.userAgent.product.ASSUME_ANDROID=!1;goog.userAgent.product.ASSUME_CHROME=!1;goog.userAgent.product.ASSUME_SAFARI=!1;
	goog.userAgent.product.PRODUCT_KNOWN_=goog.userAgent.ASSUME_IE||goog.userAgent.ASSUME_EDGE||goog.userAgent.ASSUME_OPERA||goog.userAgent.product.ASSUME_FIREFOX||goog.userAgent.product.ASSUME_IPHONE||goog.userAgent.product.ASSUME_IPAD||goog.userAgent.product.ASSUME_ANDROID||goog.userAgent.product.ASSUME_CHROME||goog.userAgent.product.ASSUME_SAFARI;goog.userAgent.product.OPERA=goog.userAgent.OPERA;goog.userAgent.product.IE=goog.userAgent.IE;goog.userAgent.product.EDGE=goog.userAgent.EDGE;
	goog.userAgent.product.FIREFOX=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_FIREFOX:goog.labs.userAgent.browser.isFirefox();goog.userAgent.product.isIphoneOrIpod_=function(){return goog.labs.userAgent.platform.isIphone()||goog.labs.userAgent.platform.isIpod()};goog.userAgent.product.IPHONE=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_IPHONE:goog.userAgent.product.isIphoneOrIpod_();
	goog.userAgent.product.IPAD=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_IPAD:goog.labs.userAgent.platform.isIpad();goog.userAgent.product.ANDROID=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_ANDROID:goog.labs.userAgent.browser.isAndroidBrowser();goog.userAgent.product.CHROME=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_CHROME:goog.labs.userAgent.browser.isChrome();
	goog.userAgent.product.isSafariDesktop_=function(){return goog.labs.userAgent.browser.isSafari()&&!goog.labs.userAgent.platform.isIos()};goog.userAgent.product.SAFARI=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_SAFARI:goog.userAgent.product.isSafariDesktop_();goog.crypt.base64={};goog.crypt.base64.DEFAULT_ALPHABET_COMMON_="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";goog.crypt.base64.ENCODED_VALS=goog.crypt.base64.DEFAULT_ALPHABET_COMMON_+"+/=";goog.crypt.base64.ENCODED_VALS_WEBSAFE=goog.crypt.base64.DEFAULT_ALPHABET_COMMON_+"-_.";goog.crypt.base64.Alphabet={DEFAULT:0,NO_PADDING:1,WEBSAFE:2,WEBSAFE_DOT_PADDING:3,WEBSAFE_NO_PADDING:4};goog.crypt.base64.paddingChars_="=.";
	goog.crypt.base64.isPadding_=function(a){return goog.string.contains(goog.crypt.base64.paddingChars_,a)};goog.crypt.base64.byteToCharMaps_={};goog.crypt.base64.charToByteMap_=null;goog.crypt.base64.ASSUME_NATIVE_SUPPORT_=goog.userAgent.GECKO||goog.userAgent.WEBKIT&&!goog.userAgent.product.SAFARI||goog.userAgent.OPERA;goog.crypt.base64.HAS_NATIVE_ENCODE_=goog.crypt.base64.ASSUME_NATIVE_SUPPORT_||"function"==typeof goog.global.btoa;
	goog.crypt.base64.HAS_NATIVE_DECODE_=goog.crypt.base64.ASSUME_NATIVE_SUPPORT_||!goog.userAgent.product.SAFARI&&!goog.userAgent.IE&&"function"==typeof goog.global.atob;
	goog.crypt.base64.encodeByteArray=function(a,b){goog.asserts.assert(goog.isArrayLike(a),"encodeByteArray takes an array as a parameter");void 0===b&&(b=goog.crypt.base64.Alphabet.DEFAULT);goog.crypt.base64.init_();b=goog.crypt.base64.byteToCharMaps_[b];for(var c=[],d=0;d<a.length;d+=3){var e=a[d],f=d+1<a.length,g=f?a[d+1]:0,h=d+2<a.length,k=h?a[d+2]:0,l=e>>2;e=(e&3)<<4|g>>4;g=(g&15)<<2|k>>6;k&=63;h||(k=64,f||(g=64));c.push(b[l],b[e],b[g]||"",b[k]||"");}return c.join("")};
	goog.crypt.base64.encodeString=function(a,b){return goog.crypt.base64.HAS_NATIVE_ENCODE_&&!b?goog.global.btoa(a):goog.crypt.base64.encodeByteArray(goog.crypt.stringToByteArray(a),b)};goog.crypt.base64.decodeString=function(a,b){if(goog.crypt.base64.HAS_NATIVE_DECODE_&&!b)return goog.global.atob(a);var c="";goog.crypt.base64.decodeStringInternal_(a,function(a){c+=String.fromCharCode(a);});return c};
	goog.crypt.base64.decodeStringToByteArray=function(a,b){var c=[];goog.crypt.base64.decodeStringInternal_(a,function(a){c.push(a);});return c};
	goog.crypt.base64.decodeStringToUint8Array=function(a){goog.asserts.assert(!goog.userAgent.IE||goog.userAgent.isVersionOrHigher("10"),"Browser does not support typed arrays");var b=a.length,c=3*b/4;c%3?c=Math.floor(c):goog.crypt.base64.isPadding_(a[b-1])&&(c=goog.crypt.base64.isPadding_(a[b-2])?c-2:c-1);var d=new Uint8Array(c),e=0;goog.crypt.base64.decodeStringInternal_(a,function(a){d[e++]=a;});return d.subarray(0,e)};
	goog.crypt.base64.decodeStringInternal_=function(a,b){function c(b){for(;d<a.length;){var c=a.charAt(d++),e=goog.crypt.base64.charToByteMap_[c];if(null!=e)return e;if(!goog.string.isEmptyOrWhitespace(c))throw Error("Unknown base64 encoding at char: "+c);}return b}goog.crypt.base64.init_();for(var d=0;;){var e=c(-1),f=c(0),g=c(64),h=c(64);if(64===h&&-1===e)break;b(e<<2|f>>4);64!=g&&(b(f<<4&240|g>>2),64!=h&&b(g<<6&192|h));}};
	goog.crypt.base64.init_=function(){if(!goog.crypt.base64.charToByteMap_){goog.crypt.base64.charToByteMap_={};for(var a=goog.crypt.base64.DEFAULT_ALPHABET_COMMON_.split(""),b=["+/=","+/","-_=","-_.","-_"],c=0;5>c;c++){var d=a.concat(b[c].split(""));goog.crypt.base64.byteToCharMaps_[c]=d;for(var e=0;e<d.length;e++){var f=d[e],g=goog.crypt.base64.charToByteMap_[f];void 0===g?goog.crypt.base64.charToByteMap_[f]=e:goog.asserts.assert(g===e);}}}};jspb.utils={};jspb.utils.split64Low=0;jspb.utils.split64High=0;jspb.utils.splitUint64=function(a){var b=a>>>0;a=Math.floor((a-b)/jspb.BinaryConstants.TWO_TO_32)>>>0;jspb.utils.split64Low=b;jspb.utils.split64High=a;};jspb.utils.splitInt64=function(a){var b=0>a;a=Math.abs(a);var c=a>>>0;a=Math.floor((a-c)/jspb.BinaryConstants.TWO_TO_32);a>>>=0;b&&(a=~a>>>0,c=(~c>>>0)+1,4294967295<c&&(c=0,a++,4294967295<a&&(a=0)));jspb.utils.split64Low=c;jspb.utils.split64High=a;};
	jspb.utils.splitZigzag64=function(a){var b=0>a;a=2*Math.abs(a);jspb.utils.splitUint64(a);a=jspb.utils.split64Low;var c=jspb.utils.split64High;b&&(0==a?0==c?c=a=4294967295:(c--,a=4294967295):a--);jspb.utils.split64Low=a;jspb.utils.split64High=c;};
	jspb.utils.splitFloat32=function(a){var b=0>a?1:0;a=b?-a:a;if(0===a)0<1/a?(jspb.utils.split64High=0,jspb.utils.split64Low=0):(jspb.utils.split64High=0,jspb.utils.split64Low=2147483648);else if(isNaN(a))jspb.utils.split64High=0,jspb.utils.split64Low=2147483647;else if(a>jspb.BinaryConstants.FLOAT32_MAX)jspb.utils.split64High=0,jspb.utils.split64Low=(b<<31|2139095040)>>>0;else if(a<jspb.BinaryConstants.FLOAT32_MIN)a=Math.round(a/Math.pow(2,-149)),jspb.utils.split64High=0,jspb.utils.split64Low=(b<<31|
	a)>>>0;else {var c=Math.floor(Math.log(a)/Math.LN2);a*=Math.pow(2,-c);a=Math.round(a*jspb.BinaryConstants.TWO_TO_23);16777216<=a&&++c;jspb.utils.split64High=0;jspb.utils.split64Low=(b<<31|c+127<<23|a&8388607)>>>0;}};
	jspb.utils.splitFloat64=function(a){var b=0>a?1:0;a=b?-a:a;if(0===a)jspb.utils.split64High=0<1/a?0:2147483648,jspb.utils.split64Low=0;else if(isNaN(a))jspb.utils.split64High=2147483647,jspb.utils.split64Low=4294967295;else if(a>jspb.BinaryConstants.FLOAT64_MAX)jspb.utils.split64High=(b<<31|2146435072)>>>0,jspb.utils.split64Low=0;else if(a<jspb.BinaryConstants.FLOAT64_MIN){var c=a/Math.pow(2,-1074);a=c/jspb.BinaryConstants.TWO_TO_32;jspb.utils.split64High=(b<<31|a)>>>0;jspb.utils.split64Low=c>>>0;}else {c=
	a;var d=0;if(2<=c)for(;2<=c&&1023>d;)d++,c/=2;else for(;1>c&&-1022<d;)c*=2,d--;c=a*Math.pow(2,-d);a=c*jspb.BinaryConstants.TWO_TO_20&1048575;c=c*jspb.BinaryConstants.TWO_TO_52>>>0;jspb.utils.split64High=(b<<31|d+1023<<20|a)>>>0;jspb.utils.split64Low=c;}};
	jspb.utils.splitHash64=function(a){var b=a.charCodeAt(0),c=a.charCodeAt(1),d=a.charCodeAt(2),e=a.charCodeAt(3),f=a.charCodeAt(4),g=a.charCodeAt(5),h=a.charCodeAt(6);a=a.charCodeAt(7);jspb.utils.split64Low=b+(c<<8)+(d<<16)+(e<<24)>>>0;jspb.utils.split64High=f+(g<<8)+(h<<16)+(a<<24)>>>0;};jspb.utils.joinUint64=function(a,b){return b*jspb.BinaryConstants.TWO_TO_32+(a>>>0)};
	jspb.utils.joinInt64=function(a,b){var c=b&2147483648;c&&(a=~a+1>>>0,b=~b>>>0,0==a&&(b=b+1>>>0));a=jspb.utils.joinUint64(a,b);return c?-a:a};jspb.utils.toZigzag64=function(a,b,c){var d=b>>31;return c(a<<1^d,(b<<1|a>>>31)^d)};jspb.utils.joinZigzag64=function(a,b){return jspb.utils.fromZigzag64(a,b,jspb.utils.joinInt64)};jspb.utils.fromZigzag64=function(a,b,c){var d=-(a&1);return c((a>>>1|b<<31)^d,b>>>1^d)};
	jspb.utils.joinFloat32=function(a,b){b=2*(a>>31)+1;var c=a>>>23&255;a&=8388607;return 255==c?a?NaN:Infinity*b:0==c?b*Math.pow(2,-149)*a:b*Math.pow(2,c-150)*(a+Math.pow(2,23))};jspb.utils.joinFloat64=function(a,b){var c=2*(b>>31)+1,d=b>>>20&2047;a=jspb.BinaryConstants.TWO_TO_32*(b&1048575)+a;return 2047==d?a?NaN:Infinity*c:0==d?c*Math.pow(2,-1074)*a:c*Math.pow(2,d-1075)*(a+jspb.BinaryConstants.TWO_TO_52)};
	jspb.utils.joinHash64=function(a,b){return String.fromCharCode(a>>>0&255,a>>>8&255,a>>>16&255,a>>>24&255,b>>>0&255,b>>>8&255,b>>>16&255,b>>>24&255)};jspb.utils.DIGITS="0123456789abcdef".split("");jspb.utils.ZERO_CHAR_CODE_=48;jspb.utils.A_CHAR_CODE_=97;
	jspb.utils.joinUnsignedDecimalString=function(a,b){function c(a,b){a=a?String(a):"";return b?"0000000".slice(a.length)+a:a}if(2097151>=b)return ""+jspb.utils.joinUint64(a,b);var d=(a>>>24|b<<8)>>>0&16777215;b=b>>16&65535;a=(a&16777215)+6777216*d+6710656*b;d+=8147497*b;b*=2;1E7<=a&&(d+=Math.floor(a/1E7),a%=1E7);1E7<=d&&(b+=Math.floor(d/1E7),d%=1E7);return c(b,0)+c(d,b)+c(a,1)};
	jspb.utils.joinSignedDecimalString=function(a,b){var c=b&2147483648;c&&(a=~a+1>>>0,b=~b+(0==a?1:0)>>>0);a=jspb.utils.joinUnsignedDecimalString(a,b);return c?"-"+a:a};jspb.utils.hash64ToDecimalString=function(a,b){jspb.utils.splitHash64(a);a=jspb.utils.split64Low;var c=jspb.utils.split64High;return b?jspb.utils.joinSignedDecimalString(a,c):jspb.utils.joinUnsignedDecimalString(a,c)};
	jspb.utils.hash64ArrayToDecimalStrings=function(a,b){for(var c=Array(a.length),d=0;d<a.length;d++)c[d]=jspb.utils.hash64ToDecimalString(a[d],b);return c};
	jspb.utils.decimalStringToHash64=function(a){function b(a,b){for(var c=0;8>c&&(1!==a||0<b);c++)b=a*e[c]+b,e[c]=b&255,b>>>=8;}function c(){for(var a=0;8>a;a++)e[a]=~e[a]&255;}jspb.asserts.assert(0<a.length);var d=!1;"-"===a[0]&&(d=!0,a=a.slice(1));for(var e=[0,0,0,0,0,0,0,0],f=0;f<a.length;f++)b(10,a.charCodeAt(f)-jspb.utils.ZERO_CHAR_CODE_);d&&(c(),b(1,1));return goog.crypt.byteArrayToString(e)};jspb.utils.splitDecimalString=function(a){jspb.utils.splitHash64(jspb.utils.decimalStringToHash64(a));};
	jspb.utils.toHexDigit_=function(a){return String.fromCharCode(10>a?jspb.utils.ZERO_CHAR_CODE_+a:jspb.utils.A_CHAR_CODE_-10+a)};jspb.utils.fromHexCharCode_=function(a){return a>=jspb.utils.A_CHAR_CODE_?a-jspb.utils.A_CHAR_CODE_+10:a-jspb.utils.ZERO_CHAR_CODE_};jspb.utils.hash64ToHexString=function(a){var b=Array(18);b[0]="0";b[1]="x";for(var c=0;8>c;c++){var d=a.charCodeAt(7-c);b[2*c+2]=jspb.utils.toHexDigit_(d>>4);b[2*c+3]=jspb.utils.toHexDigit_(d&15);}return b.join("")};
	jspb.utils.hexStringToHash64=function(a){a=a.toLowerCase();jspb.asserts.assert(18==a.length);jspb.asserts.assert("0"==a[0]);jspb.asserts.assert("x"==a[1]);for(var b="",c=0;8>c;c++){var d=jspb.utils.fromHexCharCode_(a.charCodeAt(2*c+2)),e=jspb.utils.fromHexCharCode_(a.charCodeAt(2*c+3));b=String.fromCharCode(16*d+e)+b;}return b};
	jspb.utils.hash64ToNumber=function(a,b){jspb.utils.splitHash64(a);a=jspb.utils.split64Low;var c=jspb.utils.split64High;return b?jspb.utils.joinInt64(a,c):jspb.utils.joinUint64(a,c)};jspb.utils.numberToHash64=function(a){jspb.utils.splitInt64(a);return jspb.utils.joinHash64(jspb.utils.split64Low,jspb.utils.split64High)};jspb.utils.countVarints=function(a,b,c){for(var d=0,e=b;e<c;e++)d+=a[e]>>7;return c-b-d};
	jspb.utils.countVarintFields=function(a,b,c,d){var e=0;d=8*d+jspb.BinaryConstants.WireType.VARINT;if(128>d)for(;b<c&&a[b++]==d;)for(e++;;){var f=a[b++];if(0==(f&128))break}else for(;b<c;){for(f=d;128<f;){if(a[b]!=(f&127|128))return e;b++;f>>=7;}if(a[b++]!=f)break;for(e++;f=a[b++],0!=(f&128););}return e};jspb.utils.countFixedFields_=function(a,b,c,d,e){var f=0;if(128>d)for(;b<c&&a[b++]==d;)f++,b+=e;else for(;b<c;){for(var g=d;128<g;){if(a[b++]!=(g&127|128))return f;g>>=7;}if(a[b++]!=g)break;f++;b+=e;}return f};
	jspb.utils.countFixed32Fields=function(a,b,c,d){return jspb.utils.countFixedFields_(a,b,c,8*d+jspb.BinaryConstants.WireType.FIXED32,4)};jspb.utils.countFixed64Fields=function(a,b,c,d){return jspb.utils.countFixedFields_(a,b,c,8*d+jspb.BinaryConstants.WireType.FIXED64,8)};
	jspb.utils.countDelimitedFields=function(a,b,c,d){var e=0;for(d=8*d+jspb.BinaryConstants.WireType.DELIMITED;b<c;){for(var f=d;128<f;){if(a[b++]!=(f&127|128))return e;f>>=7;}if(a[b++]!=f)break;e++;for(var g=0,h=1;f=a[b++],g+=(f&127)*h,h*=128,0!=(f&128););b+=g;}return e};jspb.utils.debugBytesToTextFormat=function(a){var b='"';if(a){a=jspb.utils.byteSourceToUint8Array(a);for(var c=0;c<a.length;c++)b+="\\x",16>a[c]&&(b+="0"),b+=a[c].toString(16);}return b+'"'};
	jspb.utils.debugScalarToTextFormat=function(a){return "string"===typeof a?goog.string.quote(a):a.toString()};jspb.utils.stringToByteArray=function(a){for(var b=new Uint8Array(a.length),c=0;c<a.length;c++){var d=a.charCodeAt(c);if(255<d)throw Error("Conversion error: string contains codepoint outside of byte range");b[c]=d;}return b};
	jspb.utils.byteSourceToUint8Array=function(a){if(a.constructor===Uint8Array)return a;if(a.constructor===ArrayBuffer||a.constructor===Array)return new Uint8Array(a);if(a.constructor===String)return goog.crypt.base64.decodeStringToUint8Array(a);if(a instanceof Uint8Array)return new Uint8Array(a.buffer,a.byteOffset,a.byteLength);jspb.asserts.fail("Type not convertible to Uint8Array.");return new Uint8Array(0)};jspb.BinaryDecoder=function(a,b,c){this.bytes_=null;this.cursor_=this.end_=this.start_=0;this.error_=!1;a&&this.setBlock(a,b,c);};jspb.BinaryDecoder.instanceCache_=[];jspb.BinaryDecoder.alloc=function(a,b,c){if(jspb.BinaryDecoder.instanceCache_.length){var d=jspb.BinaryDecoder.instanceCache_.pop();a&&d.setBlock(a,b,c);return d}return new jspb.BinaryDecoder(a,b,c)};jspb.BinaryDecoder.prototype.free=function(){this.clear();100>jspb.BinaryDecoder.instanceCache_.length&&jspb.BinaryDecoder.instanceCache_.push(this);};
	jspb.BinaryDecoder.prototype.clone=function(){return jspb.BinaryDecoder.alloc(this.bytes_,this.start_,this.end_-this.start_)};jspb.BinaryDecoder.prototype.clear=function(){this.bytes_=null;this.cursor_=this.end_=this.start_=0;this.error_=!1;};jspb.BinaryDecoder.prototype.getBuffer=function(){return this.bytes_};
	jspb.BinaryDecoder.prototype.setBlock=function(a,b,c){this.bytes_=jspb.utils.byteSourceToUint8Array(a);this.start_=void 0!==b?b:0;this.end_=void 0!==c?this.start_+c:this.bytes_.length;this.cursor_=this.start_;};jspb.BinaryDecoder.prototype.getEnd=function(){return this.end_};jspb.BinaryDecoder.prototype.setEnd=function(a){this.end_=a;};jspb.BinaryDecoder.prototype.reset=function(){this.cursor_=this.start_;};jspb.BinaryDecoder.prototype.getCursor=function(){return this.cursor_};
	jspb.BinaryDecoder.prototype.setCursor=function(a){this.cursor_=a;};jspb.BinaryDecoder.prototype.advance=function(a){this.cursor_+=a;jspb.asserts.assert(this.cursor_<=this.end_);};jspb.BinaryDecoder.prototype.atEnd=function(){return this.cursor_==this.end_};jspb.BinaryDecoder.prototype.pastEnd=function(){return this.cursor_>this.end_};jspb.BinaryDecoder.prototype.getError=function(){return this.error_||0>this.cursor_||this.cursor_>this.end_};
	jspb.BinaryDecoder.prototype.readSplitVarint64=function(a){for(var b=128,c=0,d=0,e=0;4>e&&128<=b;e++)b=this.bytes_[this.cursor_++],c|=(b&127)<<7*e;128<=b&&(b=this.bytes_[this.cursor_++],c|=(b&127)<<28,d|=(b&127)>>4);if(128<=b)for(e=0;5>e&&128<=b;e++)b=this.bytes_[this.cursor_++],d|=(b&127)<<7*e+3;if(128>b)return a(c>>>0,d>>>0);jspb.asserts.fail("Failed to read varint, encoding is invalid.");this.error_=!0;};
	jspb.BinaryDecoder.prototype.readSplitZigzagVarint64=function(a){return this.readSplitVarint64(function(b,c){return jspb.utils.fromZigzag64(b,c,a)})};jspb.BinaryDecoder.prototype.readSplitFixed64=function(a){var b=this.bytes_,c=this.cursor_;this.cursor_+=8;for(var d=0,e=0,f=c+7;f>=c;f--)d=d<<8|b[f],e=e<<8|b[f+4];return a(d,e)};jspb.BinaryDecoder.prototype.skipVarint=function(){for(;this.bytes_[this.cursor_]&128;)this.cursor_++;this.cursor_++;};
	jspb.BinaryDecoder.prototype.unskipVarint=function(a){for(;128<a;)this.cursor_--,a>>>=7;this.cursor_--;};
	jspb.BinaryDecoder.prototype.readUnsignedVarint32=function(){var a=this.bytes_;var b=a[this.cursor_+0];var c=b&127;if(128>b)return this.cursor_+=1,jspb.asserts.assert(this.cursor_<=this.end_),c;b=a[this.cursor_+1];c|=(b&127)<<7;if(128>b)return this.cursor_+=2,jspb.asserts.assert(this.cursor_<=this.end_),c;b=a[this.cursor_+2];c|=(b&127)<<14;if(128>b)return this.cursor_+=3,jspb.asserts.assert(this.cursor_<=this.end_),c;b=a[this.cursor_+3];c|=(b&127)<<21;if(128>b)return this.cursor_+=4,jspb.asserts.assert(this.cursor_<=
	this.end_),c;b=a[this.cursor_+4];c|=(b&15)<<28;if(128>b)return this.cursor_+=5,jspb.asserts.assert(this.cursor_<=this.end_),c>>>0;this.cursor_+=5;128<=a[this.cursor_++]&&128<=a[this.cursor_++]&&128<=a[this.cursor_++]&&128<=a[this.cursor_++]&&128<=a[this.cursor_++]&&jspb.asserts.assert(!1);jspb.asserts.assert(this.cursor_<=this.end_);return c};jspb.BinaryDecoder.prototype.readSignedVarint32=function(){return ~~this.readUnsignedVarint32()};jspb.BinaryDecoder.prototype.readUnsignedVarint32String=function(){return this.readUnsignedVarint32().toString()};
	jspb.BinaryDecoder.prototype.readSignedVarint32String=function(){return this.readSignedVarint32().toString()};jspb.BinaryDecoder.prototype.readZigzagVarint32=function(){var a=this.readUnsignedVarint32();return a>>>1^-(a&1)};jspb.BinaryDecoder.prototype.readUnsignedVarint64=function(){return this.readSplitVarint64(jspb.utils.joinUint64)};jspb.BinaryDecoder.prototype.readUnsignedVarint64String=function(){return this.readSplitVarint64(jspb.utils.joinUnsignedDecimalString)};
	jspb.BinaryDecoder.prototype.readSignedVarint64=function(){return this.readSplitVarint64(jspb.utils.joinInt64)};jspb.BinaryDecoder.prototype.readSignedVarint64String=function(){return this.readSplitVarint64(jspb.utils.joinSignedDecimalString)};jspb.BinaryDecoder.prototype.readZigzagVarint64=function(){return this.readSplitVarint64(jspb.utils.joinZigzag64)};jspb.BinaryDecoder.prototype.readZigzagVarintHash64=function(){return this.readSplitZigzagVarint64(jspb.utils.joinHash64)};
	jspb.BinaryDecoder.prototype.readZigzagVarint64String=function(){return this.readSplitZigzagVarint64(jspb.utils.joinSignedDecimalString)};jspb.BinaryDecoder.prototype.readUint8=function(){var a=this.bytes_[this.cursor_+0];this.cursor_+=1;jspb.asserts.assert(this.cursor_<=this.end_);return a};jspb.BinaryDecoder.prototype.readUint16=function(){var a=this.bytes_[this.cursor_+0],b=this.bytes_[this.cursor_+1];this.cursor_+=2;jspb.asserts.assert(this.cursor_<=this.end_);return a<<0|b<<8};
	jspb.BinaryDecoder.prototype.readUint32=function(){var a=this.bytes_[this.cursor_+0],b=this.bytes_[this.cursor_+1],c=this.bytes_[this.cursor_+2],d=this.bytes_[this.cursor_+3];this.cursor_+=4;jspb.asserts.assert(this.cursor_<=this.end_);return (a<<0|b<<8|c<<16|d<<24)>>>0};jspb.BinaryDecoder.prototype.readUint64=function(){var a=this.readUint32(),b=this.readUint32();return jspb.utils.joinUint64(a,b)};
	jspb.BinaryDecoder.prototype.readUint64String=function(){var a=this.readUint32(),b=this.readUint32();return jspb.utils.joinUnsignedDecimalString(a,b)};jspb.BinaryDecoder.prototype.readInt8=function(){var a=this.bytes_[this.cursor_+0];this.cursor_+=1;jspb.asserts.assert(this.cursor_<=this.end_);return a<<24>>24};
	jspb.BinaryDecoder.prototype.readInt16=function(){var a=this.bytes_[this.cursor_+0],b=this.bytes_[this.cursor_+1];this.cursor_+=2;jspb.asserts.assert(this.cursor_<=this.end_);return (a<<0|b<<8)<<16>>16};jspb.BinaryDecoder.prototype.readInt32=function(){var a=this.bytes_[this.cursor_+0],b=this.bytes_[this.cursor_+1],c=this.bytes_[this.cursor_+2],d=this.bytes_[this.cursor_+3];this.cursor_+=4;jspb.asserts.assert(this.cursor_<=this.end_);return a<<0|b<<8|c<<16|d<<24};
	jspb.BinaryDecoder.prototype.readInt64=function(){var a=this.readUint32(),b=this.readUint32();return jspb.utils.joinInt64(a,b)};jspb.BinaryDecoder.prototype.readInt64String=function(){var a=this.readUint32(),b=this.readUint32();return jspb.utils.joinSignedDecimalString(a,b)};jspb.BinaryDecoder.prototype.readFloat=function(){var a=this.readUint32();return jspb.utils.joinFloat32(a,0)};
	jspb.BinaryDecoder.prototype.readDouble=function(){var a=this.readUint32(),b=this.readUint32();return jspb.utils.joinFloat64(a,b)};jspb.BinaryDecoder.prototype.readBool=function(){return !!this.bytes_[this.cursor_++]};jspb.BinaryDecoder.prototype.readEnum=function(){return this.readSignedVarint32()};
	jspb.BinaryDecoder.prototype.readString=function(a){var b=this.bytes_,c=this.cursor_;a=c+a;for(var d=[],e="";c<a;){var f=b[c++];if(128>f)d.push(f);else if(192>f)continue;else if(224>f){var g=b[c++];d.push((f&31)<<6|g&63);}else if(240>f){g=b[c++];var h=b[c++];d.push((f&15)<<12|(g&63)<<6|h&63);}else if(248>f){g=b[c++];h=b[c++];var k=b[c++];f=(f&7)<<18|(g&63)<<12|(h&63)<<6|k&63;f-=65536;d.push((f>>10&1023)+55296,(f&1023)+56320);}8192<=d.length&&(e+=String.fromCharCode.apply(null,d),d.length=0);}e+=goog.crypt.byteArrayToString(d);
	this.cursor_=c;return e};jspb.BinaryDecoder.prototype.readStringWithLength=function(){var a=this.readUnsignedVarint32();return this.readString(a)};jspb.BinaryDecoder.prototype.readBytes=function(a){if(0>a||this.cursor_+a>this.bytes_.length)return this.error_=!0,jspb.asserts.fail("Invalid byte length!"),new Uint8Array(0);var b=this.bytes_.subarray(this.cursor_,this.cursor_+a);this.cursor_+=a;jspb.asserts.assert(this.cursor_<=this.end_);return b};jspb.BinaryDecoder.prototype.readVarintHash64=function(){return this.readSplitVarint64(jspb.utils.joinHash64)};
	jspb.BinaryDecoder.prototype.readFixedHash64=function(){var a=this.bytes_,b=this.cursor_,c=a[b+0],d=a[b+1],e=a[b+2],f=a[b+3],g=a[b+4],h=a[b+5],k=a[b+6];a=a[b+7];this.cursor_+=8;return String.fromCharCode(c,d,e,f,g,h,k,a)};jspb.BinaryReader=function(a,b,c){this.decoder_=jspb.BinaryDecoder.alloc(a,b,c);this.fieldCursor_=this.decoder_.getCursor();this.nextField_=jspb.BinaryConstants.INVALID_FIELD_NUMBER;this.nextWireType_=jspb.BinaryConstants.WireType.INVALID;this.error_=!1;this.readCallbacks_=null;};jspb.BinaryReader.instanceCache_=[];
	jspb.BinaryReader.alloc=function(a,b,c){if(jspb.BinaryReader.instanceCache_.length){var d=jspb.BinaryReader.instanceCache_.pop();a&&d.decoder_.setBlock(a,b,c);return d}return new jspb.BinaryReader(a,b,c)};jspb.BinaryReader.prototype.alloc=jspb.BinaryReader.alloc;
	jspb.BinaryReader.prototype.free=function(){this.decoder_.clear();this.nextField_=jspb.BinaryConstants.INVALID_FIELD_NUMBER;this.nextWireType_=jspb.BinaryConstants.WireType.INVALID;this.error_=!1;this.readCallbacks_=null;100>jspb.BinaryReader.instanceCache_.length&&jspb.BinaryReader.instanceCache_.push(this);};jspb.BinaryReader.prototype.getFieldCursor=function(){return this.fieldCursor_};jspb.BinaryReader.prototype.getCursor=function(){return this.decoder_.getCursor()};
	jspb.BinaryReader.prototype.getBuffer=function(){return this.decoder_.getBuffer()};jspb.BinaryReader.prototype.getFieldNumber=function(){return this.nextField_};goog.exportProperty(jspb.BinaryReader.prototype,"getFieldNumber",jspb.BinaryReader.prototype.getFieldNumber);jspb.BinaryReader.prototype.getWireType=function(){return this.nextWireType_};jspb.BinaryReader.prototype.isDelimited=function(){return this.nextWireType_==jspb.BinaryConstants.WireType.DELIMITED};
	goog.exportProperty(jspb.BinaryReader.prototype,"isDelimited",jspb.BinaryReader.prototype.isDelimited);jspb.BinaryReader.prototype.isEndGroup=function(){return this.nextWireType_==jspb.BinaryConstants.WireType.END_GROUP};goog.exportProperty(jspb.BinaryReader.prototype,"isEndGroup",jspb.BinaryReader.prototype.isEndGroup);jspb.BinaryReader.prototype.getError=function(){return this.error_||this.decoder_.getError()};
	jspb.BinaryReader.prototype.setBlock=function(a,b,c){this.decoder_.setBlock(a,b,c);this.nextField_=jspb.BinaryConstants.INVALID_FIELD_NUMBER;this.nextWireType_=jspb.BinaryConstants.WireType.INVALID;};jspb.BinaryReader.prototype.reset=function(){this.decoder_.reset();this.nextField_=jspb.BinaryConstants.INVALID_FIELD_NUMBER;this.nextWireType_=jspb.BinaryConstants.WireType.INVALID;};jspb.BinaryReader.prototype.advance=function(a){this.decoder_.advance(a);};
	jspb.BinaryReader.prototype.nextField=function(){if(this.decoder_.atEnd())return !1;if(this.getError())return jspb.asserts.fail("Decoder hit an error"),!1;this.fieldCursor_=this.decoder_.getCursor();var a=this.decoder_.readUnsignedVarint32(),b=a>>>3;a&=7;if(a!=jspb.BinaryConstants.WireType.VARINT&&a!=jspb.BinaryConstants.WireType.FIXED32&&a!=jspb.BinaryConstants.WireType.FIXED64&&a!=jspb.BinaryConstants.WireType.DELIMITED&&a!=jspb.BinaryConstants.WireType.START_GROUP&&a!=jspb.BinaryConstants.WireType.END_GROUP)return jspb.asserts.fail("Invalid wire type: %s (at position %s)",
	a,this.fieldCursor_),this.error_=!0,!1;this.nextField_=b;this.nextWireType_=a;return !0};goog.exportProperty(jspb.BinaryReader.prototype,"nextField",jspb.BinaryReader.prototype.nextField);jspb.BinaryReader.prototype.unskipHeader=function(){this.decoder_.unskipVarint(this.nextField_<<3|this.nextWireType_);};jspb.BinaryReader.prototype.skipMatchingFields=function(){var a=this.nextField_;for(this.unskipHeader();this.nextField()&&this.getFieldNumber()==a;)this.skipField();this.decoder_.atEnd()||this.unskipHeader();};
	jspb.BinaryReader.prototype.skipVarintField=function(){this.nextWireType_!=jspb.BinaryConstants.WireType.VARINT?(jspb.asserts.fail("Invalid wire type for skipVarintField"),this.skipField()):this.decoder_.skipVarint();};jspb.BinaryReader.prototype.skipDelimitedField=function(){if(this.nextWireType_!=jspb.BinaryConstants.WireType.DELIMITED)jspb.asserts.fail("Invalid wire type for skipDelimitedField"),this.skipField();else {var a=this.decoder_.readUnsignedVarint32();this.decoder_.advance(a);}};
	jspb.BinaryReader.prototype.skipFixed32Field=function(){this.nextWireType_!=jspb.BinaryConstants.WireType.FIXED32?(jspb.asserts.fail("Invalid wire type for skipFixed32Field"),this.skipField()):this.decoder_.advance(4);};jspb.BinaryReader.prototype.skipFixed64Field=function(){this.nextWireType_!=jspb.BinaryConstants.WireType.FIXED64?(jspb.asserts.fail("Invalid wire type for skipFixed64Field"),this.skipField()):this.decoder_.advance(8);};
	jspb.BinaryReader.prototype.skipGroup=function(){var a=this.nextField_;do{if(!this.nextField()){jspb.asserts.fail("Unmatched start-group tag: stream EOF");this.error_=!0;break}if(this.nextWireType_==jspb.BinaryConstants.WireType.END_GROUP){this.nextField_!=a&&(jspb.asserts.fail("Unmatched end-group tag"),this.error_=!0);break}this.skipField();}while(1)};
	jspb.BinaryReader.prototype.skipField=function(){switch(this.nextWireType_){case jspb.BinaryConstants.WireType.VARINT:this.skipVarintField();break;case jspb.BinaryConstants.WireType.FIXED64:this.skipFixed64Field();break;case jspb.BinaryConstants.WireType.DELIMITED:this.skipDelimitedField();break;case jspb.BinaryConstants.WireType.FIXED32:this.skipFixed32Field();break;case jspb.BinaryConstants.WireType.START_GROUP:this.skipGroup();break;default:jspb.asserts.fail("Invalid wire encoding for field.");}};
	jspb.BinaryReader.prototype.registerReadCallback=function(a,b){null===this.readCallbacks_&&(this.readCallbacks_={});jspb.asserts.assert(!this.readCallbacks_[a]);this.readCallbacks_[a]=b;};jspb.BinaryReader.prototype.runReadCallback=function(a){jspb.asserts.assert(null!==this.readCallbacks_);a=this.readCallbacks_[a];jspb.asserts.assert(a);return a(this)};
	jspb.BinaryReader.prototype.readAny=function(a){this.nextWireType_=jspb.BinaryConstants.FieldTypeToWireType(a);var b=jspb.BinaryConstants.FieldType;switch(a){case b.DOUBLE:return this.readDouble();case b.FLOAT:return this.readFloat();case b.INT64:return this.readInt64();case b.UINT64:return this.readUint64();case b.INT32:return this.readInt32();case b.FIXED64:return this.readFixed64();case b.FIXED32:return this.readFixed32();case b.BOOL:return this.readBool();case b.STRING:return this.readString();
	case b.GROUP:jspb.asserts.fail("Group field type not supported in readAny()");case b.MESSAGE:jspb.asserts.fail("Message field type not supported in readAny()");case b.BYTES:return this.readBytes();case b.UINT32:return this.readUint32();case b.ENUM:return this.readEnum();case b.SFIXED32:return this.readSfixed32();case b.SFIXED64:return this.readSfixed64();case b.SINT32:return this.readSint32();case b.SINT64:return this.readSint64();case b.FHASH64:return this.readFixedHash64();case b.VHASH64:return this.readVarintHash64();
	default:jspb.asserts.fail("Invalid field type in readAny()");}return 0};jspb.BinaryReader.prototype.readMessage=function(a,b){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.DELIMITED);var c=this.decoder_.getEnd(),d=this.decoder_.readUnsignedVarint32();d=this.decoder_.getCursor()+d;this.decoder_.setEnd(d);b(a,this);this.decoder_.setCursor(d);this.decoder_.setEnd(c);};goog.exportProperty(jspb.BinaryReader.prototype,"readMessage",jspb.BinaryReader.prototype.readMessage);
	jspb.BinaryReader.prototype.readGroup=function(a,b,c){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.START_GROUP);jspb.asserts.assert(this.nextField_==a);c(b,this);this.error_||this.nextWireType_==jspb.BinaryConstants.WireType.END_GROUP||(jspb.asserts.fail("Group submessage did not end with an END_GROUP tag"),this.error_=!0);};goog.exportProperty(jspb.BinaryReader.prototype,"readGroup",jspb.BinaryReader.prototype.readGroup);
	jspb.BinaryReader.prototype.getFieldDecoder=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.DELIMITED);var a=this.decoder_.readUnsignedVarint32(),b=this.decoder_.getCursor(),c=b+a;a=jspb.BinaryDecoder.alloc(this.decoder_.getBuffer(),b,a);this.decoder_.setCursor(c);return a};jspb.BinaryReader.prototype.readInt32=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readSignedVarint32()};
	goog.exportProperty(jspb.BinaryReader.prototype,"readInt32",jspb.BinaryReader.prototype.readInt32);jspb.BinaryReader.prototype.readInt32String=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readSignedVarint32String()};jspb.BinaryReader.prototype.readInt64=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readSignedVarint64()};
	goog.exportProperty(jspb.BinaryReader.prototype,"readInt64",jspb.BinaryReader.prototype.readInt64);jspb.BinaryReader.prototype.readInt64String=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readSignedVarint64String()};jspb.BinaryReader.prototype.readUint32=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readUnsignedVarint32()};
	goog.exportProperty(jspb.BinaryReader.prototype,"readUint32",jspb.BinaryReader.prototype.readUint32);jspb.BinaryReader.prototype.readUint32String=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readUnsignedVarint32String()};jspb.BinaryReader.prototype.readUint64=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readUnsignedVarint64()};
	goog.exportProperty(jspb.BinaryReader.prototype,"readUint64",jspb.BinaryReader.prototype.readUint64);jspb.BinaryReader.prototype.readUint64String=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readUnsignedVarint64String()};jspb.BinaryReader.prototype.readSint32=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readZigzagVarint32()};
	goog.exportProperty(jspb.BinaryReader.prototype,"readSint32",jspb.BinaryReader.prototype.readSint32);jspb.BinaryReader.prototype.readSint64=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readZigzagVarint64()};goog.exportProperty(jspb.BinaryReader.prototype,"readSint64",jspb.BinaryReader.prototype.readSint64);
	jspb.BinaryReader.prototype.readSint64String=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readZigzagVarint64String()};jspb.BinaryReader.prototype.readFixed32=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED32);return this.decoder_.readUint32()};goog.exportProperty(jspb.BinaryReader.prototype,"readFixed32",jspb.BinaryReader.prototype.readFixed32);
	jspb.BinaryReader.prototype.readFixed64=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readUint64()};goog.exportProperty(jspb.BinaryReader.prototype,"readFixed64",jspb.BinaryReader.prototype.readFixed64);jspb.BinaryReader.prototype.readFixed64String=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readUint64String()};
	jspb.BinaryReader.prototype.readSfixed32=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED32);return this.decoder_.readInt32()};goog.exportProperty(jspb.BinaryReader.prototype,"readSfixed32",jspb.BinaryReader.prototype.readSfixed32);jspb.BinaryReader.prototype.readSfixed32String=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED32);return this.decoder_.readInt32().toString()};
	jspb.BinaryReader.prototype.readSfixed64=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readInt64()};goog.exportProperty(jspb.BinaryReader.prototype,"readSfixed64",jspb.BinaryReader.prototype.readSfixed64);jspb.BinaryReader.prototype.readSfixed64String=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readInt64String()};
	jspb.BinaryReader.prototype.readFloat=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED32);return this.decoder_.readFloat()};goog.exportProperty(jspb.BinaryReader.prototype,"readFloat",jspb.BinaryReader.prototype.readFloat);jspb.BinaryReader.prototype.readDouble=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readDouble()};goog.exportProperty(jspb.BinaryReader.prototype,"readDouble",jspb.BinaryReader.prototype.readDouble);
	jspb.BinaryReader.prototype.readBool=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return !!this.decoder_.readUnsignedVarint32()};goog.exportProperty(jspb.BinaryReader.prototype,"readBool",jspb.BinaryReader.prototype.readBool);jspb.BinaryReader.prototype.readEnum=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readSignedVarint64()};goog.exportProperty(jspb.BinaryReader.prototype,"readEnum",jspb.BinaryReader.prototype.readEnum);
	jspb.BinaryReader.prototype.readString=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.DELIMITED);var a=this.decoder_.readUnsignedVarint32();return this.decoder_.readString(a)};goog.exportProperty(jspb.BinaryReader.prototype,"readString",jspb.BinaryReader.prototype.readString);jspb.BinaryReader.prototype.readBytes=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.DELIMITED);var a=this.decoder_.readUnsignedVarint32();return this.decoder_.readBytes(a)};
	goog.exportProperty(jspb.BinaryReader.prototype,"readBytes",jspb.BinaryReader.prototype.readBytes);jspb.BinaryReader.prototype.readVarintHash64=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readVarintHash64()};jspb.BinaryReader.prototype.readSintHash64=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readZigzagVarintHash64()};
	jspb.BinaryReader.prototype.readSplitVarint64=function(a){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readSplitVarint64(a)};jspb.BinaryReader.prototype.readSplitZigzagVarint64=function(a){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readSplitVarint64(function(b,c){return jspb.utils.fromZigzag64(b,c,a)})};
	jspb.BinaryReader.prototype.readFixedHash64=function(){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readFixedHash64()};jspb.BinaryReader.prototype.readSplitFixed64=function(a){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readSplitFixed64(a)};
	jspb.BinaryReader.prototype.readPackedField_=function(a){jspb.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.DELIMITED);var b=this.decoder_.readUnsignedVarint32();b=this.decoder_.getCursor()+b;for(var c=[];this.decoder_.getCursor()<b;)c.push(a.call(this.decoder_));return c};jspb.BinaryReader.prototype.readPackedInt32=function(){return this.readPackedField_(this.decoder_.readSignedVarint32)};goog.exportProperty(jspb.BinaryReader.prototype,"readPackedInt32",jspb.BinaryReader.prototype.readPackedInt32);
	jspb.BinaryReader.prototype.readPackedInt32String=function(){return this.readPackedField_(this.decoder_.readSignedVarint32String)};jspb.BinaryReader.prototype.readPackedInt64=function(){return this.readPackedField_(this.decoder_.readSignedVarint64)};goog.exportProperty(jspb.BinaryReader.prototype,"readPackedInt64",jspb.BinaryReader.prototype.readPackedInt64);jspb.BinaryReader.prototype.readPackedInt64String=function(){return this.readPackedField_(this.decoder_.readSignedVarint64String)};
	jspb.BinaryReader.prototype.readPackedUint32=function(){return this.readPackedField_(this.decoder_.readUnsignedVarint32)};goog.exportProperty(jspb.BinaryReader.prototype,"readPackedUint32",jspb.BinaryReader.prototype.readPackedUint32);jspb.BinaryReader.prototype.readPackedUint32String=function(){return this.readPackedField_(this.decoder_.readUnsignedVarint32String)};jspb.BinaryReader.prototype.readPackedUint64=function(){return this.readPackedField_(this.decoder_.readUnsignedVarint64)};
	goog.exportProperty(jspb.BinaryReader.prototype,"readPackedUint64",jspb.BinaryReader.prototype.readPackedUint64);jspb.BinaryReader.prototype.readPackedUint64String=function(){return this.readPackedField_(this.decoder_.readUnsignedVarint64String)};jspb.BinaryReader.prototype.readPackedSint32=function(){return this.readPackedField_(this.decoder_.readZigzagVarint32)};goog.exportProperty(jspb.BinaryReader.prototype,"readPackedSint32",jspb.BinaryReader.prototype.readPackedSint32);
	jspb.BinaryReader.prototype.readPackedSint64=function(){return this.readPackedField_(this.decoder_.readZigzagVarint64)};goog.exportProperty(jspb.BinaryReader.prototype,"readPackedSint64",jspb.BinaryReader.prototype.readPackedSint64);jspb.BinaryReader.prototype.readPackedSint64String=function(){return this.readPackedField_(this.decoder_.readZigzagVarint64String)};jspb.BinaryReader.prototype.readPackedFixed32=function(){return this.readPackedField_(this.decoder_.readUint32)};
	goog.exportProperty(jspb.BinaryReader.prototype,"readPackedFixed32",jspb.BinaryReader.prototype.readPackedFixed32);jspb.BinaryReader.prototype.readPackedFixed64=function(){return this.readPackedField_(this.decoder_.readUint64)};goog.exportProperty(jspb.BinaryReader.prototype,"readPackedFixed64",jspb.BinaryReader.prototype.readPackedFixed64);jspb.BinaryReader.prototype.readPackedFixed64String=function(){return this.readPackedField_(this.decoder_.readUint64String)};
	jspb.BinaryReader.prototype.readPackedSfixed32=function(){return this.readPackedField_(this.decoder_.readInt32)};goog.exportProperty(jspb.BinaryReader.prototype,"readPackedSfixed32",jspb.BinaryReader.prototype.readPackedSfixed32);jspb.BinaryReader.prototype.readPackedSfixed64=function(){return this.readPackedField_(this.decoder_.readInt64)};goog.exportProperty(jspb.BinaryReader.prototype,"readPackedSfixed64",jspb.BinaryReader.prototype.readPackedSfixed64);
	jspb.BinaryReader.prototype.readPackedSfixed64String=function(){return this.readPackedField_(this.decoder_.readInt64String)};jspb.BinaryReader.prototype.readPackedFloat=function(){return this.readPackedField_(this.decoder_.readFloat)};goog.exportProperty(jspb.BinaryReader.prototype,"readPackedFloat",jspb.BinaryReader.prototype.readPackedFloat);jspb.BinaryReader.prototype.readPackedDouble=function(){return this.readPackedField_(this.decoder_.readDouble)};
	goog.exportProperty(jspb.BinaryReader.prototype,"readPackedDouble",jspb.BinaryReader.prototype.readPackedDouble);jspb.BinaryReader.prototype.readPackedBool=function(){return this.readPackedField_(this.decoder_.readBool)};goog.exportProperty(jspb.BinaryReader.prototype,"readPackedBool",jspb.BinaryReader.prototype.readPackedBool);jspb.BinaryReader.prototype.readPackedEnum=function(){return this.readPackedField_(this.decoder_.readEnum)};
	goog.exportProperty(jspb.BinaryReader.prototype,"readPackedEnum",jspb.BinaryReader.prototype.readPackedEnum);jspb.BinaryReader.prototype.readPackedVarintHash64=function(){return this.readPackedField_(this.decoder_.readVarintHash64)};jspb.BinaryReader.prototype.readPackedFixedHash64=function(){return this.readPackedField_(this.decoder_.readFixedHash64)};jspb.BinaryEncoder=function(){this.buffer_=[];};jspb.BinaryEncoder.prototype.length=function(){return this.buffer_.length};jspb.BinaryEncoder.prototype.end=function(){var a=this.buffer_;this.buffer_=[];return a};
	jspb.BinaryEncoder.prototype.writeSplitVarint64=function(a,b){jspb.asserts.assert(a==Math.floor(a));jspb.asserts.assert(b==Math.floor(b));jspb.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_32);for(jspb.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_32);0<b||127<a;)this.buffer_.push(a&127|128),a=(a>>>7|b<<25)>>>0,b>>>=7;this.buffer_.push(a);};
	jspb.BinaryEncoder.prototype.writeSplitFixed64=function(a,b){jspb.asserts.assert(a==Math.floor(a));jspb.asserts.assert(b==Math.floor(b));jspb.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_32);jspb.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_32);this.writeUint32(a);this.writeUint32(b);};
	jspb.BinaryEncoder.prototype.writeUnsignedVarint32=function(a){jspb.asserts.assert(a==Math.floor(a));for(jspb.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_32);127<a;)this.buffer_.push(a&127|128),a>>>=7;this.buffer_.push(a);};
	jspb.BinaryEncoder.prototype.writeSignedVarint32=function(a){jspb.asserts.assert(a==Math.floor(a));jspb.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_31&&a<jspb.BinaryConstants.TWO_TO_31);if(0<=a)this.writeUnsignedVarint32(a);else {for(var b=0;9>b;b++)this.buffer_.push(a&127|128),a>>=7;this.buffer_.push(1);}};
	jspb.BinaryEncoder.prototype.writeUnsignedVarint64=function(a){jspb.asserts.assert(a==Math.floor(a));jspb.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_64);jspb.utils.splitInt64(a);this.writeSplitVarint64(jspb.utils.split64Low,jspb.utils.split64High);};
	jspb.BinaryEncoder.prototype.writeSignedVarint64=function(a){jspb.asserts.assert(a==Math.floor(a));jspb.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_63&&a<jspb.BinaryConstants.TWO_TO_63);jspb.utils.splitInt64(a);this.writeSplitVarint64(jspb.utils.split64Low,jspb.utils.split64High);};
	jspb.BinaryEncoder.prototype.writeZigzagVarint32=function(a){jspb.asserts.assert(a==Math.floor(a));jspb.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_31&&a<jspb.BinaryConstants.TWO_TO_31);this.writeUnsignedVarint32((a<<1^a>>31)>>>0);};jspb.BinaryEncoder.prototype.writeZigzagVarint64=function(a){jspb.asserts.assert(a==Math.floor(a));jspb.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_63&&a<jspb.BinaryConstants.TWO_TO_63);jspb.utils.splitZigzag64(a);this.writeSplitVarint64(jspb.utils.split64Low,jspb.utils.split64High);};
	jspb.BinaryEncoder.prototype.writeZigzagVarint64String=function(a){this.writeZigzagVarintHash64(jspb.utils.decimalStringToHash64(a));};jspb.BinaryEncoder.prototype.writeZigzagVarintHash64=function(a){var b=this;jspb.utils.splitHash64(a);jspb.utils.toZigzag64(jspb.utils.split64Low,jspb.utils.split64High,function(a,d){b.writeSplitVarint64(a>>>0,d>>>0);});};
	jspb.BinaryEncoder.prototype.writeUint8=function(a){jspb.asserts.assert(a==Math.floor(a));jspb.asserts.assert(0<=a&&256>a);this.buffer_.push(a>>>0&255);};jspb.BinaryEncoder.prototype.writeUint16=function(a){jspb.asserts.assert(a==Math.floor(a));jspb.asserts.assert(0<=a&&65536>a);this.buffer_.push(a>>>0&255);this.buffer_.push(a>>>8&255);};
	jspb.BinaryEncoder.prototype.writeUint32=function(a){jspb.asserts.assert(a==Math.floor(a));jspb.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_32);this.buffer_.push(a>>>0&255);this.buffer_.push(a>>>8&255);this.buffer_.push(a>>>16&255);this.buffer_.push(a>>>24&255);};jspb.BinaryEncoder.prototype.writeUint64=function(a){jspb.asserts.assert(a==Math.floor(a));jspb.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_64);jspb.utils.splitUint64(a);this.writeUint32(jspb.utils.split64Low);this.writeUint32(jspb.utils.split64High);};
	jspb.BinaryEncoder.prototype.writeInt8=function(a){jspb.asserts.assert(a==Math.floor(a));jspb.asserts.assert(-128<=a&&128>a);this.buffer_.push(a>>>0&255);};jspb.BinaryEncoder.prototype.writeInt16=function(a){jspb.asserts.assert(a==Math.floor(a));jspb.asserts.assert(-32768<=a&&32768>a);this.buffer_.push(a>>>0&255);this.buffer_.push(a>>>8&255);};
	jspb.BinaryEncoder.prototype.writeInt32=function(a){jspb.asserts.assert(a==Math.floor(a));jspb.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_31&&a<jspb.BinaryConstants.TWO_TO_31);this.buffer_.push(a>>>0&255);this.buffer_.push(a>>>8&255);this.buffer_.push(a>>>16&255);this.buffer_.push(a>>>24&255);};
	jspb.BinaryEncoder.prototype.writeInt64=function(a){jspb.asserts.assert(a==Math.floor(a));jspb.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_63&&a<jspb.BinaryConstants.TWO_TO_63);jspb.utils.splitInt64(a);this.writeSplitFixed64(jspb.utils.split64Low,jspb.utils.split64High);};
	jspb.BinaryEncoder.prototype.writeInt64String=function(a){jspb.asserts.assert(a==Math.floor(a));jspb.asserts.assert(+a>=-jspb.BinaryConstants.TWO_TO_63&&+a<jspb.BinaryConstants.TWO_TO_63);jspb.utils.splitHash64(jspb.utils.decimalStringToHash64(a));this.writeSplitFixed64(jspb.utils.split64Low,jspb.utils.split64High);};
	jspb.BinaryEncoder.prototype.writeFloat=function(a){jspb.asserts.assert(Infinity===a||-Infinity===a||isNaN(a)||a>=-jspb.BinaryConstants.FLOAT32_MAX&&a<=jspb.BinaryConstants.FLOAT32_MAX);jspb.utils.splitFloat32(a);this.writeUint32(jspb.utils.split64Low);};
	jspb.BinaryEncoder.prototype.writeDouble=function(a){jspb.asserts.assert(Infinity===a||-Infinity===a||isNaN(a)||a>=-jspb.BinaryConstants.FLOAT64_MAX&&a<=jspb.BinaryConstants.FLOAT64_MAX);jspb.utils.splitFloat64(a);this.writeUint32(jspb.utils.split64Low);this.writeUint32(jspb.utils.split64High);};jspb.BinaryEncoder.prototype.writeBool=function(a){jspb.asserts.assert("boolean"===typeof a||"number"===typeof a);this.buffer_.push(a?1:0);};
	jspb.BinaryEncoder.prototype.writeEnum=function(a){jspb.asserts.assert(a==Math.floor(a));jspb.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_31&&a<jspb.BinaryConstants.TWO_TO_31);this.writeSignedVarint32(a);};jspb.BinaryEncoder.prototype.writeBytes=function(a){this.buffer_.push.apply(this.buffer_,a);};jspb.BinaryEncoder.prototype.writeVarintHash64=function(a){jspb.utils.splitHash64(a);this.writeSplitVarint64(jspb.utils.split64Low,jspb.utils.split64High);};
	jspb.BinaryEncoder.prototype.writeFixedHash64=function(a){jspb.utils.splitHash64(a);this.writeUint32(jspb.utils.split64Low);this.writeUint32(jspb.utils.split64High);};
	jspb.BinaryEncoder.prototype.writeString=function(a){var b=this.buffer_.length;jspb.asserts.assertString(a);for(var c=0;c<a.length;c++){var d=a.charCodeAt(c);if(128>d)this.buffer_.push(d);else if(2048>d)this.buffer_.push(d>>6|192),this.buffer_.push(d&63|128);else if(65536>d)if(55296<=d&&56319>=d&&c+1<a.length){var e=a.charCodeAt(c+1);56320<=e&&57343>=e&&(d=1024*(d-55296)+e-56320+65536,this.buffer_.push(d>>18|240),this.buffer_.push(d>>12&63|128),this.buffer_.push(d>>6&63|128),this.buffer_.push(d&63|
	128),c++);}else this.buffer_.push(d>>12|224),this.buffer_.push(d>>6&63|128),this.buffer_.push(d&63|128);}return this.buffer_.length-b};jspb.arith={};jspb.arith.UInt64=function(a,b){this.lo=a;this.hi=b;};jspb.arith.UInt64.prototype.cmp=function(a){return this.hi<a.hi||this.hi==a.hi&&this.lo<a.lo?-1:this.hi==a.hi&&this.lo==a.lo?0:1};jspb.arith.UInt64.prototype.rightShift=function(){return new jspb.arith.UInt64((this.lo>>>1|(this.hi&1)<<31)>>>0,this.hi>>>1>>>0)};jspb.arith.UInt64.prototype.leftShift=function(){return new jspb.arith.UInt64(this.lo<<1>>>0,(this.hi<<1|this.lo>>>31)>>>0)};
	jspb.arith.UInt64.prototype.msb=function(){return !!(this.hi&2147483648)};jspb.arith.UInt64.prototype.lsb=function(){return !!(this.lo&1)};jspb.arith.UInt64.prototype.zero=function(){return 0==this.lo&&0==this.hi};jspb.arith.UInt64.prototype.add=function(a){return new jspb.arith.UInt64((this.lo+a.lo&4294967295)>>>0>>>0,((this.hi+a.hi&4294967295)>>>0)+(4294967296<=this.lo+a.lo?1:0)>>>0)};
	jspb.arith.UInt64.prototype.sub=function(a){return new jspb.arith.UInt64((this.lo-a.lo&4294967295)>>>0>>>0,((this.hi-a.hi&4294967295)>>>0)-(0>this.lo-a.lo?1:0)>>>0)};jspb.arith.UInt64.mul32x32=function(a,b){var c=a&65535;a>>>=16;var d=b&65535,e=b>>>16;b=c*d+65536*(c*e&65535)+65536*(a*d&65535);for(c=a*e+(c*e>>>16)+(a*d>>>16);4294967296<=b;)b-=4294967296,c+=1;return new jspb.arith.UInt64(b>>>0,c>>>0)};
	jspb.arith.UInt64.prototype.mul=function(a){var b=jspb.arith.UInt64.mul32x32(this.lo,a);a=jspb.arith.UInt64.mul32x32(this.hi,a);a.hi=a.lo;a.lo=0;return b.add(a)};
	jspb.arith.UInt64.prototype.div=function(a){if(0==a)return [];var b=new jspb.arith.UInt64(0,0),c=new jspb.arith.UInt64(this.lo,this.hi);a=new jspb.arith.UInt64(a,0);for(var d=new jspb.arith.UInt64(1,0);!a.msb();)a=a.leftShift(),d=d.leftShift();for(;!d.zero();)0>=a.cmp(c)&&(b=b.add(d),c=c.sub(a)),a=a.rightShift(),d=d.rightShift();return [b,c]};jspb.arith.UInt64.prototype.toString=function(){for(var a="",b=this;!b.zero();){b=b.div(10);var c=b[0];a=b[1].lo+a;b=c;}""==a&&(a="0");return a};
	jspb.arith.UInt64.fromString=function(a){for(var b=new jspb.arith.UInt64(0,0),c=new jspb.arith.UInt64(0,0),d=0;d<a.length;d++){if("0">a[d]||"9"<a[d])return null;var e=parseInt(a[d],10);c.lo=e;b=b.mul(10).add(c);}return b};jspb.arith.UInt64.prototype.clone=function(){return new jspb.arith.UInt64(this.lo,this.hi)};jspb.arith.Int64=function(a,b){this.lo=a;this.hi=b;};
	jspb.arith.Int64.prototype.add=function(a){return new jspb.arith.Int64((this.lo+a.lo&4294967295)>>>0>>>0,((this.hi+a.hi&4294967295)>>>0)+(4294967296<=this.lo+a.lo?1:0)>>>0)};jspb.arith.Int64.prototype.sub=function(a){return new jspb.arith.Int64((this.lo-a.lo&4294967295)>>>0>>>0,((this.hi-a.hi&4294967295)>>>0)-(0>this.lo-a.lo?1:0)>>>0)};jspb.arith.Int64.prototype.clone=function(){return new jspb.arith.Int64(this.lo,this.hi)};
	jspb.arith.Int64.prototype.toString=function(){var a=0!=(this.hi&2147483648),b=new jspb.arith.UInt64(this.lo,this.hi);a&&(b=(new jspb.arith.UInt64(0,0)).sub(b));return (a?"-":"")+b.toString()};jspb.arith.Int64.fromString=function(a){var b=0<a.length&&"-"==a[0];b&&(a=a.substring(1));a=jspb.arith.UInt64.fromString(a);if(null===a)return null;b&&(a=(new jspb.arith.UInt64(0,0)).sub(a));return new jspb.arith.Int64(a.lo,a.hi)};jspb.BinaryWriter=function(){this.blocks_=[];this.totalLength_=0;this.encoder_=new jspb.BinaryEncoder;this.bookmarks_=[];};jspb.BinaryWriter.prototype.appendUint8Array_=function(a){var b=this.encoder_.end();this.blocks_.push(b);this.blocks_.push(a);this.totalLength_+=b.length+a.length;};
	jspb.BinaryWriter.prototype.beginDelimited_=function(a){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);a=this.encoder_.end();this.blocks_.push(a);this.totalLength_+=a.length;a.push(this.totalLength_);return a};jspb.BinaryWriter.prototype.endDelimited_=function(a){var b=a.pop();b=this.totalLength_+this.encoder_.length()-b;for(jspb.asserts.assert(0<=b);127<b;)a.push(b&127|128),b>>>=7,this.totalLength_++;a.push(b);this.totalLength_++;};
	jspb.BinaryWriter.prototype.writeSerializedMessage=function(a,b,c){this.appendUint8Array_(a.subarray(b,c));};jspb.BinaryWriter.prototype.maybeWriteSerializedMessage=function(a,b,c){null!=a&&null!=b&&null!=c&&this.writeSerializedMessage(a,b,c);};jspb.BinaryWriter.prototype.reset=function(){this.blocks_=[];this.encoder_.end();this.totalLength_=0;this.bookmarks_=[];};
	jspb.BinaryWriter.prototype.getResultBuffer=function(){jspb.asserts.assert(0==this.bookmarks_.length);for(var a=new Uint8Array(this.totalLength_+this.encoder_.length()),b=this.blocks_,c=b.length,d=0,e=0;e<c;e++){var f=b[e];a.set(f,d);d+=f.length;}b=this.encoder_.end();a.set(b,d);d+=b.length;jspb.asserts.assert(d==a.length);this.blocks_=[a];return a};goog.exportProperty(jspb.BinaryWriter.prototype,"getResultBuffer",jspb.BinaryWriter.prototype.getResultBuffer);
	jspb.BinaryWriter.prototype.getResultBase64String=function(a){return goog.crypt.base64.encodeByteArray(this.getResultBuffer(),a)};jspb.BinaryWriter.prototype.beginSubMessage=function(a){this.bookmarks_.push(this.beginDelimited_(a));};jspb.BinaryWriter.prototype.endSubMessage=function(){jspb.asserts.assert(0<=this.bookmarks_.length);this.endDelimited_(this.bookmarks_.pop());};
	jspb.BinaryWriter.prototype.writeFieldHeader_=function(a,b){jspb.asserts.assert(1<=a&&a==Math.floor(a));this.encoder_.writeUnsignedVarint32(8*a+b);};
	jspb.BinaryWriter.prototype.writeAny=function(a,b,c){var d=jspb.BinaryConstants.FieldType;switch(a){case d.DOUBLE:this.writeDouble(b,c);break;case d.FLOAT:this.writeFloat(b,c);break;case d.INT64:this.writeInt64(b,c);break;case d.UINT64:this.writeUint64(b,c);break;case d.INT32:this.writeInt32(b,c);break;case d.FIXED64:this.writeFixed64(b,c);break;case d.FIXED32:this.writeFixed32(b,c);break;case d.BOOL:this.writeBool(b,c);break;case d.STRING:this.writeString(b,c);break;case d.GROUP:jspb.asserts.fail("Group field type not supported in writeAny()");
	break;case d.MESSAGE:jspb.asserts.fail("Message field type not supported in writeAny()");break;case d.BYTES:this.writeBytes(b,c);break;case d.UINT32:this.writeUint32(b,c);break;case d.ENUM:this.writeEnum(b,c);break;case d.SFIXED32:this.writeSfixed32(b,c);break;case d.SFIXED64:this.writeSfixed64(b,c);break;case d.SINT32:this.writeSint32(b,c);break;case d.SINT64:this.writeSint64(b,c);break;case d.FHASH64:this.writeFixedHash64(b,c);break;case d.VHASH64:this.writeVarintHash64(b,c);break;default:jspb.asserts.fail("Invalid field type in writeAny()");}};
	jspb.BinaryWriter.prototype.writeUnsignedVarint32_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeUnsignedVarint32(b));};jspb.BinaryWriter.prototype.writeSignedVarint32_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeSignedVarint32(b));};jspb.BinaryWriter.prototype.writeUnsignedVarint64_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeUnsignedVarint64(b));};
	jspb.BinaryWriter.prototype.writeSignedVarint64_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeSignedVarint64(b));};jspb.BinaryWriter.prototype.writeZigzagVarint32_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeZigzagVarint32(b));};jspb.BinaryWriter.prototype.writeZigzagVarint64_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeZigzagVarint64(b));};
	jspb.BinaryWriter.prototype.writeZigzagVarint64String_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeZigzagVarint64String(b));};jspb.BinaryWriter.prototype.writeZigzagVarintHash64_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeZigzagVarintHash64(b));};
	jspb.BinaryWriter.prototype.writeInt32=function(a,b){null!=b&&(jspb.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_31&&b<jspb.BinaryConstants.TWO_TO_31),this.writeSignedVarint32_(a,b));};goog.exportProperty(jspb.BinaryWriter.prototype,"writeInt32",jspb.BinaryWriter.prototype.writeInt32);jspb.BinaryWriter.prototype.writeInt32String=function(a,b){null!=b&&(b=parseInt(b,10),jspb.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_31&&b<jspb.BinaryConstants.TWO_TO_31),this.writeSignedVarint32_(a,b));};
	jspb.BinaryWriter.prototype.writeInt64=function(a,b){null!=b&&(jspb.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_63&&b<jspb.BinaryConstants.TWO_TO_63),this.writeSignedVarint64_(a,b));};goog.exportProperty(jspb.BinaryWriter.prototype,"writeInt64",jspb.BinaryWriter.prototype.writeInt64);jspb.BinaryWriter.prototype.writeInt64String=function(a,b){null!=b&&(b=jspb.arith.Int64.fromString(b),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeSplitVarint64(b.lo,b.hi));};
	jspb.BinaryWriter.prototype.writeUint32=function(a,b){null!=b&&(jspb.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_32),this.writeUnsignedVarint32_(a,b));};goog.exportProperty(jspb.BinaryWriter.prototype,"writeUint32",jspb.BinaryWriter.prototype.writeUint32);jspb.BinaryWriter.prototype.writeUint32String=function(a,b){null!=b&&(b=parseInt(b,10),jspb.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_32),this.writeUnsignedVarint32_(a,b));};
	jspb.BinaryWriter.prototype.writeUint64=function(a,b){null!=b&&(jspb.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_64),this.writeUnsignedVarint64_(a,b));};goog.exportProperty(jspb.BinaryWriter.prototype,"writeUint64",jspb.BinaryWriter.prototype.writeUint64);jspb.BinaryWriter.prototype.writeUint64String=function(a,b){null!=b&&(b=jspb.arith.UInt64.fromString(b),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeSplitVarint64(b.lo,b.hi));};
	jspb.BinaryWriter.prototype.writeSint32=function(a,b){null!=b&&(jspb.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_31&&b<jspb.BinaryConstants.TWO_TO_31),this.writeZigzagVarint32_(a,b));};goog.exportProperty(jspb.BinaryWriter.prototype,"writeSint32",jspb.BinaryWriter.prototype.writeSint32);jspb.BinaryWriter.prototype.writeSint64=function(a,b){null!=b&&(jspb.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_63&&b<jspb.BinaryConstants.TWO_TO_63),this.writeZigzagVarint64_(a,b));};
	goog.exportProperty(jspb.BinaryWriter.prototype,"writeSint64",jspb.BinaryWriter.prototype.writeSint64);jspb.BinaryWriter.prototype.writeSintHash64=function(a,b){null!=b&&this.writeZigzagVarintHash64_(a,b);};jspb.BinaryWriter.prototype.writeSint64String=function(a,b){null!=b&&this.writeZigzagVarint64String_(a,b);};
	jspb.BinaryWriter.prototype.writeFixed32=function(a,b){null!=b&&(jspb.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_32),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED32),this.encoder_.writeUint32(b));};goog.exportProperty(jspb.BinaryWriter.prototype,"writeFixed32",jspb.BinaryWriter.prototype.writeFixed32);
	jspb.BinaryWriter.prototype.writeFixed64=function(a,b){null!=b&&(jspb.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_64),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64),this.encoder_.writeUint64(b));};goog.exportProperty(jspb.BinaryWriter.prototype,"writeFixed64",jspb.BinaryWriter.prototype.writeFixed64);
	jspb.BinaryWriter.prototype.writeFixed64String=function(a,b){null!=b&&(b=jspb.arith.UInt64.fromString(b),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64),this.encoder_.writeSplitFixed64(b.lo,b.hi));};jspb.BinaryWriter.prototype.writeSfixed32=function(a,b){null!=b&&(jspb.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_31&&b<jspb.BinaryConstants.TWO_TO_31),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED32),this.encoder_.writeInt32(b));};
	goog.exportProperty(jspb.BinaryWriter.prototype,"writeSfixed32",jspb.BinaryWriter.prototype.writeSfixed32);jspb.BinaryWriter.prototype.writeSfixed64=function(a,b){null!=b&&(jspb.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_63&&b<jspb.BinaryConstants.TWO_TO_63),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64),this.encoder_.writeInt64(b));};goog.exportProperty(jspb.BinaryWriter.prototype,"writeSfixed64",jspb.BinaryWriter.prototype.writeSfixed64);
	jspb.BinaryWriter.prototype.writeSfixed64String=function(a,b){null!=b&&(b=jspb.arith.Int64.fromString(b),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64),this.encoder_.writeSplitFixed64(b.lo,b.hi));};jspb.BinaryWriter.prototype.writeFloat=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED32),this.encoder_.writeFloat(b));};goog.exportProperty(jspb.BinaryWriter.prototype,"writeFloat",jspb.BinaryWriter.prototype.writeFloat);
	jspb.BinaryWriter.prototype.writeDouble=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64),this.encoder_.writeDouble(b));};goog.exportProperty(jspb.BinaryWriter.prototype,"writeDouble",jspb.BinaryWriter.prototype.writeDouble);jspb.BinaryWriter.prototype.writeBool=function(a,b){null!=b&&(jspb.asserts.assert("boolean"===typeof b||"number"===typeof b),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeBool(b));};
	goog.exportProperty(jspb.BinaryWriter.prototype,"writeBool",jspb.BinaryWriter.prototype.writeBool);jspb.BinaryWriter.prototype.writeEnum=function(a,b){null!=b&&(jspb.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_31&&b<jspb.BinaryConstants.TWO_TO_31),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeSignedVarint32(b));};goog.exportProperty(jspb.BinaryWriter.prototype,"writeEnum",jspb.BinaryWriter.prototype.writeEnum);
	jspb.BinaryWriter.prototype.writeString=function(a,b){null!=b&&(a=this.beginDelimited_(a),this.encoder_.writeString(b),this.endDelimited_(a));};goog.exportProperty(jspb.BinaryWriter.prototype,"writeString",jspb.BinaryWriter.prototype.writeString);jspb.BinaryWriter.prototype.writeBytes=function(a,b){null!=b&&(b=jspb.utils.byteSourceToUint8Array(b),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED),this.encoder_.writeUnsignedVarint32(b.length),this.appendUint8Array_(b));};
	goog.exportProperty(jspb.BinaryWriter.prototype,"writeBytes",jspb.BinaryWriter.prototype.writeBytes);jspb.BinaryWriter.prototype.writeMessage=function(a,b,c){null!=b&&(a=this.beginDelimited_(a),c(b,this),this.endDelimited_(a));};goog.exportProperty(jspb.BinaryWriter.prototype,"writeMessage",jspb.BinaryWriter.prototype.writeMessage);
	jspb.BinaryWriter.prototype.writeMessageSet=function(a,b,c){null!=b&&(this.writeFieldHeader_(1,jspb.BinaryConstants.WireType.START_GROUP),this.writeFieldHeader_(2,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeSignedVarint32(a),a=this.beginDelimited_(3),c(b,this),this.endDelimited_(a),this.writeFieldHeader_(1,jspb.BinaryConstants.WireType.END_GROUP));};
	jspb.BinaryWriter.prototype.writeGroup=function(a,b,c){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.START_GROUP),c(b,this),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.END_GROUP));};goog.exportProperty(jspb.BinaryWriter.prototype,"writeGroup",jspb.BinaryWriter.prototype.writeGroup);jspb.BinaryWriter.prototype.writeFixedHash64=function(a,b){null!=b&&(jspb.asserts.assert(8==b.length),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64),this.encoder_.writeFixedHash64(b));};
	jspb.BinaryWriter.prototype.writeVarintHash64=function(a,b){null!=b&&(jspb.asserts.assert(8==b.length),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeVarintHash64(b));};jspb.BinaryWriter.prototype.writeSplitFixed64=function(a,b,c){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64);this.encoder_.writeSplitFixed64(b,c);};
	jspb.BinaryWriter.prototype.writeSplitVarint64=function(a,b,c){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT);this.encoder_.writeSplitVarint64(b,c);};jspb.BinaryWriter.prototype.writeSplitZigzagVarint64=function(a,b,c){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT);var d=this.encoder_;jspb.utils.toZigzag64(b,c,function(a,b){d.writeSplitVarint64(a>>>0,b>>>0);});};
	jspb.BinaryWriter.prototype.writeRepeatedInt32=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeSignedVarint32_(a,b[c]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedInt32",jspb.BinaryWriter.prototype.writeRepeatedInt32);jspb.BinaryWriter.prototype.writeRepeatedInt32String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeInt32String(a,b[c]);};
	jspb.BinaryWriter.prototype.writeRepeatedInt64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeSignedVarint64_(a,b[c]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedInt64",jspb.BinaryWriter.prototype.writeRepeatedInt64);jspb.BinaryWriter.prototype.writeRepeatedSplitFixed64=function(a,b,c,d){if(null!=b)for(var e=0;e<b.length;e++)this.writeSplitFixed64(a,c(b[e]),d(b[e]));};
	jspb.BinaryWriter.prototype.writeRepeatedSplitVarint64=function(a,b,c,d){if(null!=b)for(var e=0;e<b.length;e++)this.writeSplitVarint64(a,c(b[e]),d(b[e]));};jspb.BinaryWriter.prototype.writeRepeatedSplitZigzagVarint64=function(a,b,c,d){if(null!=b)for(var e=0;e<b.length;e++)this.writeSplitZigzagVarint64(a,c(b[e]),d(b[e]));};jspb.BinaryWriter.prototype.writeRepeatedInt64String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeInt64String(a,b[c]);};
	jspb.BinaryWriter.prototype.writeRepeatedUint32=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeUnsignedVarint32_(a,b[c]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedUint32",jspb.BinaryWriter.prototype.writeRepeatedUint32);jspb.BinaryWriter.prototype.writeRepeatedUint32String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeUint32String(a,b[c]);};
	jspb.BinaryWriter.prototype.writeRepeatedUint64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeUnsignedVarint64_(a,b[c]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedUint64",jspb.BinaryWriter.prototype.writeRepeatedUint64);jspb.BinaryWriter.prototype.writeRepeatedUint64String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeUint64String(a,b[c]);};
	jspb.BinaryWriter.prototype.writeRepeatedSint32=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeZigzagVarint32_(a,b[c]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedSint32",jspb.BinaryWriter.prototype.writeRepeatedSint32);jspb.BinaryWriter.prototype.writeRepeatedSint64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeZigzagVarint64_(a,b[c]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedSint64",jspb.BinaryWriter.prototype.writeRepeatedSint64);
	jspb.BinaryWriter.prototype.writeRepeatedSint64String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeZigzagVarint64String_(a,b[c]);};jspb.BinaryWriter.prototype.writeRepeatedSintHash64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeZigzagVarintHash64_(a,b[c]);};jspb.BinaryWriter.prototype.writeRepeatedFixed32=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeFixed32(a,b[c]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedFixed32",jspb.BinaryWriter.prototype.writeRepeatedFixed32);
	jspb.BinaryWriter.prototype.writeRepeatedFixed64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeFixed64(a,b[c]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedFixed64",jspb.BinaryWriter.prototype.writeRepeatedFixed64);jspb.BinaryWriter.prototype.writeRepeatedFixed64String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeFixed64String(a,b[c]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedFixed64String",jspb.BinaryWriter.prototype.writeRepeatedFixed64String);
	jspb.BinaryWriter.prototype.writeRepeatedSfixed32=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeSfixed32(a,b[c]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedSfixed32",jspb.BinaryWriter.prototype.writeRepeatedSfixed32);jspb.BinaryWriter.prototype.writeRepeatedSfixed64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeSfixed64(a,b[c]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedSfixed64",jspb.BinaryWriter.prototype.writeRepeatedSfixed64);
	jspb.BinaryWriter.prototype.writeRepeatedSfixed64String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeSfixed64String(a,b[c]);};jspb.BinaryWriter.prototype.writeRepeatedFloat=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeFloat(a,b[c]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedFloat",jspb.BinaryWriter.prototype.writeRepeatedFloat);
	jspb.BinaryWriter.prototype.writeRepeatedDouble=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeDouble(a,b[c]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedDouble",jspb.BinaryWriter.prototype.writeRepeatedDouble);jspb.BinaryWriter.prototype.writeRepeatedBool=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeBool(a,b[c]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedBool",jspb.BinaryWriter.prototype.writeRepeatedBool);
	jspb.BinaryWriter.prototype.writeRepeatedEnum=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeEnum(a,b[c]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedEnum",jspb.BinaryWriter.prototype.writeRepeatedEnum);jspb.BinaryWriter.prototype.writeRepeatedString=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeString(a,b[c]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedString",jspb.BinaryWriter.prototype.writeRepeatedString);
	jspb.BinaryWriter.prototype.writeRepeatedBytes=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeBytes(a,b[c]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedBytes",jspb.BinaryWriter.prototype.writeRepeatedBytes);jspb.BinaryWriter.prototype.writeRepeatedMessage=function(a,b,c){if(null!=b)for(var d=0;d<b.length;d++){var e=this.beginDelimited_(a);c(b[d],this);this.endDelimited_(e);}};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedMessage",jspb.BinaryWriter.prototype.writeRepeatedMessage);
	jspb.BinaryWriter.prototype.writeRepeatedGroup=function(a,b,c){if(null!=b)for(var d=0;d<b.length;d++)this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.START_GROUP),c(b[d],this),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.END_GROUP);};goog.exportProperty(jspb.BinaryWriter.prototype,"writeRepeatedGroup",jspb.BinaryWriter.prototype.writeRepeatedGroup);jspb.BinaryWriter.prototype.writeRepeatedFixedHash64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeFixedHash64(a,b[c]);};
	jspb.BinaryWriter.prototype.writeRepeatedVarintHash64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeVarintHash64(a,b[c]);};jspb.BinaryWriter.prototype.writePackedInt32=function(a,b){if(null!=b&&b.length){a=this.beginDelimited_(a);for(var c=0;c<b.length;c++)this.encoder_.writeSignedVarint32(b[c]);this.endDelimited_(a);}};goog.exportProperty(jspb.BinaryWriter.prototype,"writePackedInt32",jspb.BinaryWriter.prototype.writePackedInt32);
	jspb.BinaryWriter.prototype.writePackedInt32String=function(a,b){if(null!=b&&b.length){a=this.beginDelimited_(a);for(var c=0;c<b.length;c++)this.encoder_.writeSignedVarint32(parseInt(b[c],10));this.endDelimited_(a);}};jspb.BinaryWriter.prototype.writePackedInt64=function(a,b){if(null!=b&&b.length){a=this.beginDelimited_(a);for(var c=0;c<b.length;c++)this.encoder_.writeSignedVarint64(b[c]);this.endDelimited_(a);}};goog.exportProperty(jspb.BinaryWriter.prototype,"writePackedInt64",jspb.BinaryWriter.prototype.writePackedInt64);
	jspb.BinaryWriter.prototype.writePackedSplitFixed64=function(a,b,c,d){if(null!=b){a=this.beginDelimited_(a);for(var e=0;e<b.length;e++)this.encoder_.writeSplitFixed64(c(b[e]),d(b[e]));this.endDelimited_(a);}};jspb.BinaryWriter.prototype.writePackedSplitVarint64=function(a,b,c,d){if(null!=b){a=this.beginDelimited_(a);for(var e=0;e<b.length;e++)this.encoder_.writeSplitVarint64(c(b[e]),d(b[e]));this.endDelimited_(a);}};
	jspb.BinaryWriter.prototype.writePackedSplitZigzagVarint64=function(a,b,c,d){if(null!=b){a=this.beginDelimited_(a);for(var e=this.encoder_,f=0;f<b.length;f++)jspb.utils.toZigzag64(c(b[f]),d(b[f]),function(a,b){e.writeSplitVarint64(a>>>0,b>>>0);});this.endDelimited_(a);}};jspb.BinaryWriter.prototype.writePackedInt64String=function(a,b){if(null!=b&&b.length){a=this.beginDelimited_(a);for(var c=0;c<b.length;c++){var d=jspb.arith.Int64.fromString(b[c]);this.encoder_.writeSplitVarint64(d.lo,d.hi);}this.endDelimited_(a);}};
	jspb.BinaryWriter.prototype.writePackedUint32=function(a,b){if(null!=b&&b.length){a=this.beginDelimited_(a);for(var c=0;c<b.length;c++)this.encoder_.writeUnsignedVarint32(b[c]);this.endDelimited_(a);}};goog.exportProperty(jspb.BinaryWriter.prototype,"writePackedUint32",jspb.BinaryWriter.prototype.writePackedUint32);
	jspb.BinaryWriter.prototype.writePackedUint32String=function(a,b){if(null!=b&&b.length){a=this.beginDelimited_(a);for(var c=0;c<b.length;c++)this.encoder_.writeUnsignedVarint32(parseInt(b[c],10));this.endDelimited_(a);}};jspb.BinaryWriter.prototype.writePackedUint64=function(a,b){if(null!=b&&b.length){a=this.beginDelimited_(a);for(var c=0;c<b.length;c++)this.encoder_.writeUnsignedVarint64(b[c]);this.endDelimited_(a);}};goog.exportProperty(jspb.BinaryWriter.prototype,"writePackedUint64",jspb.BinaryWriter.prototype.writePackedUint64);
	jspb.BinaryWriter.prototype.writePackedUint64String=function(a,b){if(null!=b&&b.length){a=this.beginDelimited_(a);for(var c=0;c<b.length;c++){var d=jspb.arith.UInt64.fromString(b[c]);this.encoder_.writeSplitVarint64(d.lo,d.hi);}this.endDelimited_(a);}};jspb.BinaryWriter.prototype.writePackedSint32=function(a,b){if(null!=b&&b.length){a=this.beginDelimited_(a);for(var c=0;c<b.length;c++)this.encoder_.writeZigzagVarint32(b[c]);this.endDelimited_(a);}};
	goog.exportProperty(jspb.BinaryWriter.prototype,"writePackedSint32",jspb.BinaryWriter.prototype.writePackedSint32);jspb.BinaryWriter.prototype.writePackedSint64=function(a,b){if(null!=b&&b.length){a=this.beginDelimited_(a);for(var c=0;c<b.length;c++)this.encoder_.writeZigzagVarint64(b[c]);this.endDelimited_(a);}};goog.exportProperty(jspb.BinaryWriter.prototype,"writePackedSint64",jspb.BinaryWriter.prototype.writePackedSint64);
	jspb.BinaryWriter.prototype.writePackedSint64String=function(a,b){if(null!=b&&b.length){a=this.beginDelimited_(a);for(var c=0;c<b.length;c++)this.encoder_.writeZigzagVarintHash64(jspb.utils.decimalStringToHash64(b[c]));this.endDelimited_(a);}};jspb.BinaryWriter.prototype.writePackedSintHash64=function(a,b){if(null!=b&&b.length){a=this.beginDelimited_(a);for(var c=0;c<b.length;c++)this.encoder_.writeZigzagVarintHash64(b[c]);this.endDelimited_(a);}};
	jspb.BinaryWriter.prototype.writePackedFixed32=function(a,b){if(null!=b&&b.length)for(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED),this.encoder_.writeUnsignedVarint32(4*b.length),a=0;a<b.length;a++)this.encoder_.writeUint32(b[a]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writePackedFixed32",jspb.BinaryWriter.prototype.writePackedFixed32);
	jspb.BinaryWriter.prototype.writePackedFixed64=function(a,b){if(null!=b&&b.length)for(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED),this.encoder_.writeUnsignedVarint32(8*b.length),a=0;a<b.length;a++)this.encoder_.writeUint64(b[a]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writePackedFixed64",jspb.BinaryWriter.prototype.writePackedFixed64);
	jspb.BinaryWriter.prototype.writePackedFixed64String=function(a,b){if(null!=b&&b.length)for(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED),this.encoder_.writeUnsignedVarint32(8*b.length),a=0;a<b.length;a++){var c=jspb.arith.UInt64.fromString(b[a]);this.encoder_.writeSplitFixed64(c.lo,c.hi);}};
	jspb.BinaryWriter.prototype.writePackedSfixed32=function(a,b){if(null!=b&&b.length)for(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED),this.encoder_.writeUnsignedVarint32(4*b.length),a=0;a<b.length;a++)this.encoder_.writeInt32(b[a]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writePackedSfixed32",jspb.BinaryWriter.prototype.writePackedSfixed32);
	jspb.BinaryWriter.prototype.writePackedSfixed64=function(a,b){if(null!=b&&b.length)for(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED),this.encoder_.writeUnsignedVarint32(8*b.length),a=0;a<b.length;a++)this.encoder_.writeInt64(b[a]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writePackedSfixed64",jspb.BinaryWriter.prototype.writePackedSfixed64);
	jspb.BinaryWriter.prototype.writePackedSfixed64String=function(a,b){if(null!=b&&b.length)for(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED),this.encoder_.writeUnsignedVarint32(8*b.length),a=0;a<b.length;a++)this.encoder_.writeInt64String(b[a]);};jspb.BinaryWriter.prototype.writePackedFloat=function(a,b){if(null!=b&&b.length)for(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED),this.encoder_.writeUnsignedVarint32(4*b.length),a=0;a<b.length;a++)this.encoder_.writeFloat(b[a]);};
	goog.exportProperty(jspb.BinaryWriter.prototype,"writePackedFloat",jspb.BinaryWriter.prototype.writePackedFloat);jspb.BinaryWriter.prototype.writePackedDouble=function(a,b){if(null!=b&&b.length)for(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED),this.encoder_.writeUnsignedVarint32(8*b.length),a=0;a<b.length;a++)this.encoder_.writeDouble(b[a]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writePackedDouble",jspb.BinaryWriter.prototype.writePackedDouble);
	jspb.BinaryWriter.prototype.writePackedBool=function(a,b){if(null!=b&&b.length)for(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED),this.encoder_.writeUnsignedVarint32(b.length),a=0;a<b.length;a++)this.encoder_.writeBool(b[a]);};goog.exportProperty(jspb.BinaryWriter.prototype,"writePackedBool",jspb.BinaryWriter.prototype.writePackedBool);
	jspb.BinaryWriter.prototype.writePackedEnum=function(a,b){if(null!=b&&b.length){a=this.beginDelimited_(a);for(var c=0;c<b.length;c++)this.encoder_.writeEnum(b[c]);this.endDelimited_(a);}};goog.exportProperty(jspb.BinaryWriter.prototype,"writePackedEnum",jspb.BinaryWriter.prototype.writePackedEnum);
	jspb.BinaryWriter.prototype.writePackedFixedHash64=function(a,b){if(null!=b&&b.length)for(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED),this.encoder_.writeUnsignedVarint32(8*b.length),a=0;a<b.length;a++)this.encoder_.writeFixedHash64(b[a]);};jspb.BinaryWriter.prototype.writePackedVarintHash64=function(a,b){if(null!=b&&b.length){a=this.beginDelimited_(a);for(var c=0;c<b.length;c++)this.encoder_.writeVarintHash64(b[c]);this.endDelimited_(a);}};jspb.Map=function(a,b){this.arr_=a;this.valueCtor_=b;this.map_={};this.arrClean=!0;0<this.arr_.length&&this.loadFromArray_();};goog.exportSymbol("jspb.Map",jspb.Map);jspb.Map.prototype.loadFromArray_=function(){for(var a=0;a<this.arr_.length;a++){var b=this.arr_[a],c=b[0];this.map_[c.toString()]=new jspb.Map.Entry_(c,b[1]);}this.arrClean=!0;};
	jspb.Map.prototype.toArray=function(){if(this.arrClean){if(this.valueCtor_){var a=this.map_,b;for(b in a)if(Object.prototype.hasOwnProperty.call(a,b)){var c=a[b].valueWrapper;c&&c.toArray();}}}else {this.arr_.length=0;a=this.stringKeys_();a.sort();for(b=0;b<a.length;b++){var d=this.map_[a[b]];(c=d.valueWrapper)&&c.toArray();this.arr_.push([d.key,d.value]);}this.arrClean=!0;}return this.arr_};goog.exportProperty(jspb.Map.prototype,"toArray",jspb.Map.prototype.toArray);
	jspb.Map.prototype.toObject=function(a,b){for(var c=this.toArray(),d=[],e=0;e<c.length;e++){var f=this.map_[c[e][0].toString()];this.wrapEntry_(f);var g=f.valueWrapper;g?(jspb.asserts.assert(b),d.push([f.key,b(a,g)])):d.push([f.key,f.value]);}return d};goog.exportProperty(jspb.Map.prototype,"toObject",jspb.Map.prototype.toObject);jspb.Map.fromObject=function(a,b,c){b=new jspb.Map([],b);for(var d=0;d<a.length;d++){var e=a[d][0],f=c(a[d][1]);b.set(e,f);}return b};
	goog.exportProperty(jspb.Map,"fromObject",jspb.Map.fromObject);jspb.Map.ArrayIteratorIterable_=function(a){this.idx_=0;this.arr_=a;};jspb.Map.ArrayIteratorIterable_.prototype.next=function(){return this.idx_<this.arr_.length?{done:!1,value:this.arr_[this.idx_++]}:{done:!0,value:void 0}};"undefined"!=typeof Symbol&&(jspb.Map.ArrayIteratorIterable_.prototype[Symbol.iterator]=function(){return this});jspb.Map.prototype.getLength=function(){return this.stringKeys_().length};
	goog.exportProperty(jspb.Map.prototype,"getLength",jspb.Map.prototype.getLength);jspb.Map.prototype.clear=function(){this.map_={};this.arrClean=!1;};goog.exportProperty(jspb.Map.prototype,"clear",jspb.Map.prototype.clear);jspb.Map.prototype.del=function(a){a=a.toString();var b=this.map_.hasOwnProperty(a);delete this.map_[a];this.arrClean=!1;return b};goog.exportProperty(jspb.Map.prototype,"del",jspb.Map.prototype.del);
	jspb.Map.prototype.getEntryList=function(){var a=[],b=this.stringKeys_();b.sort();for(var c=0;c<b.length;c++){var d=this.map_[b[c]];a.push([d.key,d.value]);}return a};goog.exportProperty(jspb.Map.prototype,"getEntryList",jspb.Map.prototype.getEntryList);jspb.Map.prototype.entries=function(){var a=[],b=this.stringKeys_();b.sort();for(var c=0;c<b.length;c++){var d=this.map_[b[c]];a.push([d.key,this.wrapEntry_(d)]);}return new jspb.Map.ArrayIteratorIterable_(a)};
	goog.exportProperty(jspb.Map.prototype,"entries",jspb.Map.prototype.entries);jspb.Map.prototype.keys=function(){var a=[],b=this.stringKeys_();b.sort();for(var c=0;c<b.length;c++)a.push(this.map_[b[c]].key);return new jspb.Map.ArrayIteratorIterable_(a)};goog.exportProperty(jspb.Map.prototype,"keys",jspb.Map.prototype.keys);jspb.Map.prototype.values=function(){var a=[],b=this.stringKeys_();b.sort();for(var c=0;c<b.length;c++)a.push(this.wrapEntry_(this.map_[b[c]]));return new jspb.Map.ArrayIteratorIterable_(a)};
	goog.exportProperty(jspb.Map.prototype,"values",jspb.Map.prototype.values);jspb.Map.prototype.forEach=function(a,b){var c=this.stringKeys_();c.sort();for(var d=0;d<c.length;d++){var e=this.map_[c[d]];a.call(b,this.wrapEntry_(e),e.key,this);}};goog.exportProperty(jspb.Map.prototype,"forEach",jspb.Map.prototype.forEach);jspb.Map.prototype.set=function(a,b){var c=new jspb.Map.Entry_(a);this.valueCtor_?(c.valueWrapper=b,c.value=b.toArray()):c.value=b;this.map_[a.toString()]=c;this.arrClean=!1;return this};
	goog.exportProperty(jspb.Map.prototype,"set",jspb.Map.prototype.set);jspb.Map.prototype.wrapEntry_=function(a){return this.valueCtor_?(a.valueWrapper||(a.valueWrapper=new this.valueCtor_(a.value)),a.valueWrapper):a.value};jspb.Map.prototype.get=function(a){if(a=this.map_[a.toString()])return this.wrapEntry_(a)};goog.exportProperty(jspb.Map.prototype,"get",jspb.Map.prototype.get);jspb.Map.prototype.has=function(a){return a.toString()in this.map_};goog.exportProperty(jspb.Map.prototype,"has",jspb.Map.prototype.has);
	jspb.Map.prototype.serializeBinary=function(a,b,c,d,e){var f=this.stringKeys_();f.sort();for(var g=0;g<f.length;g++){var h=this.map_[f[g]];b.beginSubMessage(a);c.call(b,1,h.key);this.valueCtor_?d.call(b,2,this.wrapEntry_(h),e):d.call(b,2,h.value);b.endSubMessage();}};goog.exportProperty(jspb.Map.prototype,"serializeBinary",jspb.Map.prototype.serializeBinary);
	jspb.Map.deserializeBinary=function(a,b,c,d,e,f,g){for(;b.nextField()&&!b.isEndGroup();){var h=b.getFieldNumber();1==h?f=c.call(b):2==h&&(a.valueCtor_?(jspb.asserts.assert(e),g||(g=new a.valueCtor_),d.call(b,g,e)):g=d.call(b));}jspb.asserts.assert(void 0!=f);jspb.asserts.assert(void 0!=g);a.set(f,g);};goog.exportProperty(jspb.Map,"deserializeBinary",jspb.Map.deserializeBinary);
	jspb.Map.prototype.stringKeys_=function(){var a=this.map_,b=[],c;for(c in a)Object.prototype.hasOwnProperty.call(a,c)&&b.push(c);return b};jspb.Map.Entry_=function(a,b){this.key=a;this.value=b;this.valueWrapper=void 0;};jspb.ExtensionFieldInfo=function(a,b,c,d,e){this.fieldIndex=a;this.fieldName=b;this.ctor=c;this.toObjectFn=d;this.isRepeated=e;};goog.exportSymbol("jspb.ExtensionFieldInfo",jspb.ExtensionFieldInfo);jspb.ExtensionFieldBinaryInfo=function(a,b,c,d,e,f){this.fieldInfo=a;this.binaryReaderFn=b;this.binaryWriterFn=c;this.binaryMessageSerializeFn=d;this.binaryMessageDeserializeFn=e;this.isPacked=f;};goog.exportSymbol("jspb.ExtensionFieldBinaryInfo",jspb.ExtensionFieldBinaryInfo);
	jspb.ExtensionFieldInfo.prototype.isMessageType=function(){return !!this.ctor};goog.exportProperty(jspb.ExtensionFieldInfo.prototype,"isMessageType",jspb.ExtensionFieldInfo.prototype.isMessageType);jspb.Message=function(){};goog.exportSymbol("jspb.Message",jspb.Message);jspb.Message.GENERATE_TO_OBJECT=!0;goog.exportProperty(jspb.Message,"GENERATE_TO_OBJECT",jspb.Message.GENERATE_TO_OBJECT);jspb.Message.GENERATE_FROM_OBJECT=!goog.DISALLOW_TEST_ONLY_CODE;
	goog.exportProperty(jspb.Message,"GENERATE_FROM_OBJECT",jspb.Message.GENERATE_FROM_OBJECT);jspb.Message.GENERATE_TO_STRING=!0;jspb.Message.ASSUME_LOCAL_ARRAYS=!1;jspb.Message.SERIALIZE_EMPTY_TRAILING_FIELDS=!0;jspb.Message.SUPPORTS_UINT8ARRAY_="function"==typeof Uint8Array;jspb.Message.prototype.getJsPbMessageId=function(){return this.messageId_};goog.exportProperty(jspb.Message.prototype,"getJsPbMessageId",jspb.Message.prototype.getJsPbMessageId);jspb.Message.getIndex_=function(a,b){return b+a.arrayIndexOffset_};
	jspb.Message.hiddenES6Property_=function(){};jspb.Message.getFieldNumber_=function(a,b){return b-a.arrayIndexOffset_};
	jspb.Message.initialize=function(a,b,c,d,e,f){a.wrappers_=null;b||(b=c?[c]:[]);a.messageId_=c?String(c):void 0;a.arrayIndexOffset_=0===c?-1:0;a.array=b;jspb.Message.initPivotAndExtensionObject_(a,d);a.convertedPrimitiveFields_={};jspb.Message.SERIALIZE_EMPTY_TRAILING_FIELDS||(a.repeatedFields=e);if(e)for(b=0;b<e.length;b++)c=e[b],c<a.pivot_?(c=jspb.Message.getIndex_(a,c),a.array[c]=a.array[c]||jspb.Message.EMPTY_LIST_SENTINEL_):(jspb.Message.maybeInitEmptyExtensionObject_(a),a.extensionObject_[c]=
	a.extensionObject_[c]||jspb.Message.EMPTY_LIST_SENTINEL_);if(f&&f.length)for(b=0;b<f.length;b++)jspb.Message.computeOneofCase(a,f[b]);};goog.exportProperty(jspb.Message,"initialize",jspb.Message.initialize);jspb.Message.EMPTY_LIST_SENTINEL_=goog.DEBUG&&Object.freeze?Object.freeze([]):[];jspb.Message.isArray_=function(a){return jspb.Message.ASSUME_LOCAL_ARRAYS?a instanceof Array:Array.isArray(a)};
	jspb.Message.isExtensionObject_=function(a){return null!==a&&"object"==typeof a&&!jspb.Message.isArray_(a)&&!(jspb.Message.SUPPORTS_UINT8ARRAY_&&a instanceof Uint8Array)};jspb.Message.initPivotAndExtensionObject_=function(a,b){var c=a.array.length,d=-1;if(c&&(d=c-1,c=a.array[d],jspb.Message.isExtensionObject_(c))){a.pivot_=jspb.Message.getFieldNumber_(a,d);a.extensionObject_=c;return}-1<b?(a.pivot_=Math.max(b,jspb.Message.getFieldNumber_(a,d+1)),a.extensionObject_=null):a.pivot_=Number.MAX_VALUE;};
	jspb.Message.maybeInitEmptyExtensionObject_=function(a){var b=jspb.Message.getIndex_(a,a.pivot_);a.array[b]||(a.extensionObject_=a.array[b]={});};jspb.Message.toObjectList=function(a,b,c){for(var d=[],e=0;e<a.length;e++)d[e]=b.call(a[e],c,a[e]);return d};goog.exportProperty(jspb.Message,"toObjectList",jspb.Message.toObjectList);
	jspb.Message.toObjectExtension=function(a,b,c,d,e){for(var f in c){var g=c[f],h=d.call(a,g);if(null!=h){for(var k in g.fieldName)if(g.fieldName.hasOwnProperty(k))break;b[k]=g.toObjectFn?g.isRepeated?jspb.Message.toObjectList(h,g.toObjectFn,e):g.toObjectFn(e,h):h;}}};goog.exportProperty(jspb.Message,"toObjectExtension",jspb.Message.toObjectExtension);
	jspb.Message.serializeBinaryExtensions=function(a,b,c,d){for(var e in c){var f=c[e],g=f.fieldInfo;if(!f.binaryWriterFn)throw Error("Message extension present that was generated without binary serialization support");var h=d.call(a,g);if(null!=h)if(g.isMessageType())if(f.binaryMessageSerializeFn)f.binaryWriterFn.call(b,g.fieldIndex,h,f.binaryMessageSerializeFn);else throw Error("Message extension present holding submessage without binary support enabled, and message is being serialized to binary format");
	else f.binaryWriterFn.call(b,g.fieldIndex,h);}};goog.exportProperty(jspb.Message,"serializeBinaryExtensions",jspb.Message.serializeBinaryExtensions);
	jspb.Message.readBinaryExtension=function(a,b,c,d,e){var f=c[b.getFieldNumber()];if(f){c=f.fieldInfo;if(!f.binaryReaderFn)throw Error("Deserializing extension whose generated code does not support binary format");if(c.isMessageType()){var g=new c.ctor;f.binaryReaderFn.call(b,g,f.binaryMessageDeserializeFn);}else g=f.binaryReaderFn.call(b);c.isRepeated&&!f.isPacked?(b=d.call(a,c))?b.push(g):e.call(a,c,[g]):e.call(a,c,g);}else b.skipField();};goog.exportProperty(jspb.Message,"readBinaryExtension",jspb.Message.readBinaryExtension);
	jspb.Message.getField=function(a,b){if(b<a.pivot_){b=jspb.Message.getIndex_(a,b);var c=a.array[b];return c===jspb.Message.EMPTY_LIST_SENTINEL_?a.array[b]=[]:c}if(a.extensionObject_)return c=a.extensionObject_[b],c===jspb.Message.EMPTY_LIST_SENTINEL_?a.extensionObject_[b]=[]:c};goog.exportProperty(jspb.Message,"getField",jspb.Message.getField);jspb.Message.getRepeatedField=function(a,b){return jspb.Message.getField(a,b)};goog.exportProperty(jspb.Message,"getRepeatedField",jspb.Message.getRepeatedField);
	jspb.Message.getOptionalFloatingPointField=function(a,b){a=jspb.Message.getField(a,b);return null==a?a:+a};goog.exportProperty(jspb.Message,"getOptionalFloatingPointField",jspb.Message.getOptionalFloatingPointField);jspb.Message.getBooleanField=function(a,b){a=jspb.Message.getField(a,b);return null==a?a:!!a};goog.exportProperty(jspb.Message,"getBooleanField",jspb.Message.getBooleanField);
	jspb.Message.getRepeatedFloatingPointField=function(a,b){var c=jspb.Message.getRepeatedField(a,b);a.convertedPrimitiveFields_||(a.convertedPrimitiveFields_={});if(!a.convertedPrimitiveFields_[b]){for(var d=0;d<c.length;d++)c[d]=+c[d];a.convertedPrimitiveFields_[b]=!0;}return c};goog.exportProperty(jspb.Message,"getRepeatedFloatingPointField",jspb.Message.getRepeatedFloatingPointField);
	jspb.Message.getRepeatedBooleanField=function(a,b){var c=jspb.Message.getRepeatedField(a,b);a.convertedPrimitiveFields_||(a.convertedPrimitiveFields_={});if(!a.convertedPrimitiveFields_[b]){for(var d=0;d<c.length;d++)c[d]=!!c[d];a.convertedPrimitiveFields_[b]=!0;}return c};goog.exportProperty(jspb.Message,"getRepeatedBooleanField",jspb.Message.getRepeatedBooleanField);
	jspb.Message.bytesAsB64=function(a){if(null==a||"string"===typeof a)return a;if(jspb.Message.SUPPORTS_UINT8ARRAY_&&a instanceof Uint8Array)return goog.crypt.base64.encodeByteArray(a);jspb.asserts.fail("Cannot coerce to b64 string: "+goog.typeOf(a));return null};goog.exportProperty(jspb.Message,"bytesAsB64",jspb.Message.bytesAsB64);
	jspb.Message.bytesAsU8=function(a){if(null==a||a instanceof Uint8Array)return a;if("string"===typeof a)return goog.crypt.base64.decodeStringToUint8Array(a);jspb.asserts.fail("Cannot coerce to Uint8Array: "+goog.typeOf(a));return null};goog.exportProperty(jspb.Message,"bytesAsU8",jspb.Message.bytesAsU8);jspb.Message.bytesListAsB64=function(a){jspb.Message.assertConsistentTypes_(a);return a.length&&"string"!==typeof a[0]?goog.array.map(a,jspb.Message.bytesAsB64):a};
	goog.exportProperty(jspb.Message,"bytesListAsB64",jspb.Message.bytesListAsB64);jspb.Message.bytesListAsU8=function(a){jspb.Message.assertConsistentTypes_(a);return !a.length||a[0]instanceof Uint8Array?a:goog.array.map(a,jspb.Message.bytesAsU8)};goog.exportProperty(jspb.Message,"bytesListAsU8",jspb.Message.bytesListAsU8);
	jspb.Message.assertConsistentTypes_=function(a){if(goog.DEBUG&&a&&1<a.length){var b=goog.typeOf(a[0]);goog.array.forEach(a,function(a){goog.typeOf(a)!=b&&jspb.asserts.fail("Inconsistent type in JSPB repeated field array. Got "+goog.typeOf(a)+" expected "+b);});}};jspb.Message.getFieldWithDefault=function(a,b,c){a=jspb.Message.getField(a,b);return null==a?c:a};goog.exportProperty(jspb.Message,"getFieldWithDefault",jspb.Message.getFieldWithDefault);
	jspb.Message.getBooleanFieldWithDefault=function(a,b,c){a=jspb.Message.getBooleanField(a,b);return null==a?c:a};goog.exportProperty(jspb.Message,"getBooleanFieldWithDefault",jspb.Message.getBooleanFieldWithDefault);jspb.Message.getFloatingPointFieldWithDefault=function(a,b,c){a=jspb.Message.getOptionalFloatingPointField(a,b);return null==a?c:a};goog.exportProperty(jspb.Message,"getFloatingPointFieldWithDefault",jspb.Message.getFloatingPointFieldWithDefault);jspb.Message.getFieldProto3=jspb.Message.getFieldWithDefault;
	goog.exportProperty(jspb.Message,"getFieldProto3",jspb.Message.getFieldProto3);jspb.Message.getMapField=function(a,b,c,d){a.wrappers_||(a.wrappers_={});if(b in a.wrappers_)return a.wrappers_[b];var e=jspb.Message.getField(a,b);if(!e){if(c)return;e=[];jspb.Message.setField(a,b,e);}return a.wrappers_[b]=new jspb.Map(e,d)};goog.exportProperty(jspb.Message,"getMapField",jspb.Message.getMapField);
	jspb.Message.setField=function(a,b,c){jspb.asserts.assertInstanceof(a,jspb.Message);b<a.pivot_?a.array[jspb.Message.getIndex_(a,b)]=c:(jspb.Message.maybeInitEmptyExtensionObject_(a),a.extensionObject_[b]=c);return a};goog.exportProperty(jspb.Message,"setField",jspb.Message.setField);jspb.Message.setProto3IntField=function(a,b,c){return jspb.Message.setFieldIgnoringDefault_(a,b,c,0)};goog.exportProperty(jspb.Message,"setProto3IntField",jspb.Message.setProto3IntField);
	jspb.Message.setProto3FloatField=function(a,b,c){return jspb.Message.setFieldIgnoringDefault_(a,b,c,0)};goog.exportProperty(jspb.Message,"setProto3FloatField",jspb.Message.setProto3FloatField);jspb.Message.setProto3BooleanField=function(a,b,c){return jspb.Message.setFieldIgnoringDefault_(a,b,c,!1)};goog.exportProperty(jspb.Message,"setProto3BooleanField",jspb.Message.setProto3BooleanField);jspb.Message.setProto3StringField=function(a,b,c){return jspb.Message.setFieldIgnoringDefault_(a,b,c,"")};
	goog.exportProperty(jspb.Message,"setProto3StringField",jspb.Message.setProto3StringField);jspb.Message.setProto3BytesField=function(a,b,c){return jspb.Message.setFieldIgnoringDefault_(a,b,c,"")};goog.exportProperty(jspb.Message,"setProto3BytesField",jspb.Message.setProto3BytesField);jspb.Message.setProto3EnumField=function(a,b,c){return jspb.Message.setFieldIgnoringDefault_(a,b,c,0)};goog.exportProperty(jspb.Message,"setProto3EnumField",jspb.Message.setProto3EnumField);
	jspb.Message.setProto3StringIntField=function(a,b,c){return jspb.Message.setFieldIgnoringDefault_(a,b,c,"0")};goog.exportProperty(jspb.Message,"setProto3StringIntField",jspb.Message.setProto3StringIntField);jspb.Message.setFieldIgnoringDefault_=function(a,b,c,d){jspb.asserts.assertInstanceof(a,jspb.Message);c!==d?jspb.Message.setField(a,b,c):b<a.pivot_?a.array[jspb.Message.getIndex_(a,b)]=null:(jspb.Message.maybeInitEmptyExtensionObject_(a),delete a.extensionObject_[b]);return a};
	jspb.Message.addToRepeatedField=function(a,b,c,d){jspb.asserts.assertInstanceof(a,jspb.Message);b=jspb.Message.getRepeatedField(a,b);void 0!=d?b.splice(d,0,c):b.push(c);return a};goog.exportProperty(jspb.Message,"addToRepeatedField",jspb.Message.addToRepeatedField);
	jspb.Message.setOneofField=function(a,b,c,d){jspb.asserts.assertInstanceof(a,jspb.Message);(c=jspb.Message.computeOneofCase(a,c))&&c!==b&&void 0!==d&&(a.wrappers_&&c in a.wrappers_&&(a.wrappers_[c]=void 0),jspb.Message.setField(a,c,void 0));return jspb.Message.setField(a,b,d)};goog.exportProperty(jspb.Message,"setOneofField",jspb.Message.setOneofField);
	jspb.Message.computeOneofCase=function(a,b){for(var c,d,e=0;e<b.length;e++){var f=b[e],g=jspb.Message.getField(a,f);null!=g&&(c=f,d=g,jspb.Message.setField(a,f,void 0));}return c?(jspb.Message.setField(a,c,d),c):0};goog.exportProperty(jspb.Message,"computeOneofCase",jspb.Message.computeOneofCase);jspb.Message.getWrapperField=function(a,b,c,d){a.wrappers_||(a.wrappers_={});if(!a.wrappers_[c]){var e=jspb.Message.getField(a,c);if(d||e)a.wrappers_[c]=new b(e);}return a.wrappers_[c]};
	goog.exportProperty(jspb.Message,"getWrapperField",jspb.Message.getWrapperField);jspb.Message.getRepeatedWrapperField=function(a,b,c){jspb.Message.wrapRepeatedField_(a,b,c);b=a.wrappers_[c];b==jspb.Message.EMPTY_LIST_SENTINEL_&&(b=a.wrappers_[c]=[]);return b};goog.exportProperty(jspb.Message,"getRepeatedWrapperField",jspb.Message.getRepeatedWrapperField);
	jspb.Message.wrapRepeatedField_=function(a,b,c){a.wrappers_||(a.wrappers_={});if(!a.wrappers_[c]){for(var d=jspb.Message.getRepeatedField(a,c),e=[],f=0;f<d.length;f++)e[f]=new b(d[f]);a.wrappers_[c]=e;}};jspb.Message.setWrapperField=function(a,b,c){jspb.asserts.assertInstanceof(a,jspb.Message);a.wrappers_||(a.wrappers_={});var d=c?c.toArray():c;a.wrappers_[b]=c;return jspb.Message.setField(a,b,d)};goog.exportProperty(jspb.Message,"setWrapperField",jspb.Message.setWrapperField);
	jspb.Message.setOneofWrapperField=function(a,b,c,d){jspb.asserts.assertInstanceof(a,jspb.Message);a.wrappers_||(a.wrappers_={});var e=d?d.toArray():d;a.wrappers_[b]=d;return jspb.Message.setOneofField(a,b,c,e)};goog.exportProperty(jspb.Message,"setOneofWrapperField",jspb.Message.setOneofWrapperField);
	jspb.Message.setRepeatedWrapperField=function(a,b,c){jspb.asserts.assertInstanceof(a,jspb.Message);a.wrappers_||(a.wrappers_={});c=c||[];for(var d=[],e=0;e<c.length;e++)d[e]=c[e].toArray();a.wrappers_[b]=c;return jspb.Message.setField(a,b,d)};goog.exportProperty(jspb.Message,"setRepeatedWrapperField",jspb.Message.setRepeatedWrapperField);
	jspb.Message.addToRepeatedWrapperField=function(a,b,c,d,e){jspb.Message.wrapRepeatedField_(a,d,b);var f=a.wrappers_[b];f||(f=a.wrappers_[b]=[]);c=c?c:new d;a=jspb.Message.getRepeatedField(a,b);void 0!=e?(f.splice(e,0,c),a.splice(e,0,c.toArray())):(f.push(c),a.push(c.toArray()));return c};goog.exportProperty(jspb.Message,"addToRepeatedWrapperField",jspb.Message.addToRepeatedWrapperField);
	jspb.Message.toMap=function(a,b,c,d){for(var e={},f=0;f<a.length;f++)e[b.call(a[f])]=c?c.call(a[f],d,a[f]):a[f];return e};goog.exportProperty(jspb.Message,"toMap",jspb.Message.toMap);jspb.Message.prototype.syncMapFields_=function(){if(this.wrappers_)for(var a in this.wrappers_){var b=this.wrappers_[a];if(Array.isArray(b))for(var c=0;c<b.length;c++)b[c]&&b[c].toArray();else b&&b.toArray();}};jspb.Message.prototype.toArray=function(){this.syncMapFields_();return this.array};
	goog.exportProperty(jspb.Message.prototype,"toArray",jspb.Message.prototype.toArray);jspb.Message.GENERATE_TO_STRING&&(jspb.Message.prototype.toString=function(){this.syncMapFields_();return this.array.toString()});
	jspb.Message.prototype.getExtension=function(a){if(this.extensionObject_){this.wrappers_||(this.wrappers_={});var b=a.fieldIndex;if(a.isRepeated){if(a.isMessageType())return this.wrappers_[b]||(this.wrappers_[b]=goog.array.map(this.extensionObject_[b]||[],function(b){return new a.ctor(b)})),this.wrappers_[b]}else if(a.isMessageType())return !this.wrappers_[b]&&this.extensionObject_[b]&&(this.wrappers_[b]=new a.ctor(this.extensionObject_[b])),this.wrappers_[b];return this.extensionObject_[b]}};
	goog.exportProperty(jspb.Message.prototype,"getExtension",jspb.Message.prototype.getExtension);
	jspb.Message.prototype.setExtension=function(a,b){this.wrappers_||(this.wrappers_={});jspb.Message.maybeInitEmptyExtensionObject_(this);var c=a.fieldIndex;a.isRepeated?(b=b||[],a.isMessageType()?(this.wrappers_[c]=b,this.extensionObject_[c]=goog.array.map(b,function(a){return a.toArray()})):this.extensionObject_[c]=b):a.isMessageType()?(this.wrappers_[c]=b,this.extensionObject_[c]=b?b.toArray():b):this.extensionObject_[c]=b;return this};goog.exportProperty(jspb.Message.prototype,"setExtension",jspb.Message.prototype.setExtension);
	jspb.Message.difference=function(a,b){if(!(a instanceof b.constructor))throw Error("Messages have different types.");var c=a.toArray();b=b.toArray();var d=[],e=0,f=c.length>b.length?c.length:b.length;a.getJsPbMessageId()&&(d[0]=a.getJsPbMessageId(),e=1);for(;e<f;e++)jspb.Message.compareFields(c[e],b[e])||(d[e]=b[e]);return new a.constructor(d)};goog.exportProperty(jspb.Message,"difference",jspb.Message.difference);
	jspb.Message.equals=function(a,b){return a==b||!(!a||!b)&&a instanceof b.constructor&&jspb.Message.compareFields(a.toArray(),b.toArray())};goog.exportProperty(jspb.Message,"equals",jspb.Message.equals);jspb.Message.compareExtensions=function(a,b){a=a||{};b=b||{};var c={},d;for(d in a)c[d]=0;for(d in b)c[d]=0;for(d in c)if(!jspb.Message.compareFields(a[d],b[d]))return !1;return !0};goog.exportProperty(jspb.Message,"compareExtensions",jspb.Message.compareExtensions);
	jspb.Message.compareFields=function(a,b){if(a==b)return !0;if(!goog.isObject(a)||!goog.isObject(b))return "number"===typeof a&&isNaN(a)||"number"===typeof b&&isNaN(b)?String(a)==String(b):!1;if(a.constructor!=b.constructor)return !1;if(jspb.Message.SUPPORTS_UINT8ARRAY_&&a.constructor===Uint8Array){if(a.length!=b.length)return !1;for(var c=0;c<a.length;c++)if(a[c]!=b[c])return !1;return !0}if(a.constructor===Array){var d=void 0,e=void 0,f=Math.max(a.length,b.length);for(c=0;c<f;c++){var g=a[c],h=b[c];g&&
	g.constructor==Object&&(jspb.asserts.assert(void 0===d),jspb.asserts.assert(c===a.length-1),d=g,g=void 0);h&&h.constructor==Object&&(jspb.asserts.assert(void 0===e),jspb.asserts.assert(c===b.length-1),e=h,h=void 0);if(!jspb.Message.compareFields(g,h))return !1}return d||e?(d=d||{},e=e||{},jspb.Message.compareExtensions(d,e)):!0}if(a.constructor===Object)return jspb.Message.compareExtensions(a,b);throw Error("Invalid type in JSPB array");};goog.exportProperty(jspb.Message,"compareFields",jspb.Message.compareFields);
	jspb.Message.prototype.cloneMessage=function(){return jspb.Message.cloneMessage(this)};goog.exportProperty(jspb.Message.prototype,"cloneMessage",jspb.Message.prototype.cloneMessage);jspb.Message.prototype.clone=function(){return jspb.Message.cloneMessage(this)};goog.exportProperty(jspb.Message.prototype,"clone",jspb.Message.prototype.clone);jspb.Message.clone=function(a){return jspb.Message.cloneMessage(a)};goog.exportProperty(jspb.Message,"clone",jspb.Message.clone);jspb.Message.cloneMessage=function(a){return new a.constructor(jspb.Message.clone_(a.toArray()))};
	jspb.Message.copyInto=function(a,b){jspb.asserts.assertInstanceof(a,jspb.Message);jspb.asserts.assertInstanceof(b,jspb.Message);jspb.asserts.assert(a.constructor==b.constructor,"Copy source and target message should have the same type.");a=jspb.Message.clone(a);for(var c=b.toArray(),d=a.toArray(),e=c.length=0;e<d.length;e++)c[e]=d[e];b.wrappers_=a.wrappers_;b.extensionObject_=a.extensionObject_;};goog.exportProperty(jspb.Message,"copyInto",jspb.Message.copyInto);
	jspb.Message.clone_=function(a){if(Array.isArray(a)){for(var b=Array(a.length),c=0;c<a.length;c++){var d=a[c];null!=d&&(b[c]="object"==typeof d?jspb.Message.clone_(jspb.asserts.assert(d)):d);}return b}if(jspb.Message.SUPPORTS_UINT8ARRAY_&&a instanceof Uint8Array)return new Uint8Array(a);b={};for(c in a)d=a[c],null!=d&&(b[c]="object"==typeof d?jspb.Message.clone_(jspb.asserts.assert(d)):d);return b};jspb.Message.registerMessageType=function(a,b){b.messageId=a;};
	goog.exportProperty(jspb.Message,"registerMessageType",jspb.Message.registerMessageType);jspb.Message.messageSetExtensions={};jspb.Message.messageSetExtensionsBinary={};jspb.Export={};(exports.Map=jspb.Map,exports.Message=jspb.Message,exports.BinaryReader=jspb.BinaryReader,exports.BinaryWriter=jspb.BinaryWriter,exports.ExtensionFieldInfo=jspb.ExtensionFieldInfo,exports.ExtensionFieldBinaryInfo=jspb.ExtensionFieldBinaryInfo,exports.exportSymbol=goog.exportSymbol,exports.inherits=goog.inherits,exports.object={extend:goog.object.extend},exports.typeOf=goog.typeOf);
} (googleProtobuf));

var calculator_options_pb = {};

(function (exports) {
	// source: mediapipe/framework/calculator_options.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	goog.exportSymbol('proto.mediapipe.CalculatorOptions', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.CalculatorOptions = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, 2, null, null);
	};
	goog.inherits(proto.mediapipe.CalculatorOptions, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.CalculatorOptions.displayName = 'proto.mediapipe.CalculatorOptions';
	}

	/**
	 * The extensions registered with this message class. This is a map of
	 * extension field number to fieldInfo object.
	 *
	 * For example:
	 *     { 123: {fieldIndex: 123, fieldName: {my_field_name: 0}, ctor: proto.example.MyMessage} }
	 *
	 * fieldName contains the JsCompiler renamed field name property so that it
	 * works in OPTIMIZED mode.
	 *
	 * @type {!Object<number, jspb.ExtensionFieldInfo>}
	 */
	proto.mediapipe.CalculatorOptions.extensions = {};


	/**
	 * The extensions registered with this message class. This is a map of
	 * extension field number to fieldInfo object.
	 *
	 * For example:
	 *     { 123: {fieldIndex: 123, fieldName: {my_field_name: 0}, ctor: proto.example.MyMessage} }
	 *
	 * fieldName contains the JsCompiler renamed field name property so that it
	 * works in OPTIMIZED mode.
	 *
	 * @type {!Object<number, jspb.ExtensionFieldBinaryInfo>}
	 */
	proto.mediapipe.CalculatorOptions.extensionsBinary = {};




	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.CalculatorOptions.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.CalculatorOptions.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.CalculatorOptions} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.CalculatorOptions.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    mergeFields: (f = jspb.Message.getBooleanField(msg, 1)) == null ? undefined : f
	  };

	  jspb.Message.toObjectExtension(/** @type {!jspb.Message} */ (msg), obj,
	      proto.mediapipe.CalculatorOptions.extensions, proto.mediapipe.CalculatorOptions.prototype.getExtension,
	      includeInstance);
	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.CalculatorOptions}
	 */
	proto.mediapipe.CalculatorOptions.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.CalculatorOptions;
	  return proto.mediapipe.CalculatorOptions.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.CalculatorOptions} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.CalculatorOptions}
	 */
	proto.mediapipe.CalculatorOptions.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setMergeFields(value);
	      break;
	    default:
	      jspb.Message.readBinaryExtension(msg, reader,
	        proto.mediapipe.CalculatorOptions.extensionsBinary,
	        proto.mediapipe.CalculatorOptions.prototype.getExtension,
	        proto.mediapipe.CalculatorOptions.prototype.setExtension);
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.CalculatorOptions.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.CalculatorOptions.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.CalculatorOptions} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.CalculatorOptions.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {boolean} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeBool(
	      1,
	      f
	    );
	  }
	  jspb.Message.serializeBinaryExtensions(message, writer,
	    proto.mediapipe.CalculatorOptions.extensionsBinary, proto.mediapipe.CalculatorOptions.prototype.getExtension);
	};


	/**
	 * optional bool merge_fields = 1;
	 * @return {boolean}
	 */
	proto.mediapipe.CalculatorOptions.prototype.getMergeFields = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.CalculatorOptions} returns this
	 */
	proto.mediapipe.CalculatorOptions.prototype.setMergeFields = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.CalculatorOptions} returns this
	 */
	proto.mediapipe.CalculatorOptions.prototype.clearMergeFields = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.CalculatorOptions.prototype.hasMergeFields = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	goog.object.extend(exports, proto.mediapipe);
} (calculator_options_pb));

var any_pb = {};

(function (exports) {
	// source: google/protobuf/any.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	goog.exportSymbol('proto.google.protobuf.Any', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.google.protobuf.Any = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.google.protobuf.Any, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.google.protobuf.Any.displayName = 'proto.google.protobuf.Any';
	}



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.google.protobuf.Any.prototype.toObject = function(opt_includeInstance) {
	  return proto.google.protobuf.Any.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.google.protobuf.Any} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.google.protobuf.Any.toObject = function(includeInstance, msg) {
	  var obj = {
	    typeUrl: jspb.Message.getFieldWithDefault(msg, 1, ""),
	    value: msg.getValue_asB64()
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.google.protobuf.Any}
	 */
	proto.google.protobuf.Any.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.google.protobuf.Any;
	  return proto.google.protobuf.Any.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.google.protobuf.Any} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.google.protobuf.Any}
	 */
	proto.google.protobuf.Any.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setTypeUrl(value);
	      break;
	    case 2:
	      var value = /** @type {!Uint8Array} */ (reader.readBytes());
	      msg.setValue(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.google.protobuf.Any.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.google.protobuf.Any.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.google.protobuf.Any} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.google.protobuf.Any.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = message.getTypeUrl();
	  if (f.length > 0) {
	    writer.writeString(
	      1,
	      f
	    );
	  }
	  f = message.getValue_asU8();
	  if (f.length > 0) {
	    writer.writeBytes(
	      2,
	      f
	    );
	  }
	};


	/**
	 * optional string type_url = 1;
	 * @return {string}
	 */
	proto.google.protobuf.Any.prototype.getTypeUrl = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.google.protobuf.Any} returns this
	 */
	proto.google.protobuf.Any.prototype.setTypeUrl = function(value) {
	  return jspb.Message.setProto3StringField(this, 1, value);
	};


	/**
	 * optional bytes value = 2;
	 * @return {!(string|Uint8Array)}
	 */
	proto.google.protobuf.Any.prototype.getValue = function() {
	  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
	};


	/**
	 * optional bytes value = 2;
	 * This is a type-conversion wrapper around `getValue()`
	 * @return {string}
	 */
	proto.google.protobuf.Any.prototype.getValue_asB64 = function() {
	  return /** @type {string} */ (jspb.Message.bytesAsB64(
	      this.getValue()));
	};


	/**
	 * optional bytes value = 2;
	 * Note that Uint8Array is not supported on all browsers.
	 * @see http://caniuse.com/Uint8Array
	 * This is a type-conversion wrapper around `getValue()`
	 * @return {!Uint8Array}
	 */
	proto.google.protobuf.Any.prototype.getValue_asU8 = function() {
	  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
	      this.getValue()));
	};


	/**
	 * @param {!(string|Uint8Array)} value
	 * @return {!proto.google.protobuf.Any} returns this
	 */
	proto.google.protobuf.Any.prototype.setValue = function(value) {
	  return jspb.Message.setProto3BytesField(this, 2, value);
	};


	goog.object.extend(exports, proto.google.protobuf);
	/* This code will be inserted into generated code for
	 * google/protobuf/any.proto. */

	/**
	 * Returns the type name contained in this instance, if any.
	 * @return {string|undefined}
	 */
	proto.google.protobuf.Any.prototype.getTypeName = function() {
	  return this.getTypeUrl().split('/').pop();
	};


	/**
	 * Packs the given message instance into this Any.
	 * For binary format usage only.
	 * @param {!Uint8Array} serialized The serialized data to pack.
	 * @param {string} name The type name of this message object.
	 * @param {string=} opt_typeUrlPrefix the type URL prefix.
	 */
	proto.google.protobuf.Any.prototype.pack = function(serialized, name,
	                                                    opt_typeUrlPrefix) {
	  if (!opt_typeUrlPrefix) {
	    opt_typeUrlPrefix = 'type.googleapis.com/';
	  }

	  if (opt_typeUrlPrefix.substr(-1) != '/') {
	    this.setTypeUrl(opt_typeUrlPrefix + '/' + name);
	  } else {
	    this.setTypeUrl(opt_typeUrlPrefix + name);
	  }

	  this.setValue(serialized);
	};


	/**
	 * @template T
	 * Unpacks this Any into the given message object.
	 * @param {function(Uint8Array):T} deserialize Function that will deserialize
	 *     the binary data properly.
	 * @param {string} name The expected type name of this message object.
	 * @return {?T} If the name matched the expected name, returns the deserialized
	 *     object, otherwise returns null.
	 */
	proto.google.protobuf.Any.prototype.unpack = function(deserialize, name) {
	  if (this.getTypeName() == name) {
	    return deserialize(this.getValue_asU8());
	  } else {
	    return null;
	  }
	};
} (any_pb));

var mediapipe_options_pb = {};

(function (exports) {
	// source: mediapipe/framework/mediapipe_options.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	goog.exportSymbol('proto.mediapipe.MediaPipeOptions', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.MediaPipeOptions = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, 1, null, null);
	};
	goog.inherits(proto.mediapipe.MediaPipeOptions, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.MediaPipeOptions.displayName = 'proto.mediapipe.MediaPipeOptions';
	}

	/**
	 * The extensions registered with this message class. This is a map of
	 * extension field number to fieldInfo object.
	 *
	 * For example:
	 *     { 123: {fieldIndex: 123, fieldName: {my_field_name: 0}, ctor: proto.example.MyMessage} }
	 *
	 * fieldName contains the JsCompiler renamed field name property so that it
	 * works in OPTIMIZED mode.
	 *
	 * @type {!Object<number, jspb.ExtensionFieldInfo>}
	 */
	proto.mediapipe.MediaPipeOptions.extensions = {};


	/**
	 * The extensions registered with this message class. This is a map of
	 * extension field number to fieldInfo object.
	 *
	 * For example:
	 *     { 123: {fieldIndex: 123, fieldName: {my_field_name: 0}, ctor: proto.example.MyMessage} }
	 *
	 * fieldName contains the JsCompiler renamed field name property so that it
	 * works in OPTIMIZED mode.
	 *
	 * @type {!Object<number, jspb.ExtensionFieldBinaryInfo>}
	 */
	proto.mediapipe.MediaPipeOptions.extensionsBinary = {};




	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.MediaPipeOptions.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.MediaPipeOptions.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.MediaPipeOptions} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.MediaPipeOptions.toObject = function(includeInstance, msg) {
	  var obj = {

	  };

	  jspb.Message.toObjectExtension(/** @type {!jspb.Message} */ (msg), obj,
	      proto.mediapipe.MediaPipeOptions.extensions, proto.mediapipe.MediaPipeOptions.prototype.getExtension,
	      includeInstance);
	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.MediaPipeOptions}
	 */
	proto.mediapipe.MediaPipeOptions.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.MediaPipeOptions;
	  return proto.mediapipe.MediaPipeOptions.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.MediaPipeOptions} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.MediaPipeOptions}
	 */
	proto.mediapipe.MediaPipeOptions.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    default:
	      jspb.Message.readBinaryExtension(msg, reader,
	        proto.mediapipe.MediaPipeOptions.extensionsBinary,
	        proto.mediapipe.MediaPipeOptions.prototype.getExtension,
	        proto.mediapipe.MediaPipeOptions.prototype.setExtension);
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.MediaPipeOptions.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.MediaPipeOptions.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.MediaPipeOptions} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.MediaPipeOptions.serializeBinaryToWriter = function(message, writer) {
	  jspb.Message.serializeBinaryExtensions(message, writer,
	    proto.mediapipe.MediaPipeOptions.extensionsBinary, proto.mediapipe.MediaPipeOptions.prototype.getExtension);
	};


	goog.object.extend(exports, proto.mediapipe);
} (mediapipe_options_pb));

var packet_factory_pb = {};

(function (exports) {
	// source: mediapipe/framework/packet_factory.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	goog.exportSymbol('proto.mediapipe.PacketFactoryConfig', null, global);
	goog.exportSymbol('proto.mediapipe.PacketFactoryOptions', null, global);
	goog.exportSymbol('proto.mediapipe.PacketManagerConfig', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.PacketFactoryOptions = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, 1, null, null);
	};
	goog.inherits(proto.mediapipe.PacketFactoryOptions, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.PacketFactoryOptions.displayName = 'proto.mediapipe.PacketFactoryOptions';
	}

	/**
	 * The extensions registered with this message class. This is a map of
	 * extension field number to fieldInfo object.
	 *
	 * For example:
	 *     { 123: {fieldIndex: 123, fieldName: {my_field_name: 0}, ctor: proto.example.MyMessage} }
	 *
	 * fieldName contains the JsCompiler renamed field name property so that it
	 * works in OPTIMIZED mode.
	 *
	 * @type {!Object<number, jspb.ExtensionFieldInfo>}
	 */
	proto.mediapipe.PacketFactoryOptions.extensions = {};


	/**
	 * The extensions registered with this message class. This is a map of
	 * extension field number to fieldInfo object.
	 *
	 * For example:
	 *     { 123: {fieldIndex: 123, fieldName: {my_field_name: 0}, ctor: proto.example.MyMessage} }
	 *
	 * fieldName contains the JsCompiler renamed field name property so that it
	 * works in OPTIMIZED mode.
	 *
	 * @type {!Object<number, jspb.ExtensionFieldBinaryInfo>}
	 */
	proto.mediapipe.PacketFactoryOptions.extensionsBinary = {};

	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.PacketFactoryConfig = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, 500, null, null);
	};
	goog.inherits(proto.mediapipe.PacketFactoryConfig, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.PacketFactoryConfig.displayName = 'proto.mediapipe.PacketFactoryConfig';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.PacketManagerConfig = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, proto.mediapipe.PacketManagerConfig.repeatedFields_, null);
	};
	goog.inherits(proto.mediapipe.PacketManagerConfig, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.PacketManagerConfig.displayName = 'proto.mediapipe.PacketManagerConfig';
	}



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.PacketFactoryOptions.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.PacketFactoryOptions.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.PacketFactoryOptions} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.PacketFactoryOptions.toObject = function(includeInstance, msg) {
	  var obj = {

	  };

	  jspb.Message.toObjectExtension(/** @type {!jspb.Message} */ (msg), obj,
	      proto.mediapipe.PacketFactoryOptions.extensions, proto.mediapipe.PacketFactoryOptions.prototype.getExtension,
	      includeInstance);
	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.PacketFactoryOptions}
	 */
	proto.mediapipe.PacketFactoryOptions.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.PacketFactoryOptions;
	  return proto.mediapipe.PacketFactoryOptions.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.PacketFactoryOptions} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.PacketFactoryOptions}
	 */
	proto.mediapipe.PacketFactoryOptions.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    default:
	      jspb.Message.readBinaryExtension(msg, reader,
	        proto.mediapipe.PacketFactoryOptions.extensionsBinary,
	        proto.mediapipe.PacketFactoryOptions.prototype.getExtension,
	        proto.mediapipe.PacketFactoryOptions.prototype.setExtension);
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.PacketFactoryOptions.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.PacketFactoryOptions.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.PacketFactoryOptions} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.PacketFactoryOptions.serializeBinaryToWriter = function(message, writer) {
	  jspb.Message.serializeBinaryExtensions(message, writer,
	    proto.mediapipe.PacketFactoryOptions.extensionsBinary, proto.mediapipe.PacketFactoryOptions.prototype.getExtension);
	};





	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.PacketFactoryConfig.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.PacketFactoryConfig.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.PacketFactoryConfig} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.PacketFactoryConfig.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    packetFactory: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
	    outputSidePacket: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f,
	    externalOutput: (f = jspb.Message.getField(msg, 1002)) == null ? undefined : f,
	    options: (f = msg.getOptions()) && proto.mediapipe.PacketFactoryOptions.toObject(includeInstance, f)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.PacketFactoryConfig}
	 */
	proto.mediapipe.PacketFactoryConfig.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.PacketFactoryConfig;
	  return proto.mediapipe.PacketFactoryConfig.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.PacketFactoryConfig} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.PacketFactoryConfig}
	 */
	proto.mediapipe.PacketFactoryConfig.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setPacketFactory(value);
	      break;
	    case 2:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setOutputSidePacket(value);
	      break;
	    case 1002:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setExternalOutput(value);
	      break;
	    case 3:
	      var value = new proto.mediapipe.PacketFactoryOptions;
	      reader.readMessage(value,proto.mediapipe.PacketFactoryOptions.deserializeBinaryFromReader);
	      msg.setOptions(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.PacketFactoryConfig.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.PacketFactoryConfig.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.PacketFactoryConfig} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.PacketFactoryConfig.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {string} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeString(
	      1,
	      f
	    );
	  }
	  f = /** @type {string} */ (jspb.Message.getField(message, 2));
	  if (f != null) {
	    writer.writeString(
	      2,
	      f
	    );
	  }
	  f = /** @type {string} */ (jspb.Message.getField(message, 1002));
	  if (f != null) {
	    writer.writeString(
	      1002,
	      f
	    );
	  }
	  f = message.getOptions();
	  if (f != null) {
	    writer.writeMessage(
	      3,
	      f,
	      proto.mediapipe.PacketFactoryOptions.serializeBinaryToWriter
	    );
	  }
	};


	/**
	 * optional string packet_factory = 1;
	 * @return {string}
	 */
	proto.mediapipe.PacketFactoryConfig.prototype.getPacketFactory = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.PacketFactoryConfig} returns this
	 */
	proto.mediapipe.PacketFactoryConfig.prototype.setPacketFactory = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.PacketFactoryConfig} returns this
	 */
	proto.mediapipe.PacketFactoryConfig.prototype.clearPacketFactory = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.PacketFactoryConfig.prototype.hasPacketFactory = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * optional string output_side_packet = 2;
	 * @return {string}
	 */
	proto.mediapipe.PacketFactoryConfig.prototype.getOutputSidePacket = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.PacketFactoryConfig} returns this
	 */
	proto.mediapipe.PacketFactoryConfig.prototype.setOutputSidePacket = function(value) {
	  return jspb.Message.setField(this, 2, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.PacketFactoryConfig} returns this
	 */
	proto.mediapipe.PacketFactoryConfig.prototype.clearOutputSidePacket = function() {
	  return jspb.Message.setField(this, 2, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.PacketFactoryConfig.prototype.hasOutputSidePacket = function() {
	  return jspb.Message.getField(this, 2) != null;
	};


	/**
	 * optional string external_output = 1002;
	 * @return {string}
	 */
	proto.mediapipe.PacketFactoryConfig.prototype.getExternalOutput = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1002, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.PacketFactoryConfig} returns this
	 */
	proto.mediapipe.PacketFactoryConfig.prototype.setExternalOutput = function(value) {
	  return jspb.Message.setField(this, 1002, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.PacketFactoryConfig} returns this
	 */
	proto.mediapipe.PacketFactoryConfig.prototype.clearExternalOutput = function() {
	  return jspb.Message.setField(this, 1002, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.PacketFactoryConfig.prototype.hasExternalOutput = function() {
	  return jspb.Message.getField(this, 1002) != null;
	};


	/**
	 * optional PacketFactoryOptions options = 3;
	 * @return {?proto.mediapipe.PacketFactoryOptions}
	 */
	proto.mediapipe.PacketFactoryConfig.prototype.getOptions = function() {
	  return /** @type{?proto.mediapipe.PacketFactoryOptions} */ (
	    jspb.Message.getWrapperField(this, proto.mediapipe.PacketFactoryOptions, 3));
	};


	/**
	 * @param {?proto.mediapipe.PacketFactoryOptions|undefined} value
	 * @return {!proto.mediapipe.PacketFactoryConfig} returns this
	*/
	proto.mediapipe.PacketFactoryConfig.prototype.setOptions = function(value) {
	  return jspb.Message.setWrapperField(this, 3, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.PacketFactoryConfig} returns this
	 */
	proto.mediapipe.PacketFactoryConfig.prototype.clearOptions = function() {
	  return this.setOptions(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.PacketFactoryConfig.prototype.hasOptions = function() {
	  return jspb.Message.getField(this, 3) != null;
	};



	/**
	 * List of repeated fields within this message type.
	 * @private {!Array<number>}
	 * @const
	 */
	proto.mediapipe.PacketManagerConfig.repeatedFields_ = [1];



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.PacketManagerConfig.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.PacketManagerConfig.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.PacketManagerConfig} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.PacketManagerConfig.toObject = function(includeInstance, msg) {
	  var obj = {
	    packetList: jspb.Message.toObjectList(msg.getPacketList(),
	    proto.mediapipe.PacketFactoryConfig.toObject, includeInstance)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.PacketManagerConfig}
	 */
	proto.mediapipe.PacketManagerConfig.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.PacketManagerConfig;
	  return proto.mediapipe.PacketManagerConfig.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.PacketManagerConfig} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.PacketManagerConfig}
	 */
	proto.mediapipe.PacketManagerConfig.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = new proto.mediapipe.PacketFactoryConfig;
	      reader.readMessage(value,proto.mediapipe.PacketFactoryConfig.deserializeBinaryFromReader);
	      msg.addPacket(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.PacketManagerConfig.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.PacketManagerConfig.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.PacketManagerConfig} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.PacketManagerConfig.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = message.getPacketList();
	  if (f.length > 0) {
	    writer.writeRepeatedMessage(
	      1,
	      f,
	      proto.mediapipe.PacketFactoryConfig.serializeBinaryToWriter
	    );
	  }
	};


	/**
	 * repeated PacketFactoryConfig packet = 1;
	 * @return {!Array<!proto.mediapipe.PacketFactoryConfig>}
	 */
	proto.mediapipe.PacketManagerConfig.prototype.getPacketList = function() {
	  return /** @type{!Array<!proto.mediapipe.PacketFactoryConfig>} */ (
	    jspb.Message.getRepeatedWrapperField(this, proto.mediapipe.PacketFactoryConfig, 1));
	};


	/**
	 * @param {!Array<!proto.mediapipe.PacketFactoryConfig>} value
	 * @return {!proto.mediapipe.PacketManagerConfig} returns this
	*/
	proto.mediapipe.PacketManagerConfig.prototype.setPacketList = function(value) {
	  return jspb.Message.setRepeatedWrapperField(this, 1, value);
	};


	/**
	 * @param {!proto.mediapipe.PacketFactoryConfig=} opt_value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.PacketFactoryConfig}
	 */
	proto.mediapipe.PacketManagerConfig.prototype.addPacket = function(opt_value, opt_index) {
	  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.mediapipe.PacketFactoryConfig, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.PacketManagerConfig} returns this
	 */
	proto.mediapipe.PacketManagerConfig.prototype.clearPacketList = function() {
	  return this.setPacketList([]);
	};


	goog.object.extend(exports, proto.mediapipe);
} (packet_factory_pb));

var packet_generator_pb = {};

(function (exports) {
	// source: mediapipe/framework/packet_generator.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	goog.exportSymbol('proto.mediapipe.PacketGeneratorConfig', null, global);
	goog.exportSymbol('proto.mediapipe.PacketGeneratorOptions', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.PacketGeneratorOptions = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, 2, null, null);
	};
	goog.inherits(proto.mediapipe.PacketGeneratorOptions, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.PacketGeneratorOptions.displayName = 'proto.mediapipe.PacketGeneratorOptions';
	}

	/**
	 * The extensions registered with this message class. This is a map of
	 * extension field number to fieldInfo object.
	 *
	 * For example:
	 *     { 123: {fieldIndex: 123, fieldName: {my_field_name: 0}, ctor: proto.example.MyMessage} }
	 *
	 * fieldName contains the JsCompiler renamed field name property so that it
	 * works in OPTIMIZED mode.
	 *
	 * @type {!Object<number, jspb.ExtensionFieldInfo>}
	 */
	proto.mediapipe.PacketGeneratorOptions.extensions = {};


	/**
	 * The extensions registered with this message class. This is a map of
	 * extension field number to fieldInfo object.
	 *
	 * For example:
	 *     { 123: {fieldIndex: 123, fieldName: {my_field_name: 0}, ctor: proto.example.MyMessage} }
	 *
	 * fieldName contains the JsCompiler renamed field name property so that it
	 * works in OPTIMIZED mode.
	 *
	 * @type {!Object<number, jspb.ExtensionFieldBinaryInfo>}
	 */
	proto.mediapipe.PacketGeneratorOptions.extensionsBinary = {};

	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.PacketGeneratorConfig = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, 500, proto.mediapipe.PacketGeneratorConfig.repeatedFields_, null);
	};
	goog.inherits(proto.mediapipe.PacketGeneratorConfig, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.PacketGeneratorConfig.displayName = 'proto.mediapipe.PacketGeneratorConfig';
	}



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.PacketGeneratorOptions.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.PacketGeneratorOptions.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.PacketGeneratorOptions} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.PacketGeneratorOptions.toObject = function(includeInstance, msg) {
	  var obj = {
	    mergeFields: jspb.Message.getBooleanFieldWithDefault(msg, 1, true)
	  };

	  jspb.Message.toObjectExtension(/** @type {!jspb.Message} */ (msg), obj,
	      proto.mediapipe.PacketGeneratorOptions.extensions, proto.mediapipe.PacketGeneratorOptions.prototype.getExtension,
	      includeInstance);
	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.PacketGeneratorOptions}
	 */
	proto.mediapipe.PacketGeneratorOptions.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.PacketGeneratorOptions;
	  return proto.mediapipe.PacketGeneratorOptions.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.PacketGeneratorOptions} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.PacketGeneratorOptions}
	 */
	proto.mediapipe.PacketGeneratorOptions.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setMergeFields(value);
	      break;
	    default:
	      jspb.Message.readBinaryExtension(msg, reader,
	        proto.mediapipe.PacketGeneratorOptions.extensionsBinary,
	        proto.mediapipe.PacketGeneratorOptions.prototype.getExtension,
	        proto.mediapipe.PacketGeneratorOptions.prototype.setExtension);
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.PacketGeneratorOptions.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.PacketGeneratorOptions.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.PacketGeneratorOptions} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.PacketGeneratorOptions.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {boolean} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeBool(
	      1,
	      f
	    );
	  }
	  jspb.Message.serializeBinaryExtensions(message, writer,
	    proto.mediapipe.PacketGeneratorOptions.extensionsBinary, proto.mediapipe.PacketGeneratorOptions.prototype.getExtension);
	};


	/**
	 * optional bool merge_fields = 1;
	 * @return {boolean}
	 */
	proto.mediapipe.PacketGeneratorOptions.prototype.getMergeFields = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, true));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.PacketGeneratorOptions} returns this
	 */
	proto.mediapipe.PacketGeneratorOptions.prototype.setMergeFields = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.PacketGeneratorOptions} returns this
	 */
	proto.mediapipe.PacketGeneratorOptions.prototype.clearMergeFields = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.PacketGeneratorOptions.prototype.hasMergeFields = function() {
	  return jspb.Message.getField(this, 1) != null;
	};



	/**
	 * List of repeated fields within this message type.
	 * @private {!Array<number>}
	 * @const
	 */
	proto.mediapipe.PacketGeneratorConfig.repeatedFields_ = [2,1002,3,1003];



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.PacketGeneratorConfig.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.PacketGeneratorConfig} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.PacketGeneratorConfig.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    packetGenerator: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
	    inputSidePacketList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
	    externalInputList: (f = jspb.Message.getRepeatedField(msg, 1002)) == null ? undefined : f,
	    outputSidePacketList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f,
	    externalOutputList: (f = jspb.Message.getRepeatedField(msg, 1003)) == null ? undefined : f,
	    options: (f = msg.getOptions()) && proto.mediapipe.PacketGeneratorOptions.toObject(includeInstance, f)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.PacketGeneratorConfig}
	 */
	proto.mediapipe.PacketGeneratorConfig.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.PacketGeneratorConfig;
	  return proto.mediapipe.PacketGeneratorConfig.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.PacketGeneratorConfig} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.PacketGeneratorConfig}
	 */
	proto.mediapipe.PacketGeneratorConfig.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setPacketGenerator(value);
	      break;
	    case 2:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addInputSidePacket(value);
	      break;
	    case 1002:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addExternalInput(value);
	      break;
	    case 3:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addOutputSidePacket(value);
	      break;
	    case 1003:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addExternalOutput(value);
	      break;
	    case 4:
	      var value = new proto.mediapipe.PacketGeneratorOptions;
	      reader.readMessage(value,proto.mediapipe.PacketGeneratorOptions.deserializeBinaryFromReader);
	      msg.setOptions(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.PacketGeneratorConfig.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.PacketGeneratorConfig} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.PacketGeneratorConfig.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {string} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeString(
	      1,
	      f
	    );
	  }
	  f = message.getInputSidePacketList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      2,
	      f
	    );
	  }
	  f = message.getExternalInputList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      1002,
	      f
	    );
	  }
	  f = message.getOutputSidePacketList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      3,
	      f
	    );
	  }
	  f = message.getExternalOutputList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      1003,
	      f
	    );
	  }
	  f = message.getOptions();
	  if (f != null) {
	    writer.writeMessage(
	      4,
	      f,
	      proto.mediapipe.PacketGeneratorOptions.serializeBinaryToWriter
	    );
	  }
	};


	/**
	 * optional string packet_generator = 1;
	 * @return {string}
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.getPacketGenerator = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.PacketGeneratorConfig} returns this
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.setPacketGenerator = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.PacketGeneratorConfig} returns this
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.clearPacketGenerator = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.hasPacketGenerator = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * repeated string input_side_packet = 2;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.getInputSidePacketList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 2));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.PacketGeneratorConfig} returns this
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.setInputSidePacketList = function(value) {
	  return jspb.Message.setField(this, 2, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.PacketGeneratorConfig} returns this
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.addInputSidePacket = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.PacketGeneratorConfig} returns this
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.clearInputSidePacketList = function() {
	  return this.setInputSidePacketList([]);
	};


	/**
	 * repeated string external_input = 1002;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.getExternalInputList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1002));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.PacketGeneratorConfig} returns this
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.setExternalInputList = function(value) {
	  return jspb.Message.setField(this, 1002, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.PacketGeneratorConfig} returns this
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.addExternalInput = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 1002, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.PacketGeneratorConfig} returns this
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.clearExternalInputList = function() {
	  return this.setExternalInputList([]);
	};


	/**
	 * repeated string output_side_packet = 3;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.getOutputSidePacketList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 3));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.PacketGeneratorConfig} returns this
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.setOutputSidePacketList = function(value) {
	  return jspb.Message.setField(this, 3, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.PacketGeneratorConfig} returns this
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.addOutputSidePacket = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.PacketGeneratorConfig} returns this
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.clearOutputSidePacketList = function() {
	  return this.setOutputSidePacketList([]);
	};


	/**
	 * repeated string external_output = 1003;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.getExternalOutputList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1003));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.PacketGeneratorConfig} returns this
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.setExternalOutputList = function(value) {
	  return jspb.Message.setField(this, 1003, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.PacketGeneratorConfig} returns this
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.addExternalOutput = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 1003, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.PacketGeneratorConfig} returns this
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.clearExternalOutputList = function() {
	  return this.setExternalOutputList([]);
	};


	/**
	 * optional PacketGeneratorOptions options = 4;
	 * @return {?proto.mediapipe.PacketGeneratorOptions}
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.getOptions = function() {
	  return /** @type{?proto.mediapipe.PacketGeneratorOptions} */ (
	    jspb.Message.getWrapperField(this, proto.mediapipe.PacketGeneratorOptions, 4));
	};


	/**
	 * @param {?proto.mediapipe.PacketGeneratorOptions|undefined} value
	 * @return {!proto.mediapipe.PacketGeneratorConfig} returns this
	*/
	proto.mediapipe.PacketGeneratorConfig.prototype.setOptions = function(value) {
	  return jspb.Message.setWrapperField(this, 4, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.PacketGeneratorConfig} returns this
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.clearOptions = function() {
	  return this.setOptions(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.PacketGeneratorConfig.prototype.hasOptions = function() {
	  return jspb.Message.getField(this, 4) != null;
	};


	goog.object.extend(exports, proto.mediapipe);
} (packet_generator_pb));

var status_handler_pb = {};

(function (exports) {
	// source: mediapipe/framework/status_handler.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	var mediapipe_framework_mediapipe_options_pb = mediapipe_options_pb;
	goog.object.extend(proto, mediapipe_framework_mediapipe_options_pb);
	goog.exportSymbol('proto.mediapipe.StatusHandlerConfig', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.StatusHandlerConfig = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, 500, proto.mediapipe.StatusHandlerConfig.repeatedFields_, null);
	};
	goog.inherits(proto.mediapipe.StatusHandlerConfig, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.StatusHandlerConfig.displayName = 'proto.mediapipe.StatusHandlerConfig';
	}

	/**
	 * List of repeated fields within this message type.
	 * @private {!Array<number>}
	 * @const
	 */
	proto.mediapipe.StatusHandlerConfig.repeatedFields_ = [2,1002];



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.StatusHandlerConfig.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.StatusHandlerConfig.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.StatusHandlerConfig} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.StatusHandlerConfig.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    statusHandler: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
	    inputSidePacketList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
	    externalInputList: (f = jspb.Message.getRepeatedField(msg, 1002)) == null ? undefined : f,
	    options: (f = msg.getOptions()) && mediapipe_framework_mediapipe_options_pb.MediaPipeOptions.toObject(includeInstance, f)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.StatusHandlerConfig}
	 */
	proto.mediapipe.StatusHandlerConfig.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.StatusHandlerConfig;
	  return proto.mediapipe.StatusHandlerConfig.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.StatusHandlerConfig} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.StatusHandlerConfig}
	 */
	proto.mediapipe.StatusHandlerConfig.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setStatusHandler(value);
	      break;
	    case 2:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addInputSidePacket(value);
	      break;
	    case 1002:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addExternalInput(value);
	      break;
	    case 3:
	      var value = new mediapipe_framework_mediapipe_options_pb.MediaPipeOptions;
	      reader.readMessage(value,mediapipe_framework_mediapipe_options_pb.MediaPipeOptions.deserializeBinaryFromReader);
	      msg.setOptions(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.StatusHandlerConfig.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.StatusHandlerConfig.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.StatusHandlerConfig} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.StatusHandlerConfig.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {string} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeString(
	      1,
	      f
	    );
	  }
	  f = message.getInputSidePacketList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      2,
	      f
	    );
	  }
	  f = message.getExternalInputList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      1002,
	      f
	    );
	  }
	  f = message.getOptions();
	  if (f != null) {
	    writer.writeMessage(
	      3,
	      f,
	      mediapipe_framework_mediapipe_options_pb.MediaPipeOptions.serializeBinaryToWriter
	    );
	  }
	};


	/**
	 * optional string status_handler = 1;
	 * @return {string}
	 */
	proto.mediapipe.StatusHandlerConfig.prototype.getStatusHandler = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.StatusHandlerConfig} returns this
	 */
	proto.mediapipe.StatusHandlerConfig.prototype.setStatusHandler = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.StatusHandlerConfig} returns this
	 */
	proto.mediapipe.StatusHandlerConfig.prototype.clearStatusHandler = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.StatusHandlerConfig.prototype.hasStatusHandler = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * repeated string input_side_packet = 2;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.StatusHandlerConfig.prototype.getInputSidePacketList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 2));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.StatusHandlerConfig} returns this
	 */
	proto.mediapipe.StatusHandlerConfig.prototype.setInputSidePacketList = function(value) {
	  return jspb.Message.setField(this, 2, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.StatusHandlerConfig} returns this
	 */
	proto.mediapipe.StatusHandlerConfig.prototype.addInputSidePacket = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.StatusHandlerConfig} returns this
	 */
	proto.mediapipe.StatusHandlerConfig.prototype.clearInputSidePacketList = function() {
	  return this.setInputSidePacketList([]);
	};


	/**
	 * repeated string external_input = 1002;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.StatusHandlerConfig.prototype.getExternalInputList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1002));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.StatusHandlerConfig} returns this
	 */
	proto.mediapipe.StatusHandlerConfig.prototype.setExternalInputList = function(value) {
	  return jspb.Message.setField(this, 1002, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.StatusHandlerConfig} returns this
	 */
	proto.mediapipe.StatusHandlerConfig.prototype.addExternalInput = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 1002, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.StatusHandlerConfig} returns this
	 */
	proto.mediapipe.StatusHandlerConfig.prototype.clearExternalInputList = function() {
	  return this.setExternalInputList([]);
	};


	/**
	 * optional MediaPipeOptions options = 3;
	 * @return {?proto.mediapipe.MediaPipeOptions}
	 */
	proto.mediapipe.StatusHandlerConfig.prototype.getOptions = function() {
	  return /** @type{?proto.mediapipe.MediaPipeOptions} */ (
	    jspb.Message.getWrapperField(this, mediapipe_framework_mediapipe_options_pb.MediaPipeOptions, 3));
	};


	/**
	 * @param {?proto.mediapipe.MediaPipeOptions|undefined} value
	 * @return {!proto.mediapipe.StatusHandlerConfig} returns this
	*/
	proto.mediapipe.StatusHandlerConfig.prototype.setOptions = function(value) {
	  return jspb.Message.setWrapperField(this, 3, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.StatusHandlerConfig} returns this
	 */
	proto.mediapipe.StatusHandlerConfig.prototype.clearOptions = function() {
	  return this.setOptions(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.StatusHandlerConfig.prototype.hasOptions = function() {
	  return jspb.Message.getField(this, 3) != null;
	};


	goog.object.extend(exports, proto.mediapipe);
} (status_handler_pb));

var stream_handler_pb = {};

(function (exports) {
	// source: mediapipe/framework/stream_handler.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	var mediapipe_framework_mediapipe_options_pb = mediapipe_options_pb;
	goog.object.extend(proto, mediapipe_framework_mediapipe_options_pb);
	goog.exportSymbol('proto.mediapipe.InputStreamHandlerConfig', null, global);
	goog.exportSymbol('proto.mediapipe.OutputStreamHandlerConfig', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.InputStreamHandlerConfig = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.InputStreamHandlerConfig, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.InputStreamHandlerConfig.displayName = 'proto.mediapipe.InputStreamHandlerConfig';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.OutputStreamHandlerConfig = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, proto.mediapipe.OutputStreamHandlerConfig.repeatedFields_, null);
	};
	goog.inherits(proto.mediapipe.OutputStreamHandlerConfig, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.OutputStreamHandlerConfig.displayName = 'proto.mediapipe.OutputStreamHandlerConfig';
	}



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.InputStreamHandlerConfig.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.InputStreamHandlerConfig.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.InputStreamHandlerConfig} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InputStreamHandlerConfig.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    inputStreamHandler: jspb.Message.getFieldWithDefault(msg, 1, "DefaultInputStreamHandler"),
	    options: (f = msg.getOptions()) && mediapipe_framework_mediapipe_options_pb.MediaPipeOptions.toObject(includeInstance, f)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.InputStreamHandlerConfig}
	 */
	proto.mediapipe.InputStreamHandlerConfig.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.InputStreamHandlerConfig;
	  return proto.mediapipe.InputStreamHandlerConfig.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.InputStreamHandlerConfig} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.InputStreamHandlerConfig}
	 */
	proto.mediapipe.InputStreamHandlerConfig.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setInputStreamHandler(value);
	      break;
	    case 3:
	      var value = new mediapipe_framework_mediapipe_options_pb.MediaPipeOptions;
	      reader.readMessage(value,mediapipe_framework_mediapipe_options_pb.MediaPipeOptions.deserializeBinaryFromReader);
	      msg.setOptions(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.InputStreamHandlerConfig.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.InputStreamHandlerConfig.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.InputStreamHandlerConfig} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InputStreamHandlerConfig.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {string} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeString(
	      1,
	      f
	    );
	  }
	  f = message.getOptions();
	  if (f != null) {
	    writer.writeMessage(
	      3,
	      f,
	      mediapipe_framework_mediapipe_options_pb.MediaPipeOptions.serializeBinaryToWriter
	    );
	  }
	};


	/**
	 * optional string input_stream_handler = 1;
	 * @return {string}
	 */
	proto.mediapipe.InputStreamHandlerConfig.prototype.getInputStreamHandler = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, "DefaultInputStreamHandler"));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.InputStreamHandlerConfig} returns this
	 */
	proto.mediapipe.InputStreamHandlerConfig.prototype.setInputStreamHandler = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InputStreamHandlerConfig} returns this
	 */
	proto.mediapipe.InputStreamHandlerConfig.prototype.clearInputStreamHandler = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InputStreamHandlerConfig.prototype.hasInputStreamHandler = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * optional MediaPipeOptions options = 3;
	 * @return {?proto.mediapipe.MediaPipeOptions}
	 */
	proto.mediapipe.InputStreamHandlerConfig.prototype.getOptions = function() {
	  return /** @type{?proto.mediapipe.MediaPipeOptions} */ (
	    jspb.Message.getWrapperField(this, mediapipe_framework_mediapipe_options_pb.MediaPipeOptions, 3));
	};


	/**
	 * @param {?proto.mediapipe.MediaPipeOptions|undefined} value
	 * @return {!proto.mediapipe.InputStreamHandlerConfig} returns this
	*/
	proto.mediapipe.InputStreamHandlerConfig.prototype.setOptions = function(value) {
	  return jspb.Message.setWrapperField(this, 3, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.InputStreamHandlerConfig} returns this
	 */
	proto.mediapipe.InputStreamHandlerConfig.prototype.clearOptions = function() {
	  return this.setOptions(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InputStreamHandlerConfig.prototype.hasOptions = function() {
	  return jspb.Message.getField(this, 3) != null;
	};



	/**
	 * List of repeated fields within this message type.
	 * @private {!Array<number>}
	 * @const
	 */
	proto.mediapipe.OutputStreamHandlerConfig.repeatedFields_ = [2];



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.OutputStreamHandlerConfig.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.OutputStreamHandlerConfig.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.OutputStreamHandlerConfig} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.OutputStreamHandlerConfig.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    outputStreamHandler: jspb.Message.getFieldWithDefault(msg, 1, "InOrderOutputStreamHandler"),
	    inputSidePacketList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
	    options: (f = msg.getOptions()) && mediapipe_framework_mediapipe_options_pb.MediaPipeOptions.toObject(includeInstance, f)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.OutputStreamHandlerConfig}
	 */
	proto.mediapipe.OutputStreamHandlerConfig.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.OutputStreamHandlerConfig;
	  return proto.mediapipe.OutputStreamHandlerConfig.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.OutputStreamHandlerConfig} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.OutputStreamHandlerConfig}
	 */
	proto.mediapipe.OutputStreamHandlerConfig.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setOutputStreamHandler(value);
	      break;
	    case 2:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addInputSidePacket(value);
	      break;
	    case 3:
	      var value = new mediapipe_framework_mediapipe_options_pb.MediaPipeOptions;
	      reader.readMessage(value,mediapipe_framework_mediapipe_options_pb.MediaPipeOptions.deserializeBinaryFromReader);
	      msg.setOptions(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.OutputStreamHandlerConfig.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.OutputStreamHandlerConfig.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.OutputStreamHandlerConfig} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.OutputStreamHandlerConfig.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {string} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeString(
	      1,
	      f
	    );
	  }
	  f = message.getInputSidePacketList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      2,
	      f
	    );
	  }
	  f = message.getOptions();
	  if (f != null) {
	    writer.writeMessage(
	      3,
	      f,
	      mediapipe_framework_mediapipe_options_pb.MediaPipeOptions.serializeBinaryToWriter
	    );
	  }
	};


	/**
	 * optional string output_stream_handler = 1;
	 * @return {string}
	 */
	proto.mediapipe.OutputStreamHandlerConfig.prototype.getOutputStreamHandler = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, "InOrderOutputStreamHandler"));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.OutputStreamHandlerConfig} returns this
	 */
	proto.mediapipe.OutputStreamHandlerConfig.prototype.setOutputStreamHandler = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.OutputStreamHandlerConfig} returns this
	 */
	proto.mediapipe.OutputStreamHandlerConfig.prototype.clearOutputStreamHandler = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.OutputStreamHandlerConfig.prototype.hasOutputStreamHandler = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * repeated string input_side_packet = 2;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.OutputStreamHandlerConfig.prototype.getInputSidePacketList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 2));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.OutputStreamHandlerConfig} returns this
	 */
	proto.mediapipe.OutputStreamHandlerConfig.prototype.setInputSidePacketList = function(value) {
	  return jspb.Message.setField(this, 2, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.OutputStreamHandlerConfig} returns this
	 */
	proto.mediapipe.OutputStreamHandlerConfig.prototype.addInputSidePacket = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.OutputStreamHandlerConfig} returns this
	 */
	proto.mediapipe.OutputStreamHandlerConfig.prototype.clearInputSidePacketList = function() {
	  return this.setInputSidePacketList([]);
	};


	/**
	 * optional MediaPipeOptions options = 3;
	 * @return {?proto.mediapipe.MediaPipeOptions}
	 */
	proto.mediapipe.OutputStreamHandlerConfig.prototype.getOptions = function() {
	  return /** @type{?proto.mediapipe.MediaPipeOptions} */ (
	    jspb.Message.getWrapperField(this, mediapipe_framework_mediapipe_options_pb.MediaPipeOptions, 3));
	};


	/**
	 * @param {?proto.mediapipe.MediaPipeOptions|undefined} value
	 * @return {!proto.mediapipe.OutputStreamHandlerConfig} returns this
	*/
	proto.mediapipe.OutputStreamHandlerConfig.prototype.setOptions = function(value) {
	  return jspb.Message.setWrapperField(this, 3, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.OutputStreamHandlerConfig} returns this
	 */
	proto.mediapipe.OutputStreamHandlerConfig.prototype.clearOptions = function() {
	  return this.setOptions(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.OutputStreamHandlerConfig.prototype.hasOptions = function() {
	  return jspb.Message.getField(this, 3) != null;
	};


	goog.object.extend(exports, proto.mediapipe);
} (stream_handler_pb));

(function (exports) {
	// source: mediapipe/framework/calculator.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	var mediapipe_framework_calculator_options_pb = calculator_options_pb;
	goog.object.extend(proto, mediapipe_framework_calculator_options_pb);
	var google_protobuf_any_pb = any_pb;
	goog.object.extend(proto, google_protobuf_any_pb);
	var mediapipe_framework_mediapipe_options_pb = mediapipe_options_pb;
	goog.object.extend(proto, mediapipe_framework_mediapipe_options_pb);
	var mediapipe_framework_packet_factory_pb = packet_factory_pb;
	goog.object.extend(proto, mediapipe_framework_packet_factory_pb);
	var mediapipe_framework_packet_generator_pb = packet_generator_pb;
	goog.object.extend(proto, mediapipe_framework_packet_generator_pb);
	var mediapipe_framework_status_handler_pb = status_handler_pb;
	goog.object.extend(proto, mediapipe_framework_status_handler_pb);
	var mediapipe_framework_stream_handler_pb = stream_handler_pb;
	goog.object.extend(proto, mediapipe_framework_stream_handler_pb);
	goog.exportSymbol('proto.mediapipe.CalculatorGraphConfig', null, global);
	goog.exportSymbol('proto.mediapipe.CalculatorGraphConfig.Node', null, global);
	goog.exportSymbol('proto.mediapipe.ExecutorConfig', null, global);
	goog.exportSymbol('proto.mediapipe.InputCollection', null, global);
	goog.exportSymbol('proto.mediapipe.InputCollection.InputType', null, global);
	goog.exportSymbol('proto.mediapipe.InputCollectionSet', null, global);
	goog.exportSymbol('proto.mediapipe.InputStreamInfo', null, global);
	goog.exportSymbol('proto.mediapipe.ProfilerConfig', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.ExecutorConfig = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.ExecutorConfig, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.ExecutorConfig.displayName = 'proto.mediapipe.ExecutorConfig';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.InputCollection = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, 500, proto.mediapipe.InputCollection.repeatedFields_, null);
	};
	goog.inherits(proto.mediapipe.InputCollection, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.InputCollection.displayName = 'proto.mediapipe.InputCollection';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.InputCollectionSet = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, proto.mediapipe.InputCollectionSet.repeatedFields_, null);
	};
	goog.inherits(proto.mediapipe.InputCollectionSet, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.InputCollectionSet.displayName = 'proto.mediapipe.InputCollectionSet';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.InputStreamInfo = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.InputStreamInfo, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.InputStreamInfo.displayName = 'proto.mediapipe.InputStreamInfo';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.ProfilerConfig = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, proto.mediapipe.ProfilerConfig.repeatedFields_, null);
	};
	goog.inherits(proto.mediapipe.ProfilerConfig, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.ProfilerConfig.displayName = 'proto.mediapipe.ProfilerConfig';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.CalculatorGraphConfig = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, 500, proto.mediapipe.CalculatorGraphConfig.repeatedFields_, null);
	};
	goog.inherits(proto.mediapipe.CalculatorGraphConfig, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.CalculatorGraphConfig.displayName = 'proto.mediapipe.CalculatorGraphConfig';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.CalculatorGraphConfig.Node = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, 500, proto.mediapipe.CalculatorGraphConfig.Node.repeatedFields_, null);
	};
	goog.inherits(proto.mediapipe.CalculatorGraphConfig.Node, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.CalculatorGraphConfig.Node.displayName = 'proto.mediapipe.CalculatorGraphConfig.Node';
	}



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.ExecutorConfig.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.ExecutorConfig.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.ExecutorConfig} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.ExecutorConfig.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
	    type: jspb.Message.getFieldWithDefault(msg, 2, ""),
	    options: (f = msg.getOptions()) && mediapipe_framework_mediapipe_options_pb.MediaPipeOptions.toObject(includeInstance, f)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.ExecutorConfig}
	 */
	proto.mediapipe.ExecutorConfig.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.ExecutorConfig;
	  return proto.mediapipe.ExecutorConfig.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.ExecutorConfig} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.ExecutorConfig}
	 */
	proto.mediapipe.ExecutorConfig.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setName(value);
	      break;
	    case 2:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setType(value);
	      break;
	    case 3:
	      var value = new mediapipe_framework_mediapipe_options_pb.MediaPipeOptions;
	      reader.readMessage(value,mediapipe_framework_mediapipe_options_pb.MediaPipeOptions.deserializeBinaryFromReader);
	      msg.setOptions(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.ExecutorConfig.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.ExecutorConfig.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.ExecutorConfig} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.ExecutorConfig.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = message.getName();
	  if (f.length > 0) {
	    writer.writeString(
	      1,
	      f
	    );
	  }
	  f = message.getType();
	  if (f.length > 0) {
	    writer.writeString(
	      2,
	      f
	    );
	  }
	  f = message.getOptions();
	  if (f != null) {
	    writer.writeMessage(
	      3,
	      f,
	      mediapipe_framework_mediapipe_options_pb.MediaPipeOptions.serializeBinaryToWriter
	    );
	  }
	};


	/**
	 * optional string name = 1;
	 * @return {string}
	 */
	proto.mediapipe.ExecutorConfig.prototype.getName = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.ExecutorConfig} returns this
	 */
	proto.mediapipe.ExecutorConfig.prototype.setName = function(value) {
	  return jspb.Message.setProto3StringField(this, 1, value);
	};


	/**
	 * optional string type = 2;
	 * @return {string}
	 */
	proto.mediapipe.ExecutorConfig.prototype.getType = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.ExecutorConfig} returns this
	 */
	proto.mediapipe.ExecutorConfig.prototype.setType = function(value) {
	  return jspb.Message.setProto3StringField(this, 2, value);
	};


	/**
	 * optional MediaPipeOptions options = 3;
	 * @return {?proto.mediapipe.MediaPipeOptions}
	 */
	proto.mediapipe.ExecutorConfig.prototype.getOptions = function() {
	  return /** @type{?proto.mediapipe.MediaPipeOptions} */ (
	    jspb.Message.getWrapperField(this, mediapipe_framework_mediapipe_options_pb.MediaPipeOptions, 3));
	};


	/**
	 * @param {?proto.mediapipe.MediaPipeOptions|undefined} value
	 * @return {!proto.mediapipe.ExecutorConfig} returns this
	*/
	proto.mediapipe.ExecutorConfig.prototype.setOptions = function(value) {
	  return jspb.Message.setWrapperField(this, 3, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.ExecutorConfig} returns this
	 */
	proto.mediapipe.ExecutorConfig.prototype.clearOptions = function() {
	  return this.setOptions(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.ExecutorConfig.prototype.hasOptions = function() {
	  return jspb.Message.getField(this, 3) != null;
	};



	/**
	 * List of repeated fields within this message type.
	 * @private {!Array<number>}
	 * @const
	 */
	proto.mediapipe.InputCollection.repeatedFields_ = [2,1002];



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.InputCollection.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.InputCollection.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.InputCollection} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InputCollection.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
	    sidePacketNameList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
	    externalInputNameList: (f = jspb.Message.getRepeatedField(msg, 1002)) == null ? undefined : f,
	    inputType: jspb.Message.getFieldWithDefault(msg, 3, 0),
	    fileName: jspb.Message.getFieldWithDefault(msg, 4, "")
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.InputCollection}
	 */
	proto.mediapipe.InputCollection.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.InputCollection;
	  return proto.mediapipe.InputCollection.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.InputCollection} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.InputCollection}
	 */
	proto.mediapipe.InputCollection.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setName(value);
	      break;
	    case 2:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addSidePacketName(value);
	      break;
	    case 1002:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addExternalInputName(value);
	      break;
	    case 3:
	      var value = /** @type {!proto.mediapipe.InputCollection.InputType} */ (reader.readEnum());
	      msg.setInputType(value);
	      break;
	    case 4:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setFileName(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.InputCollection.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.InputCollection.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.InputCollection} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InputCollection.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = message.getName();
	  if (f.length > 0) {
	    writer.writeString(
	      1,
	      f
	    );
	  }
	  f = message.getSidePacketNameList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      2,
	      f
	    );
	  }
	  f = message.getExternalInputNameList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      1002,
	      f
	    );
	  }
	  f = message.getInputType();
	  if (f !== 0.0) {
	    writer.writeEnum(
	      3,
	      f
	    );
	  }
	  f = message.getFileName();
	  if (f.length > 0) {
	    writer.writeString(
	      4,
	      f
	    );
	  }
	};


	/**
	 * @enum {number}
	 */
	proto.mediapipe.InputCollection.InputType = {
	  UNKNOWN: 0,
	  RECORDIO: 1,
	  FOREIGN_RECORDIO: 2,
	  FOREIGN_CSV_TEXT: 3,
	  INVALID_UPPER_BOUND: 4
	};

	/**
	 * optional string name = 1;
	 * @return {string}
	 */
	proto.mediapipe.InputCollection.prototype.getName = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.InputCollection} returns this
	 */
	proto.mediapipe.InputCollection.prototype.setName = function(value) {
	  return jspb.Message.setProto3StringField(this, 1, value);
	};


	/**
	 * repeated string side_packet_name = 2;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.InputCollection.prototype.getSidePacketNameList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 2));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.InputCollection} returns this
	 */
	proto.mediapipe.InputCollection.prototype.setSidePacketNameList = function(value) {
	  return jspb.Message.setField(this, 2, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.InputCollection} returns this
	 */
	proto.mediapipe.InputCollection.prototype.addSidePacketName = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.InputCollection} returns this
	 */
	proto.mediapipe.InputCollection.prototype.clearSidePacketNameList = function() {
	  return this.setSidePacketNameList([]);
	};


	/**
	 * repeated string external_input_name = 1002;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.InputCollection.prototype.getExternalInputNameList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1002));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.InputCollection} returns this
	 */
	proto.mediapipe.InputCollection.prototype.setExternalInputNameList = function(value) {
	  return jspb.Message.setField(this, 1002, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.InputCollection} returns this
	 */
	proto.mediapipe.InputCollection.prototype.addExternalInputName = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 1002, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.InputCollection} returns this
	 */
	proto.mediapipe.InputCollection.prototype.clearExternalInputNameList = function() {
	  return this.setExternalInputNameList([]);
	};


	/**
	 * optional InputType input_type = 3;
	 * @return {!proto.mediapipe.InputCollection.InputType}
	 */
	proto.mediapipe.InputCollection.prototype.getInputType = function() {
	  return /** @type {!proto.mediapipe.InputCollection.InputType} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
	};


	/**
	 * @param {!proto.mediapipe.InputCollection.InputType} value
	 * @return {!proto.mediapipe.InputCollection} returns this
	 */
	proto.mediapipe.InputCollection.prototype.setInputType = function(value) {
	  return jspb.Message.setProto3EnumField(this, 3, value);
	};


	/**
	 * optional string file_name = 4;
	 * @return {string}
	 */
	proto.mediapipe.InputCollection.prototype.getFileName = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.InputCollection} returns this
	 */
	proto.mediapipe.InputCollection.prototype.setFileName = function(value) {
	  return jspb.Message.setProto3StringField(this, 4, value);
	};



	/**
	 * List of repeated fields within this message type.
	 * @private {!Array<number>}
	 * @const
	 */
	proto.mediapipe.InputCollectionSet.repeatedFields_ = [1];



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.InputCollectionSet.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.InputCollectionSet.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.InputCollectionSet} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InputCollectionSet.toObject = function(includeInstance, msg) {
	  var obj = {
	    inputCollectionList: jspb.Message.toObjectList(msg.getInputCollectionList(),
	    proto.mediapipe.InputCollection.toObject, includeInstance)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.InputCollectionSet}
	 */
	proto.mediapipe.InputCollectionSet.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.InputCollectionSet;
	  return proto.mediapipe.InputCollectionSet.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.InputCollectionSet} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.InputCollectionSet}
	 */
	proto.mediapipe.InputCollectionSet.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = new proto.mediapipe.InputCollection;
	      reader.readMessage(value,proto.mediapipe.InputCollection.deserializeBinaryFromReader);
	      msg.addInputCollection(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.InputCollectionSet.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.InputCollectionSet.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.InputCollectionSet} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InputCollectionSet.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = message.getInputCollectionList();
	  if (f.length > 0) {
	    writer.writeRepeatedMessage(
	      1,
	      f,
	      proto.mediapipe.InputCollection.serializeBinaryToWriter
	    );
	  }
	};


	/**
	 * repeated InputCollection input_collection = 1;
	 * @return {!Array<!proto.mediapipe.InputCollection>}
	 */
	proto.mediapipe.InputCollectionSet.prototype.getInputCollectionList = function() {
	  return /** @type{!Array<!proto.mediapipe.InputCollection>} */ (
	    jspb.Message.getRepeatedWrapperField(this, proto.mediapipe.InputCollection, 1));
	};


	/**
	 * @param {!Array<!proto.mediapipe.InputCollection>} value
	 * @return {!proto.mediapipe.InputCollectionSet} returns this
	*/
	proto.mediapipe.InputCollectionSet.prototype.setInputCollectionList = function(value) {
	  return jspb.Message.setRepeatedWrapperField(this, 1, value);
	};


	/**
	 * @param {!proto.mediapipe.InputCollection=} opt_value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.InputCollection}
	 */
	proto.mediapipe.InputCollectionSet.prototype.addInputCollection = function(opt_value, opt_index) {
	  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.mediapipe.InputCollection, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.InputCollectionSet} returns this
	 */
	proto.mediapipe.InputCollectionSet.prototype.clearInputCollectionList = function() {
	  return this.setInputCollectionList([]);
	};





	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.InputStreamInfo.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.InputStreamInfo.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.InputStreamInfo} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InputStreamInfo.toObject = function(includeInstance, msg) {
	  var obj = {
	    tagIndex: jspb.Message.getFieldWithDefault(msg, 1, ""),
	    backEdge: jspb.Message.getBooleanFieldWithDefault(msg, 2, false)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.InputStreamInfo}
	 */
	proto.mediapipe.InputStreamInfo.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.InputStreamInfo;
	  return proto.mediapipe.InputStreamInfo.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.InputStreamInfo} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.InputStreamInfo}
	 */
	proto.mediapipe.InputStreamInfo.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setTagIndex(value);
	      break;
	    case 2:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setBackEdge(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.InputStreamInfo.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.InputStreamInfo.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.InputStreamInfo} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InputStreamInfo.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = message.getTagIndex();
	  if (f.length > 0) {
	    writer.writeString(
	      1,
	      f
	    );
	  }
	  f = message.getBackEdge();
	  if (f) {
	    writer.writeBool(
	      2,
	      f
	    );
	  }
	};


	/**
	 * optional string tag_index = 1;
	 * @return {string}
	 */
	proto.mediapipe.InputStreamInfo.prototype.getTagIndex = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.InputStreamInfo} returns this
	 */
	proto.mediapipe.InputStreamInfo.prototype.setTagIndex = function(value) {
	  return jspb.Message.setProto3StringField(this, 1, value);
	};


	/**
	 * optional bool back_edge = 2;
	 * @return {boolean}
	 */
	proto.mediapipe.InputStreamInfo.prototype.getBackEdge = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.InputStreamInfo} returns this
	 */
	proto.mediapipe.InputStreamInfo.prototype.setBackEdge = function(value) {
	  return jspb.Message.setProto3BooleanField(this, 2, value);
	};



	/**
	 * List of repeated fields within this message type.
	 * @private {!Array<number>}
	 * @const
	 */
	proto.mediapipe.ProfilerConfig.repeatedFields_ = [8];



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.ProfilerConfig.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.ProfilerConfig.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.ProfilerConfig} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.ProfilerConfig.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    histogramIntervalSizeUsec: jspb.Message.getFieldWithDefault(msg, 1, 0),
	    numHistogramIntervals: jspb.Message.getFieldWithDefault(msg, 2, 0),
	    enableInputOutputLatency: jspb.Message.getBooleanFieldWithDefault(msg, 3, false),
	    enableProfiler: jspb.Message.getBooleanFieldWithDefault(msg, 4, false),
	    enableStreamLatency: jspb.Message.getBooleanFieldWithDefault(msg, 5, false),
	    usePacketTimestampForAddedPacket: jspb.Message.getBooleanFieldWithDefault(msg, 6, false),
	    traceLogCapacity: jspb.Message.getFieldWithDefault(msg, 7, 0),
	    traceEventTypesDisabledList: (f = jspb.Message.getRepeatedField(msg, 8)) == null ? undefined : f,
	    traceLogPath: jspb.Message.getFieldWithDefault(msg, 9, ""),
	    traceLogCount: jspb.Message.getFieldWithDefault(msg, 10, 0),
	    traceLogIntervalUsec: jspb.Message.getFieldWithDefault(msg, 11, 0),
	    traceLogMarginUsec: jspb.Message.getFieldWithDefault(msg, 12, 0),
	    traceLogDurationEvents: jspb.Message.getBooleanFieldWithDefault(msg, 13, false),
	    traceLogIntervalCount: jspb.Message.getFieldWithDefault(msg, 14, 0),
	    traceLogDisabled: jspb.Message.getBooleanFieldWithDefault(msg, 15, false),
	    traceEnabled: jspb.Message.getBooleanFieldWithDefault(msg, 16, false),
	    traceLogInstantEvents: jspb.Message.getBooleanFieldWithDefault(msg, 17, false),
	    calculatorFilter: jspb.Message.getFieldWithDefault(msg, 18, "")
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.ProfilerConfig}
	 */
	proto.mediapipe.ProfilerConfig.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.ProfilerConfig;
	  return proto.mediapipe.ProfilerConfig.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.ProfilerConfig} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.ProfilerConfig}
	 */
	proto.mediapipe.ProfilerConfig.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {number} */ (reader.readInt64());
	      msg.setHistogramIntervalSizeUsec(value);
	      break;
	    case 2:
	      var value = /** @type {number} */ (reader.readInt64());
	      msg.setNumHistogramIntervals(value);
	      break;
	    case 3:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setEnableInputOutputLatency(value);
	      break;
	    case 4:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setEnableProfiler(value);
	      break;
	    case 5:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setEnableStreamLatency(value);
	      break;
	    case 6:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setUsePacketTimestampForAddedPacket(value);
	      break;
	    case 7:
	      var value = /** @type {number} */ (reader.readInt64());
	      msg.setTraceLogCapacity(value);
	      break;
	    case 8:
	      var values = /** @type {!Array<number>} */ (reader.isDelimited() ? reader.readPackedInt32() : [reader.readInt32()]);
	      for (var i = 0; i < values.length; i++) {
	        msg.addTraceEventTypesDisabled(values[i]);
	      }
	      break;
	    case 9:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setTraceLogPath(value);
	      break;
	    case 10:
	      var value = /** @type {number} */ (reader.readInt32());
	      msg.setTraceLogCount(value);
	      break;
	    case 11:
	      var value = /** @type {number} */ (reader.readInt64());
	      msg.setTraceLogIntervalUsec(value);
	      break;
	    case 12:
	      var value = /** @type {number} */ (reader.readInt64());
	      msg.setTraceLogMarginUsec(value);
	      break;
	    case 13:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setTraceLogDurationEvents(value);
	      break;
	    case 14:
	      var value = /** @type {number} */ (reader.readInt32());
	      msg.setTraceLogIntervalCount(value);
	      break;
	    case 15:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setTraceLogDisabled(value);
	      break;
	    case 16:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setTraceEnabled(value);
	      break;
	    case 17:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setTraceLogInstantEvents(value);
	      break;
	    case 18:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setCalculatorFilter(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.ProfilerConfig.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.ProfilerConfig.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.ProfilerConfig} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.ProfilerConfig.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = message.getHistogramIntervalSizeUsec();
	  if (f !== 0) {
	    writer.writeInt64(
	      1,
	      f
	    );
	  }
	  f = message.getNumHistogramIntervals();
	  if (f !== 0) {
	    writer.writeInt64(
	      2,
	      f
	    );
	  }
	  f = message.getEnableInputOutputLatency();
	  if (f) {
	    writer.writeBool(
	      3,
	      f
	    );
	  }
	  f = message.getEnableProfiler();
	  if (f) {
	    writer.writeBool(
	      4,
	      f
	    );
	  }
	  f = message.getEnableStreamLatency();
	  if (f) {
	    writer.writeBool(
	      5,
	      f
	    );
	  }
	  f = message.getUsePacketTimestampForAddedPacket();
	  if (f) {
	    writer.writeBool(
	      6,
	      f
	    );
	  }
	  f = message.getTraceLogCapacity();
	  if (f !== 0) {
	    writer.writeInt64(
	      7,
	      f
	    );
	  }
	  f = message.getTraceEventTypesDisabledList();
	  if (f.length > 0) {
	    writer.writePackedInt32(
	      8,
	      f
	    );
	  }
	  f = message.getTraceLogPath();
	  if (f.length > 0) {
	    writer.writeString(
	      9,
	      f
	    );
	  }
	  f = message.getTraceLogCount();
	  if (f !== 0) {
	    writer.writeInt32(
	      10,
	      f
	    );
	  }
	  f = message.getTraceLogIntervalUsec();
	  if (f !== 0) {
	    writer.writeInt64(
	      11,
	      f
	    );
	  }
	  f = message.getTraceLogMarginUsec();
	  if (f !== 0) {
	    writer.writeInt64(
	      12,
	      f
	    );
	  }
	  f = message.getTraceLogDurationEvents();
	  if (f) {
	    writer.writeBool(
	      13,
	      f
	    );
	  }
	  f = message.getTraceLogIntervalCount();
	  if (f !== 0) {
	    writer.writeInt32(
	      14,
	      f
	    );
	  }
	  f = message.getTraceLogDisabled();
	  if (f) {
	    writer.writeBool(
	      15,
	      f
	    );
	  }
	  f = message.getTraceEnabled();
	  if (f) {
	    writer.writeBool(
	      16,
	      f
	    );
	  }
	  f = message.getTraceLogInstantEvents();
	  if (f) {
	    writer.writeBool(
	      17,
	      f
	    );
	  }
	  f = message.getCalculatorFilter();
	  if (f.length > 0) {
	    writer.writeString(
	      18,
	      f
	    );
	  }
	};


	/**
	 * optional int64 histogram_interval_size_usec = 1;
	 * @return {number}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getHistogramIntervalSizeUsec = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setHistogramIntervalSizeUsec = function(value) {
	  return jspb.Message.setProto3IntField(this, 1, value);
	};


	/**
	 * optional int64 num_histogram_intervals = 2;
	 * @return {number}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getNumHistogramIntervals = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setNumHistogramIntervals = function(value) {
	  return jspb.Message.setProto3IntField(this, 2, value);
	};


	/**
	 * optional bool enable_input_output_latency = 3;
	 * @return {boolean}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getEnableInputOutputLatency = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setEnableInputOutputLatency = function(value) {
	  return jspb.Message.setProto3BooleanField(this, 3, value);
	};


	/**
	 * optional bool enable_profiler = 4;
	 * @return {boolean}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getEnableProfiler = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 4, false));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setEnableProfiler = function(value) {
	  return jspb.Message.setProto3BooleanField(this, 4, value);
	};


	/**
	 * optional bool enable_stream_latency = 5;
	 * @return {boolean}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getEnableStreamLatency = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 5, false));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setEnableStreamLatency = function(value) {
	  return jspb.Message.setProto3BooleanField(this, 5, value);
	};


	/**
	 * optional bool use_packet_timestamp_for_added_packet = 6;
	 * @return {boolean}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getUsePacketTimestampForAddedPacket = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 6, false));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setUsePacketTimestampForAddedPacket = function(value) {
	  return jspb.Message.setProto3BooleanField(this, 6, value);
	};


	/**
	 * optional int64 trace_log_capacity = 7;
	 * @return {number}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getTraceLogCapacity = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setTraceLogCapacity = function(value) {
	  return jspb.Message.setProto3IntField(this, 7, value);
	};


	/**
	 * repeated int32 trace_event_types_disabled = 8;
	 * @return {!Array<number>}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getTraceEventTypesDisabledList = function() {
	  return /** @type {!Array<number>} */ (jspb.Message.getRepeatedField(this, 8));
	};


	/**
	 * @param {!Array<number>} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setTraceEventTypesDisabledList = function(value) {
	  return jspb.Message.setField(this, 8, value || []);
	};


	/**
	 * @param {number} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.addTraceEventTypesDisabled = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 8, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.clearTraceEventTypesDisabledList = function() {
	  return this.setTraceEventTypesDisabledList([]);
	};


	/**
	 * optional string trace_log_path = 9;
	 * @return {string}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getTraceLogPath = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 9, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setTraceLogPath = function(value) {
	  return jspb.Message.setProto3StringField(this, 9, value);
	};


	/**
	 * optional int32 trace_log_count = 10;
	 * @return {number}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getTraceLogCount = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 10, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setTraceLogCount = function(value) {
	  return jspb.Message.setProto3IntField(this, 10, value);
	};


	/**
	 * optional int64 trace_log_interval_usec = 11;
	 * @return {number}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getTraceLogIntervalUsec = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 11, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setTraceLogIntervalUsec = function(value) {
	  return jspb.Message.setProto3IntField(this, 11, value);
	};


	/**
	 * optional int64 trace_log_margin_usec = 12;
	 * @return {number}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getTraceLogMarginUsec = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 12, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setTraceLogMarginUsec = function(value) {
	  return jspb.Message.setProto3IntField(this, 12, value);
	};


	/**
	 * optional bool trace_log_duration_events = 13;
	 * @return {boolean}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getTraceLogDurationEvents = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 13, false));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setTraceLogDurationEvents = function(value) {
	  return jspb.Message.setProto3BooleanField(this, 13, value);
	};


	/**
	 * optional int32 trace_log_interval_count = 14;
	 * @return {number}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getTraceLogIntervalCount = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 14, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setTraceLogIntervalCount = function(value) {
	  return jspb.Message.setProto3IntField(this, 14, value);
	};


	/**
	 * optional bool trace_log_disabled = 15;
	 * @return {boolean}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getTraceLogDisabled = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 15, false));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setTraceLogDisabled = function(value) {
	  return jspb.Message.setProto3BooleanField(this, 15, value);
	};


	/**
	 * optional bool trace_enabled = 16;
	 * @return {boolean}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getTraceEnabled = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 16, false));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setTraceEnabled = function(value) {
	  return jspb.Message.setProto3BooleanField(this, 16, value);
	};


	/**
	 * optional bool trace_log_instant_events = 17;
	 * @return {boolean}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getTraceLogInstantEvents = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 17, false));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setTraceLogInstantEvents = function(value) {
	  return jspb.Message.setProto3BooleanField(this, 17, value);
	};


	/**
	 * optional string calculator_filter = 18;
	 * @return {string}
	 */
	proto.mediapipe.ProfilerConfig.prototype.getCalculatorFilter = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 18, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.ProfilerConfig} returns this
	 */
	proto.mediapipe.ProfilerConfig.prototype.setCalculatorFilter = function(value) {
	  return jspb.Message.setProto3StringField(this, 18, value);
	};



	/**
	 * List of repeated fields within this message type.
	 * @private {!Array<number>}
	 * @const
	 */
	proto.mediapipe.CalculatorGraphConfig.repeatedFields_ = [1,6,7,9,10,15,16,17,14,1002];



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.CalculatorGraphConfig.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.CalculatorGraphConfig} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.CalculatorGraphConfig.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    nodeList: jspb.Message.toObjectList(msg.getNodeList(),
	    proto.mediapipe.CalculatorGraphConfig.Node.toObject, includeInstance),
	    packetFactoryList: jspb.Message.toObjectList(msg.getPacketFactoryList(),
	    mediapipe_framework_packet_factory_pb.PacketFactoryConfig.toObject, includeInstance),
	    packetGeneratorList: jspb.Message.toObjectList(msg.getPacketGeneratorList(),
	    mediapipe_framework_packet_generator_pb.PacketGeneratorConfig.toObject, includeInstance),
	    numThreads: jspb.Message.getFieldWithDefault(msg, 8, 0),
	    statusHandlerList: jspb.Message.toObjectList(msg.getStatusHandlerList(),
	    mediapipe_framework_status_handler_pb.StatusHandlerConfig.toObject, includeInstance),
	    inputStreamList: (f = jspb.Message.getRepeatedField(msg, 10)) == null ? undefined : f,
	    outputStreamList: (f = jspb.Message.getRepeatedField(msg, 15)) == null ? undefined : f,
	    inputSidePacketList: (f = jspb.Message.getRepeatedField(msg, 16)) == null ? undefined : f,
	    outputSidePacketList: (f = jspb.Message.getRepeatedField(msg, 17)) == null ? undefined : f,
	    maxQueueSize: jspb.Message.getFieldWithDefault(msg, 11, 0),
	    reportDeadlock: jspb.Message.getBooleanFieldWithDefault(msg, 21, false),
	    inputStreamHandler: (f = msg.getInputStreamHandler()) && mediapipe_framework_stream_handler_pb.InputStreamHandlerConfig.toObject(includeInstance, f),
	    outputStreamHandler: (f = msg.getOutputStreamHandler()) && mediapipe_framework_stream_handler_pb.OutputStreamHandlerConfig.toObject(includeInstance, f),
	    executorList: jspb.Message.toObjectList(msg.getExecutorList(),
	    proto.mediapipe.ExecutorConfig.toObject, includeInstance),
	    profilerConfig: (f = msg.getProfilerConfig()) && proto.mediapipe.ProfilerConfig.toObject(includeInstance, f),
	    pb_package: jspb.Message.getFieldWithDefault(msg, 19, ""),
	    type: jspb.Message.getFieldWithDefault(msg, 20, ""),
	    options: (f = msg.getOptions()) && mediapipe_framework_mediapipe_options_pb.MediaPipeOptions.toObject(includeInstance, f),
	    graphOptionsList: jspb.Message.toObjectList(msg.getGraphOptionsList(),
	    google_protobuf_any_pb.Any.toObject, includeInstance)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.CalculatorGraphConfig}
	 */
	proto.mediapipe.CalculatorGraphConfig.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.CalculatorGraphConfig;
	  return proto.mediapipe.CalculatorGraphConfig.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.CalculatorGraphConfig} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.CalculatorGraphConfig}
	 */
	proto.mediapipe.CalculatorGraphConfig.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = new proto.mediapipe.CalculatorGraphConfig.Node;
	      reader.readMessage(value,proto.mediapipe.CalculatorGraphConfig.Node.deserializeBinaryFromReader);
	      msg.addNode(value);
	      break;
	    case 6:
	      var value = new mediapipe_framework_packet_factory_pb.PacketFactoryConfig;
	      reader.readMessage(value,mediapipe_framework_packet_factory_pb.PacketFactoryConfig.deserializeBinaryFromReader);
	      msg.addPacketFactory(value);
	      break;
	    case 7:
	      var value = new mediapipe_framework_packet_generator_pb.PacketGeneratorConfig;
	      reader.readMessage(value,mediapipe_framework_packet_generator_pb.PacketGeneratorConfig.deserializeBinaryFromReader);
	      msg.addPacketGenerator(value);
	      break;
	    case 8:
	      var value = /** @type {number} */ (reader.readInt32());
	      msg.setNumThreads(value);
	      break;
	    case 9:
	      var value = new mediapipe_framework_status_handler_pb.StatusHandlerConfig;
	      reader.readMessage(value,mediapipe_framework_status_handler_pb.StatusHandlerConfig.deserializeBinaryFromReader);
	      msg.addStatusHandler(value);
	      break;
	    case 10:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addInputStream(value);
	      break;
	    case 15:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addOutputStream(value);
	      break;
	    case 16:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addInputSidePacket(value);
	      break;
	    case 17:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addOutputSidePacket(value);
	      break;
	    case 11:
	      var value = /** @type {number} */ (reader.readInt32());
	      msg.setMaxQueueSize(value);
	      break;
	    case 21:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setReportDeadlock(value);
	      break;
	    case 12:
	      var value = new mediapipe_framework_stream_handler_pb.InputStreamHandlerConfig;
	      reader.readMessage(value,mediapipe_framework_stream_handler_pb.InputStreamHandlerConfig.deserializeBinaryFromReader);
	      msg.setInputStreamHandler(value);
	      break;
	    case 13:
	      var value = new mediapipe_framework_stream_handler_pb.OutputStreamHandlerConfig;
	      reader.readMessage(value,mediapipe_framework_stream_handler_pb.OutputStreamHandlerConfig.deserializeBinaryFromReader);
	      msg.setOutputStreamHandler(value);
	      break;
	    case 14:
	      var value = new proto.mediapipe.ExecutorConfig;
	      reader.readMessage(value,proto.mediapipe.ExecutorConfig.deserializeBinaryFromReader);
	      msg.addExecutor(value);
	      break;
	    case 18:
	      var value = new proto.mediapipe.ProfilerConfig;
	      reader.readMessage(value,proto.mediapipe.ProfilerConfig.deserializeBinaryFromReader);
	      msg.setProfilerConfig(value);
	      break;
	    case 19:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setPackage(value);
	      break;
	    case 20:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setType(value);
	      break;
	    case 1001:
	      var value = new mediapipe_framework_mediapipe_options_pb.MediaPipeOptions;
	      reader.readMessage(value,mediapipe_framework_mediapipe_options_pb.MediaPipeOptions.deserializeBinaryFromReader);
	      msg.setOptions(value);
	      break;
	    case 1002:
	      var value = new google_protobuf_any_pb.Any;
	      reader.readMessage(value,google_protobuf_any_pb.Any.deserializeBinaryFromReader);
	      msg.addGraphOptions(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.CalculatorGraphConfig.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.CalculatorGraphConfig} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.CalculatorGraphConfig.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = message.getNodeList();
	  if (f.length > 0) {
	    writer.writeRepeatedMessage(
	      1,
	      f,
	      proto.mediapipe.CalculatorGraphConfig.Node.serializeBinaryToWriter
	    );
	  }
	  f = message.getPacketFactoryList();
	  if (f.length > 0) {
	    writer.writeRepeatedMessage(
	      6,
	      f,
	      mediapipe_framework_packet_factory_pb.PacketFactoryConfig.serializeBinaryToWriter
	    );
	  }
	  f = message.getPacketGeneratorList();
	  if (f.length > 0) {
	    writer.writeRepeatedMessage(
	      7,
	      f,
	      mediapipe_framework_packet_generator_pb.PacketGeneratorConfig.serializeBinaryToWriter
	    );
	  }
	  f = message.getNumThreads();
	  if (f !== 0) {
	    writer.writeInt32(
	      8,
	      f
	    );
	  }
	  f = message.getStatusHandlerList();
	  if (f.length > 0) {
	    writer.writeRepeatedMessage(
	      9,
	      f,
	      mediapipe_framework_status_handler_pb.StatusHandlerConfig.serializeBinaryToWriter
	    );
	  }
	  f = message.getInputStreamList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      10,
	      f
	    );
	  }
	  f = message.getOutputStreamList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      15,
	      f
	    );
	  }
	  f = message.getInputSidePacketList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      16,
	      f
	    );
	  }
	  f = message.getOutputSidePacketList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      17,
	      f
	    );
	  }
	  f = message.getMaxQueueSize();
	  if (f !== 0) {
	    writer.writeInt32(
	      11,
	      f
	    );
	  }
	  f = message.getReportDeadlock();
	  if (f) {
	    writer.writeBool(
	      21,
	      f
	    );
	  }
	  f = message.getInputStreamHandler();
	  if (f != null) {
	    writer.writeMessage(
	      12,
	      f,
	      mediapipe_framework_stream_handler_pb.InputStreamHandlerConfig.serializeBinaryToWriter
	    );
	  }
	  f = message.getOutputStreamHandler();
	  if (f != null) {
	    writer.writeMessage(
	      13,
	      f,
	      mediapipe_framework_stream_handler_pb.OutputStreamHandlerConfig.serializeBinaryToWriter
	    );
	  }
	  f = message.getExecutorList();
	  if (f.length > 0) {
	    writer.writeRepeatedMessage(
	      14,
	      f,
	      proto.mediapipe.ExecutorConfig.serializeBinaryToWriter
	    );
	  }
	  f = message.getProfilerConfig();
	  if (f != null) {
	    writer.writeMessage(
	      18,
	      f,
	      proto.mediapipe.ProfilerConfig.serializeBinaryToWriter
	    );
	  }
	  f = message.getPackage();
	  if (f.length > 0) {
	    writer.writeString(
	      19,
	      f
	    );
	  }
	  f = message.getType();
	  if (f.length > 0) {
	    writer.writeString(
	      20,
	      f
	    );
	  }
	  f = message.getOptions();
	  if (f != null) {
	    writer.writeMessage(
	      1001,
	      f,
	      mediapipe_framework_mediapipe_options_pb.MediaPipeOptions.serializeBinaryToWriter
	    );
	  }
	  f = message.getGraphOptionsList();
	  if (f.length > 0) {
	    writer.writeRepeatedMessage(
	      1002,
	      f,
	      google_protobuf_any_pb.Any.serializeBinaryToWriter
	    );
	  }
	};



	/**
	 * List of repeated fields within this message type.
	 * @private {!Array<number>}
	 * @const
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.repeatedFields_ = [3,4,5,6,8,13,17,1005];



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.CalculatorGraphConfig.Node.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.CalculatorGraphConfig.Node} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
	    calculator: jspb.Message.getFieldWithDefault(msg, 2, ""),
	    inputStreamList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f,
	    outputStreamList: (f = jspb.Message.getRepeatedField(msg, 4)) == null ? undefined : f,
	    inputSidePacketList: (f = jspb.Message.getRepeatedField(msg, 5)) == null ? undefined : f,
	    outputSidePacketList: (f = jspb.Message.getRepeatedField(msg, 6)) == null ? undefined : f,
	    options: (f = msg.getOptions()) && mediapipe_framework_calculator_options_pb.CalculatorOptions.toObject(includeInstance, f),
	    nodeOptionsList: jspb.Message.toObjectList(msg.getNodeOptionsList(),
	    google_protobuf_any_pb.Any.toObject, includeInstance),
	    sourceLayer: jspb.Message.getFieldWithDefault(msg, 9, 0),
	    bufferSizeHint: jspb.Message.getFieldWithDefault(msg, 10, 0),
	    inputStreamHandler: (f = msg.getInputStreamHandler()) && mediapipe_framework_stream_handler_pb.InputStreamHandlerConfig.toObject(includeInstance, f),
	    outputStreamHandler: (f = msg.getOutputStreamHandler()) && mediapipe_framework_stream_handler_pb.OutputStreamHandlerConfig.toObject(includeInstance, f),
	    inputStreamInfoList: jspb.Message.toObjectList(msg.getInputStreamInfoList(),
	    proto.mediapipe.InputStreamInfo.toObject, includeInstance),
	    executor: jspb.Message.getFieldWithDefault(msg, 14, ""),
	    profilerConfig: (f = msg.getProfilerConfig()) && proto.mediapipe.ProfilerConfig.toObject(includeInstance, f),
	    maxInFlight: jspb.Message.getFieldWithDefault(msg, 16, 0),
	    optionValueList: (f = jspb.Message.getRepeatedField(msg, 17)) == null ? undefined : f,
	    externalInputList: (f = jspb.Message.getRepeatedField(msg, 1005)) == null ? undefined : f
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.CalculatorGraphConfig.Node;
	  return proto.mediapipe.CalculatorGraphConfig.Node.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.CalculatorGraphConfig.Node} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setName(value);
	      break;
	    case 2:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setCalculator(value);
	      break;
	    case 3:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addInputStream(value);
	      break;
	    case 4:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addOutputStream(value);
	      break;
	    case 5:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addInputSidePacket(value);
	      break;
	    case 6:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addOutputSidePacket(value);
	      break;
	    case 7:
	      var value = new mediapipe_framework_calculator_options_pb.CalculatorOptions;
	      reader.readMessage(value,mediapipe_framework_calculator_options_pb.CalculatorOptions.deserializeBinaryFromReader);
	      msg.setOptions(value);
	      break;
	    case 8:
	      var value = new google_protobuf_any_pb.Any;
	      reader.readMessage(value,google_protobuf_any_pb.Any.deserializeBinaryFromReader);
	      msg.addNodeOptions(value);
	      break;
	    case 9:
	      var value = /** @type {number} */ (reader.readInt32());
	      msg.setSourceLayer(value);
	      break;
	    case 10:
	      var value = /** @type {number} */ (reader.readInt32());
	      msg.setBufferSizeHint(value);
	      break;
	    case 11:
	      var value = new mediapipe_framework_stream_handler_pb.InputStreamHandlerConfig;
	      reader.readMessage(value,mediapipe_framework_stream_handler_pb.InputStreamHandlerConfig.deserializeBinaryFromReader);
	      msg.setInputStreamHandler(value);
	      break;
	    case 12:
	      var value = new mediapipe_framework_stream_handler_pb.OutputStreamHandlerConfig;
	      reader.readMessage(value,mediapipe_framework_stream_handler_pb.OutputStreamHandlerConfig.deserializeBinaryFromReader);
	      msg.setOutputStreamHandler(value);
	      break;
	    case 13:
	      var value = new proto.mediapipe.InputStreamInfo;
	      reader.readMessage(value,proto.mediapipe.InputStreamInfo.deserializeBinaryFromReader);
	      msg.addInputStreamInfo(value);
	      break;
	    case 14:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setExecutor(value);
	      break;
	    case 15:
	      var value = new proto.mediapipe.ProfilerConfig;
	      reader.readMessage(value,proto.mediapipe.ProfilerConfig.deserializeBinaryFromReader);
	      msg.setProfilerConfig(value);
	      break;
	    case 16:
	      var value = /** @type {number} */ (reader.readInt32());
	      msg.setMaxInFlight(value);
	      break;
	    case 17:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addOptionValue(value);
	      break;
	    case 1005:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addExternalInput(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.CalculatorGraphConfig.Node.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.CalculatorGraphConfig.Node} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = message.getName();
	  if (f.length > 0) {
	    writer.writeString(
	      1,
	      f
	    );
	  }
	  f = message.getCalculator();
	  if (f.length > 0) {
	    writer.writeString(
	      2,
	      f
	    );
	  }
	  f = message.getInputStreamList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      3,
	      f
	    );
	  }
	  f = message.getOutputStreamList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      4,
	      f
	    );
	  }
	  f = message.getInputSidePacketList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      5,
	      f
	    );
	  }
	  f = message.getOutputSidePacketList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      6,
	      f
	    );
	  }
	  f = message.getOptions();
	  if (f != null) {
	    writer.writeMessage(
	      7,
	      f,
	      mediapipe_framework_calculator_options_pb.CalculatorOptions.serializeBinaryToWriter
	    );
	  }
	  f = message.getNodeOptionsList();
	  if (f.length > 0) {
	    writer.writeRepeatedMessage(
	      8,
	      f,
	      google_protobuf_any_pb.Any.serializeBinaryToWriter
	    );
	  }
	  f = message.getSourceLayer();
	  if (f !== 0) {
	    writer.writeInt32(
	      9,
	      f
	    );
	  }
	  f = message.getBufferSizeHint();
	  if (f !== 0) {
	    writer.writeInt32(
	      10,
	      f
	    );
	  }
	  f = message.getInputStreamHandler();
	  if (f != null) {
	    writer.writeMessage(
	      11,
	      f,
	      mediapipe_framework_stream_handler_pb.InputStreamHandlerConfig.serializeBinaryToWriter
	    );
	  }
	  f = message.getOutputStreamHandler();
	  if (f != null) {
	    writer.writeMessage(
	      12,
	      f,
	      mediapipe_framework_stream_handler_pb.OutputStreamHandlerConfig.serializeBinaryToWriter
	    );
	  }
	  f = message.getInputStreamInfoList();
	  if (f.length > 0) {
	    writer.writeRepeatedMessage(
	      13,
	      f,
	      proto.mediapipe.InputStreamInfo.serializeBinaryToWriter
	    );
	  }
	  f = message.getExecutor();
	  if (f.length > 0) {
	    writer.writeString(
	      14,
	      f
	    );
	  }
	  f = message.getProfilerConfig();
	  if (f != null) {
	    writer.writeMessage(
	      15,
	      f,
	      proto.mediapipe.ProfilerConfig.serializeBinaryToWriter
	    );
	  }
	  f = message.getMaxInFlight();
	  if (f !== 0) {
	    writer.writeInt32(
	      16,
	      f
	    );
	  }
	  f = message.getOptionValueList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      17,
	      f
	    );
	  }
	  f = message.getExternalInputList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      1005,
	      f
	    );
	  }
	};


	/**
	 * optional string name = 1;
	 * @return {string}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getName = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setName = function(value) {
	  return jspb.Message.setProto3StringField(this, 1, value);
	};


	/**
	 * optional string calculator = 2;
	 * @return {string}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getCalculator = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setCalculator = function(value) {
	  return jspb.Message.setProto3StringField(this, 2, value);
	};


	/**
	 * repeated string input_stream = 3;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getInputStreamList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 3));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setInputStreamList = function(value) {
	  return jspb.Message.setField(this, 3, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.addInputStream = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.clearInputStreamList = function() {
	  return this.setInputStreamList([]);
	};


	/**
	 * repeated string output_stream = 4;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getOutputStreamList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setOutputStreamList = function(value) {
	  return jspb.Message.setField(this, 4, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.addOutputStream = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.clearOutputStreamList = function() {
	  return this.setOutputStreamList([]);
	};


	/**
	 * repeated string input_side_packet = 5;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getInputSidePacketList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 5));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setInputSidePacketList = function(value) {
	  return jspb.Message.setField(this, 5, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.addInputSidePacket = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 5, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.clearInputSidePacketList = function() {
	  return this.setInputSidePacketList([]);
	};


	/**
	 * repeated string output_side_packet = 6;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getOutputSidePacketList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 6));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setOutputSidePacketList = function(value) {
	  return jspb.Message.setField(this, 6, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.addOutputSidePacket = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 6, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.clearOutputSidePacketList = function() {
	  return this.setOutputSidePacketList([]);
	};


	/**
	 * optional CalculatorOptions options = 7;
	 * @return {?proto.mediapipe.CalculatorOptions}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getOptions = function() {
	  return /** @type{?proto.mediapipe.CalculatorOptions} */ (
	    jspb.Message.getWrapperField(this, mediapipe_framework_calculator_options_pb.CalculatorOptions, 7));
	};


	/**
	 * @param {?proto.mediapipe.CalculatorOptions|undefined} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	*/
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setOptions = function(value) {
	  return jspb.Message.setWrapperField(this, 7, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.clearOptions = function() {
	  return this.setOptions(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.hasOptions = function() {
	  return jspb.Message.getField(this, 7) != null;
	};


	/**
	 * repeated google.protobuf.Any node_options = 8;
	 * @return {!Array<!proto.google.protobuf.Any>}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getNodeOptionsList = function() {
	  return /** @type{!Array<!proto.google.protobuf.Any>} */ (
	    jspb.Message.getRepeatedWrapperField(this, google_protobuf_any_pb.Any, 8));
	};


	/**
	 * @param {!Array<!proto.google.protobuf.Any>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	*/
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setNodeOptionsList = function(value) {
	  return jspb.Message.setRepeatedWrapperField(this, 8, value);
	};


	/**
	 * @param {!proto.google.protobuf.Any=} opt_value
	 * @param {number=} opt_index
	 * @return {!proto.google.protobuf.Any}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.addNodeOptions = function(opt_value, opt_index) {
	  return jspb.Message.addToRepeatedWrapperField(this, 8, opt_value, proto.google.protobuf.Any, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.clearNodeOptionsList = function() {
	  return this.setNodeOptionsList([]);
	};


	/**
	 * optional int32 source_layer = 9;
	 * @return {number}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getSourceLayer = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 9, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setSourceLayer = function(value) {
	  return jspb.Message.setProto3IntField(this, 9, value);
	};


	/**
	 * optional int32 buffer_size_hint = 10;
	 * @return {number}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getBufferSizeHint = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 10, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setBufferSizeHint = function(value) {
	  return jspb.Message.setProto3IntField(this, 10, value);
	};


	/**
	 * optional InputStreamHandlerConfig input_stream_handler = 11;
	 * @return {?proto.mediapipe.InputStreamHandlerConfig}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getInputStreamHandler = function() {
	  return /** @type{?proto.mediapipe.InputStreamHandlerConfig} */ (
	    jspb.Message.getWrapperField(this, mediapipe_framework_stream_handler_pb.InputStreamHandlerConfig, 11));
	};


	/**
	 * @param {?proto.mediapipe.InputStreamHandlerConfig|undefined} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	*/
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setInputStreamHandler = function(value) {
	  return jspb.Message.setWrapperField(this, 11, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.clearInputStreamHandler = function() {
	  return this.setInputStreamHandler(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.hasInputStreamHandler = function() {
	  return jspb.Message.getField(this, 11) != null;
	};


	/**
	 * optional OutputStreamHandlerConfig output_stream_handler = 12;
	 * @return {?proto.mediapipe.OutputStreamHandlerConfig}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getOutputStreamHandler = function() {
	  return /** @type{?proto.mediapipe.OutputStreamHandlerConfig} */ (
	    jspb.Message.getWrapperField(this, mediapipe_framework_stream_handler_pb.OutputStreamHandlerConfig, 12));
	};


	/**
	 * @param {?proto.mediapipe.OutputStreamHandlerConfig|undefined} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	*/
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setOutputStreamHandler = function(value) {
	  return jspb.Message.setWrapperField(this, 12, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.clearOutputStreamHandler = function() {
	  return this.setOutputStreamHandler(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.hasOutputStreamHandler = function() {
	  return jspb.Message.getField(this, 12) != null;
	};


	/**
	 * repeated InputStreamInfo input_stream_info = 13;
	 * @return {!Array<!proto.mediapipe.InputStreamInfo>}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getInputStreamInfoList = function() {
	  return /** @type{!Array<!proto.mediapipe.InputStreamInfo>} */ (
	    jspb.Message.getRepeatedWrapperField(this, proto.mediapipe.InputStreamInfo, 13));
	};


	/**
	 * @param {!Array<!proto.mediapipe.InputStreamInfo>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	*/
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setInputStreamInfoList = function(value) {
	  return jspb.Message.setRepeatedWrapperField(this, 13, value);
	};


	/**
	 * @param {!proto.mediapipe.InputStreamInfo=} opt_value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.InputStreamInfo}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.addInputStreamInfo = function(opt_value, opt_index) {
	  return jspb.Message.addToRepeatedWrapperField(this, 13, opt_value, proto.mediapipe.InputStreamInfo, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.clearInputStreamInfoList = function() {
	  return this.setInputStreamInfoList([]);
	};


	/**
	 * optional string executor = 14;
	 * @return {string}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getExecutor = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 14, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setExecutor = function(value) {
	  return jspb.Message.setProto3StringField(this, 14, value);
	};


	/**
	 * optional ProfilerConfig profiler_config = 15;
	 * @return {?proto.mediapipe.ProfilerConfig}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getProfilerConfig = function() {
	  return /** @type{?proto.mediapipe.ProfilerConfig} */ (
	    jspb.Message.getWrapperField(this, proto.mediapipe.ProfilerConfig, 15));
	};


	/**
	 * @param {?proto.mediapipe.ProfilerConfig|undefined} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	*/
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setProfilerConfig = function(value) {
	  return jspb.Message.setWrapperField(this, 15, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.clearProfilerConfig = function() {
	  return this.setProfilerConfig(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.hasProfilerConfig = function() {
	  return jspb.Message.getField(this, 15) != null;
	};


	/**
	 * optional int32 max_in_flight = 16;
	 * @return {number}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getMaxInFlight = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 16, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setMaxInFlight = function(value) {
	  return jspb.Message.setProto3IntField(this, 16, value);
	};


	/**
	 * repeated string option_value = 17;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getOptionValueList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 17));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setOptionValueList = function(value) {
	  return jspb.Message.setField(this, 17, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.addOptionValue = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 17, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.clearOptionValueList = function() {
	  return this.setOptionValueList([]);
	};


	/**
	 * repeated string external_input = 1005;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.getExternalInputList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1005));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.setExternalInputList = function(value) {
	  return jspb.Message.setField(this, 1005, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.addExternalInput = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 1005, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.Node.prototype.clearExternalInputList = function() {
	  return this.setExternalInputList([]);
	};


	/**
	 * repeated Node node = 1;
	 * @return {!Array<!proto.mediapipe.CalculatorGraphConfig.Node>}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getNodeList = function() {
	  return /** @type{!Array<!proto.mediapipe.CalculatorGraphConfig.Node>} */ (
	    jspb.Message.getRepeatedWrapperField(this, proto.mediapipe.CalculatorGraphConfig.Node, 1));
	};


	/**
	 * @param {!Array<!proto.mediapipe.CalculatorGraphConfig.Node>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	*/
	proto.mediapipe.CalculatorGraphConfig.prototype.setNodeList = function(value) {
	  return jspb.Message.setRepeatedWrapperField(this, 1, value);
	};


	/**
	 * @param {!proto.mediapipe.CalculatorGraphConfig.Node=} opt_value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.CalculatorGraphConfig.Node}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.addNode = function(opt_value, opt_index) {
	  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.mediapipe.CalculatorGraphConfig.Node, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.clearNodeList = function() {
	  return this.setNodeList([]);
	};


	/**
	 * repeated PacketFactoryConfig packet_factory = 6;
	 * @return {!Array<!proto.mediapipe.PacketFactoryConfig>}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getPacketFactoryList = function() {
	  return /** @type{!Array<!proto.mediapipe.PacketFactoryConfig>} */ (
	    jspb.Message.getRepeatedWrapperField(this, mediapipe_framework_packet_factory_pb.PacketFactoryConfig, 6));
	};


	/**
	 * @param {!Array<!proto.mediapipe.PacketFactoryConfig>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	*/
	proto.mediapipe.CalculatorGraphConfig.prototype.setPacketFactoryList = function(value) {
	  return jspb.Message.setRepeatedWrapperField(this, 6, value);
	};


	/**
	 * @param {!proto.mediapipe.PacketFactoryConfig=} opt_value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.PacketFactoryConfig}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.addPacketFactory = function(opt_value, opt_index) {
	  return jspb.Message.addToRepeatedWrapperField(this, 6, opt_value, proto.mediapipe.PacketFactoryConfig, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.clearPacketFactoryList = function() {
	  return this.setPacketFactoryList([]);
	};


	/**
	 * repeated PacketGeneratorConfig packet_generator = 7;
	 * @return {!Array<!proto.mediapipe.PacketGeneratorConfig>}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getPacketGeneratorList = function() {
	  return /** @type{!Array<!proto.mediapipe.PacketGeneratorConfig>} */ (
	    jspb.Message.getRepeatedWrapperField(this, mediapipe_framework_packet_generator_pb.PacketGeneratorConfig, 7));
	};


	/**
	 * @param {!Array<!proto.mediapipe.PacketGeneratorConfig>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	*/
	proto.mediapipe.CalculatorGraphConfig.prototype.setPacketGeneratorList = function(value) {
	  return jspb.Message.setRepeatedWrapperField(this, 7, value);
	};


	/**
	 * @param {!proto.mediapipe.PacketGeneratorConfig=} opt_value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.PacketGeneratorConfig}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.addPacketGenerator = function(opt_value, opt_index) {
	  return jspb.Message.addToRepeatedWrapperField(this, 7, opt_value, proto.mediapipe.PacketGeneratorConfig, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.clearPacketGeneratorList = function() {
	  return this.setPacketGeneratorList([]);
	};


	/**
	 * optional int32 num_threads = 8;
	 * @return {number}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getNumThreads = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.setNumThreads = function(value) {
	  return jspb.Message.setProto3IntField(this, 8, value);
	};


	/**
	 * repeated StatusHandlerConfig status_handler = 9;
	 * @return {!Array<!proto.mediapipe.StatusHandlerConfig>}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getStatusHandlerList = function() {
	  return /** @type{!Array<!proto.mediapipe.StatusHandlerConfig>} */ (
	    jspb.Message.getRepeatedWrapperField(this, mediapipe_framework_status_handler_pb.StatusHandlerConfig, 9));
	};


	/**
	 * @param {!Array<!proto.mediapipe.StatusHandlerConfig>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	*/
	proto.mediapipe.CalculatorGraphConfig.prototype.setStatusHandlerList = function(value) {
	  return jspb.Message.setRepeatedWrapperField(this, 9, value);
	};


	/**
	 * @param {!proto.mediapipe.StatusHandlerConfig=} opt_value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.StatusHandlerConfig}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.addStatusHandler = function(opt_value, opt_index) {
	  return jspb.Message.addToRepeatedWrapperField(this, 9, opt_value, proto.mediapipe.StatusHandlerConfig, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.clearStatusHandlerList = function() {
	  return this.setStatusHandlerList([]);
	};


	/**
	 * repeated string input_stream = 10;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getInputStreamList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 10));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.setInputStreamList = function(value) {
	  return jspb.Message.setField(this, 10, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.addInputStream = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 10, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.clearInputStreamList = function() {
	  return this.setInputStreamList([]);
	};


	/**
	 * repeated string output_stream = 15;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getOutputStreamList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 15));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.setOutputStreamList = function(value) {
	  return jspb.Message.setField(this, 15, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.addOutputStream = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 15, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.clearOutputStreamList = function() {
	  return this.setOutputStreamList([]);
	};


	/**
	 * repeated string input_side_packet = 16;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getInputSidePacketList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 16));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.setInputSidePacketList = function(value) {
	  return jspb.Message.setField(this, 16, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.addInputSidePacket = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 16, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.clearInputSidePacketList = function() {
	  return this.setInputSidePacketList([]);
	};


	/**
	 * repeated string output_side_packet = 17;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getOutputSidePacketList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 17));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.setOutputSidePacketList = function(value) {
	  return jspb.Message.setField(this, 17, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.addOutputSidePacket = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 17, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.clearOutputSidePacketList = function() {
	  return this.setOutputSidePacketList([]);
	};


	/**
	 * optional int32 max_queue_size = 11;
	 * @return {number}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getMaxQueueSize = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 11, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.setMaxQueueSize = function(value) {
	  return jspb.Message.setProto3IntField(this, 11, value);
	};


	/**
	 * optional bool report_deadlock = 21;
	 * @return {boolean}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getReportDeadlock = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 21, false));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.setReportDeadlock = function(value) {
	  return jspb.Message.setProto3BooleanField(this, 21, value);
	};


	/**
	 * optional InputStreamHandlerConfig input_stream_handler = 12;
	 * @return {?proto.mediapipe.InputStreamHandlerConfig}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getInputStreamHandler = function() {
	  return /** @type{?proto.mediapipe.InputStreamHandlerConfig} */ (
	    jspb.Message.getWrapperField(this, mediapipe_framework_stream_handler_pb.InputStreamHandlerConfig, 12));
	};


	/**
	 * @param {?proto.mediapipe.InputStreamHandlerConfig|undefined} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	*/
	proto.mediapipe.CalculatorGraphConfig.prototype.setInputStreamHandler = function(value) {
	  return jspb.Message.setWrapperField(this, 12, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.clearInputStreamHandler = function() {
	  return this.setInputStreamHandler(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.hasInputStreamHandler = function() {
	  return jspb.Message.getField(this, 12) != null;
	};


	/**
	 * optional OutputStreamHandlerConfig output_stream_handler = 13;
	 * @return {?proto.mediapipe.OutputStreamHandlerConfig}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getOutputStreamHandler = function() {
	  return /** @type{?proto.mediapipe.OutputStreamHandlerConfig} */ (
	    jspb.Message.getWrapperField(this, mediapipe_framework_stream_handler_pb.OutputStreamHandlerConfig, 13));
	};


	/**
	 * @param {?proto.mediapipe.OutputStreamHandlerConfig|undefined} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	*/
	proto.mediapipe.CalculatorGraphConfig.prototype.setOutputStreamHandler = function(value) {
	  return jspb.Message.setWrapperField(this, 13, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.clearOutputStreamHandler = function() {
	  return this.setOutputStreamHandler(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.hasOutputStreamHandler = function() {
	  return jspb.Message.getField(this, 13) != null;
	};


	/**
	 * repeated ExecutorConfig executor = 14;
	 * @return {!Array<!proto.mediapipe.ExecutorConfig>}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getExecutorList = function() {
	  return /** @type{!Array<!proto.mediapipe.ExecutorConfig>} */ (
	    jspb.Message.getRepeatedWrapperField(this, proto.mediapipe.ExecutorConfig, 14));
	};


	/**
	 * @param {!Array<!proto.mediapipe.ExecutorConfig>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	*/
	proto.mediapipe.CalculatorGraphConfig.prototype.setExecutorList = function(value) {
	  return jspb.Message.setRepeatedWrapperField(this, 14, value);
	};


	/**
	 * @param {!proto.mediapipe.ExecutorConfig=} opt_value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.ExecutorConfig}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.addExecutor = function(opt_value, opt_index) {
	  return jspb.Message.addToRepeatedWrapperField(this, 14, opt_value, proto.mediapipe.ExecutorConfig, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.clearExecutorList = function() {
	  return this.setExecutorList([]);
	};


	/**
	 * optional ProfilerConfig profiler_config = 18;
	 * @return {?proto.mediapipe.ProfilerConfig}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getProfilerConfig = function() {
	  return /** @type{?proto.mediapipe.ProfilerConfig} */ (
	    jspb.Message.getWrapperField(this, proto.mediapipe.ProfilerConfig, 18));
	};


	/**
	 * @param {?proto.mediapipe.ProfilerConfig|undefined} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	*/
	proto.mediapipe.CalculatorGraphConfig.prototype.setProfilerConfig = function(value) {
	  return jspb.Message.setWrapperField(this, 18, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.clearProfilerConfig = function() {
	  return this.setProfilerConfig(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.hasProfilerConfig = function() {
	  return jspb.Message.getField(this, 18) != null;
	};


	/**
	 * optional string package = 19;
	 * @return {string}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getPackage = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 19, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.setPackage = function(value) {
	  return jspb.Message.setProto3StringField(this, 19, value);
	};


	/**
	 * optional string type = 20;
	 * @return {string}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getType = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 20, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.setType = function(value) {
	  return jspb.Message.setProto3StringField(this, 20, value);
	};


	/**
	 * optional MediaPipeOptions options = 1001;
	 * @return {?proto.mediapipe.MediaPipeOptions}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getOptions = function() {
	  return /** @type{?proto.mediapipe.MediaPipeOptions} */ (
	    jspb.Message.getWrapperField(this, mediapipe_framework_mediapipe_options_pb.MediaPipeOptions, 1001));
	};


	/**
	 * @param {?proto.mediapipe.MediaPipeOptions|undefined} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	*/
	proto.mediapipe.CalculatorGraphConfig.prototype.setOptions = function(value) {
	  return jspb.Message.setWrapperField(this, 1001, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.clearOptions = function() {
	  return this.setOptions(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.hasOptions = function() {
	  return jspb.Message.getField(this, 1001) != null;
	};


	/**
	 * repeated google.protobuf.Any graph_options = 1002;
	 * @return {!Array<!proto.google.protobuf.Any>}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.getGraphOptionsList = function() {
	  return /** @type{!Array<!proto.google.protobuf.Any>} */ (
	    jspb.Message.getRepeatedWrapperField(this, google_protobuf_any_pb.Any, 1002));
	};


	/**
	 * @param {!Array<!proto.google.protobuf.Any>} value
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	*/
	proto.mediapipe.CalculatorGraphConfig.prototype.setGraphOptionsList = function(value) {
	  return jspb.Message.setRepeatedWrapperField(this, 1002, value);
	};


	/**
	 * @param {!proto.google.protobuf.Any=} opt_value
	 * @param {number=} opt_index
	 * @return {!proto.google.protobuf.Any}
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.addGraphOptions = function(opt_value, opt_index) {
	  return jspb.Message.addToRepeatedWrapperField(this, 1002, opt_value, proto.google.protobuf.Any, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.CalculatorGraphConfig} returns this
	 */
	proto.mediapipe.CalculatorGraphConfig.prototype.clearGraphOptionsList = function() {
	  return this.setGraphOptionsList([]);
	};


	goog.object.extend(exports, proto.mediapipe);
} (calculator_pb));

var base_options_pb = {};

var gpu_origin_pb = {};

(function (exports) {
	// source: mediapipe/gpu/gpu_origin.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	goog.exportSymbol('proto.mediapipe.GpuOrigin', null, global);
	goog.exportSymbol('proto.mediapipe.GpuOrigin.Mode', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.GpuOrigin = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.GpuOrigin, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.GpuOrigin.displayName = 'proto.mediapipe.GpuOrigin';
	}



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.GpuOrigin.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.GpuOrigin.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.GpuOrigin} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.GpuOrigin.toObject = function(includeInstance, msg) {
	  var obj = {

	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.GpuOrigin}
	 */
	proto.mediapipe.GpuOrigin.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.GpuOrigin;
	  return proto.mediapipe.GpuOrigin.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.GpuOrigin} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.GpuOrigin}
	 */
	proto.mediapipe.GpuOrigin.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.GpuOrigin.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.GpuOrigin.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.GpuOrigin} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.GpuOrigin.serializeBinaryToWriter = function(message, writer) {
	};


	/**
	 * @enum {number}
	 */
	proto.mediapipe.GpuOrigin.Mode = {
	  DEFAULT: 0,
	  CONVENTIONAL: 1,
	  TOP_LEFT: 2
	};

	goog.object.extend(exports, proto.mediapipe);
} (gpu_origin_pb));

var acceleration_pb = {};

var inference_calculator_pb = {};

(function (exports) {
	// source: mediapipe/calculators/tensor/inference_calculator.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	var mediapipe_framework_calculator_pb = calculator_pb;
	goog.object.extend(proto, mediapipe_framework_calculator_pb);
	var mediapipe_framework_calculator_options_pb = calculator_options_pb;
	goog.object.extend(proto, mediapipe_framework_calculator_options_pb);
	goog.exportSymbol('proto.mediapipe.InferenceCalculatorOptions', null, global);
	goog.exportSymbol('proto.mediapipe.InferenceCalculatorOptions.Delegate', null, global);
	goog.exportSymbol('proto.mediapipe.InferenceCalculatorOptions.Delegate.DelegateCase', null, global);
	goog.exportSymbol('proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu', null, global);
	goog.exportSymbol('proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.Api', null, global);
	goog.exportSymbol('proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.CacheWritingBehavior', null, global);
	goog.exportSymbol('proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.InferenceUsage', null, global);
	goog.exportSymbol('proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi', null, global);
	goog.exportSymbol('proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite', null, global);
	goog.exportSymbol('proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack', null, global);
	goog.exportSymbol('proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig', null, global);
	goog.exportSymbol('proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink', null, global);
	goog.exportSymbol('proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.InputtensormapCase', null, global);
	goog.exportSymbol('proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.OutputtensormapCase', null, global);
	goog.exportSymbol('proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap', null, global);
	goog.exportSymbol('proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.InferenceCalculatorOptions = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.InferenceCalculatorOptions, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.InferenceCalculatorOptions.displayName = 'proto.mediapipe.InferenceCalculatorOptions';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.mediapipe.InferenceCalculatorOptions.Delegate.oneofGroups_);
	};
	goog.inherits(proto.mediapipe.InferenceCalculatorOptions.Delegate, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.InferenceCalculatorOptions.Delegate.displayName = 'proto.mediapipe.InferenceCalculatorOptions.Delegate';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite.displayName = 'proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.displayName = 'proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.displayName = 'proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.displayName = 'proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.repeatedFields_, proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.oneofGroups_);
	};
	goog.inherits(proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.displayName = 'proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.repeatedFields_, null);
	};
	goog.inherits(proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.displayName = 'proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.repeatedFields_, null);
	};
	goog.inherits(proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.displayName = 'proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.displayName = 'proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink';
	}



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.InferenceCalculatorOptions.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.InferenceCalculatorOptions} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    modelPath: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
	    tryMmapModel: (f = jspb.Message.getBooleanField(msg, 7)) == null ? undefined : f,
	    useGpu: jspb.Message.getBooleanFieldWithDefault(msg, 2, false),
	    useNnapi: jspb.Message.getBooleanFieldWithDefault(msg, 3, false),
	    cpuNumThread: jspb.Message.getFieldWithDefault(msg, 4, -1),
	    delegate: (f = msg.getDelegate()) && proto.mediapipe.InferenceCalculatorOptions.Delegate.toObject(includeInstance, f),
	    inputOutputConfig: (f = msg.getInputOutputConfig()) && proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.toObject(includeInstance, f)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions}
	 */
	proto.mediapipe.InferenceCalculatorOptions.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.InferenceCalculatorOptions;
	  return proto.mediapipe.InferenceCalculatorOptions.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions}
	 */
	proto.mediapipe.InferenceCalculatorOptions.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setModelPath(value);
	      break;
	    case 7:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setTryMmapModel(value);
	      break;
	    case 2:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setUseGpu(value);
	      break;
	    case 3:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setUseNnapi(value);
	      break;
	    case 4:
	      var value = /** @type {number} */ (reader.readInt32());
	      msg.setCpuNumThread(value);
	      break;
	    case 5:
	      var value = new proto.mediapipe.InferenceCalculatorOptions.Delegate;
	      reader.readMessage(value,proto.mediapipe.InferenceCalculatorOptions.Delegate.deserializeBinaryFromReader);
	      msg.setDelegate(value);
	      break;
	    case 8:
	      var value = new proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig;
	      reader.readMessage(value,proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.deserializeBinaryFromReader);
	      msg.setInputOutputConfig(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.InferenceCalculatorOptions.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {string} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeString(
	      1,
	      f
	    );
	  }
	  f = /** @type {boolean} */ (jspb.Message.getField(message, 7));
	  if (f != null) {
	    writer.writeBool(
	      7,
	      f
	    );
	  }
	  f = /** @type {boolean} */ (jspb.Message.getField(message, 2));
	  if (f != null) {
	    writer.writeBool(
	      2,
	      f
	    );
	  }
	  f = /** @type {boolean} */ (jspb.Message.getField(message, 3));
	  if (f != null) {
	    writer.writeBool(
	      3,
	      f
	    );
	  }
	  f = /** @type {number} */ (jspb.Message.getField(message, 4));
	  if (f != null) {
	    writer.writeInt32(
	      4,
	      f
	    );
	  }
	  f = message.getDelegate();
	  if (f != null) {
	    writer.writeMessage(
	      5,
	      f,
	      proto.mediapipe.InferenceCalculatorOptions.Delegate.serializeBinaryToWriter
	    );
	  }
	  f = message.getInputOutputConfig();
	  if (f != null) {
	    writer.writeMessage(
	      8,
	      f,
	      proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.serializeBinaryToWriter
	    );
	  }
	};



	/**
	 * Oneof group definitions for this message. Each group defines the field
	 * numbers belonging to that group. When of these fields' value is set, all
	 * other fields in the group are cleared. During deserialization, if multiple
	 * fields are encountered for a group, only the last value seen will be kept.
	 * @private {!Array<!Array<number>>}
	 * @const
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.oneofGroups_ = [[1,2,3,4]];

	/**
	 * @enum {number}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.DelegateCase = {
	  DELEGATE_NOT_SET: 0,
	  TFLITE: 1,
	  GPU: 2,
	  NNAPI: 3,
	  XNNPACK: 4
	};

	/**
	 * @return {proto.mediapipe.InferenceCalculatorOptions.Delegate.DelegateCase}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.getDelegateCase = function() {
	  return /** @type {proto.mediapipe.InferenceCalculatorOptions.Delegate.DelegateCase} */(jspb.Message.computeOneofCase(this, proto.mediapipe.InferenceCalculatorOptions.Delegate.oneofGroups_[0]));
	};



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.InferenceCalculatorOptions.Delegate.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    tflite: (f = msg.getTflite()) && proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite.toObject(includeInstance, f),
	    gpu: (f = msg.getGpu()) && proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.toObject(includeInstance, f),
	    nnapi: (f = msg.getNnapi()) && proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.toObject(includeInstance, f),
	    xnnpack: (f = msg.getXnnpack()) && proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.toObject(includeInstance, f)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.InferenceCalculatorOptions.Delegate;
	  return proto.mediapipe.InferenceCalculatorOptions.Delegate.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = new proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite;
	      reader.readMessage(value,proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite.deserializeBinaryFromReader);
	      msg.setTflite(value);
	      break;
	    case 2:
	      var value = new proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu;
	      reader.readMessage(value,proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.deserializeBinaryFromReader);
	      msg.setGpu(value);
	      break;
	    case 3:
	      var value = new proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi;
	      reader.readMessage(value,proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.deserializeBinaryFromReader);
	      msg.setNnapi(value);
	      break;
	    case 4:
	      var value = new proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack;
	      reader.readMessage(value,proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.deserializeBinaryFromReader);
	      msg.setXnnpack(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.InferenceCalculatorOptions.Delegate.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = message.getTflite();
	  if (f != null) {
	    writer.writeMessage(
	      1,
	      f,
	      proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite.serializeBinaryToWriter
	    );
	  }
	  f = message.getGpu();
	  if (f != null) {
	    writer.writeMessage(
	      2,
	      f,
	      proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.serializeBinaryToWriter
	    );
	  }
	  f = message.getNnapi();
	  if (f != null) {
	    writer.writeMessage(
	      3,
	      f,
	      proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.serializeBinaryToWriter
	    );
	  }
	  f = message.getXnnpack();
	  if (f != null) {
	    writer.writeMessage(
	      4,
	      f,
	      proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.serializeBinaryToWriter
	    );
	  }
	};





	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite.toObject = function(includeInstance, msg) {
	  var obj = {

	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite;
	  return proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite.serializeBinaryToWriter = function(message, writer) {
	};





	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    useAdvancedGpuApi: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
	    api: jspb.Message.getFieldWithDefault(msg, 4, 0),
	    allowPrecisionLoss: jspb.Message.getBooleanFieldWithDefault(msg, 3, true),
	    cachedKernelPath: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f,
	    serializedModelDir: (f = jspb.Message.getField(msg, 7)) == null ? undefined : f,
	    cacheWritingBehavior: jspb.Message.getFieldWithDefault(msg, 10, 2),
	    modelToken: (f = jspb.Message.getField(msg, 8)) == null ? undefined : f,
	    usage: jspb.Message.getFieldWithDefault(msg, 5, 2)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu;
	  return proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setUseAdvancedGpuApi(value);
	      break;
	    case 4:
	      var value = /** @type {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.Api} */ (reader.readEnum());
	      msg.setApi(value);
	      break;
	    case 3:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setAllowPrecisionLoss(value);
	      break;
	    case 2:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setCachedKernelPath(value);
	      break;
	    case 7:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setSerializedModelDir(value);
	      break;
	    case 10:
	      var value = /** @type {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.CacheWritingBehavior} */ (reader.readEnum());
	      msg.setCacheWritingBehavior(value);
	      break;
	    case 8:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setModelToken(value);
	      break;
	    case 5:
	      var value = /** @type {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.InferenceUsage} */ (reader.readEnum());
	      msg.setUsage(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {boolean} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeBool(
	      1,
	      f
	    );
	  }
	  f = /** @type {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.Api} */ (jspb.Message.getField(message, 4));
	  if (f != null) {
	    writer.writeEnum(
	      4,
	      f
	    );
	  }
	  f = /** @type {boolean} */ (jspb.Message.getField(message, 3));
	  if (f != null) {
	    writer.writeBool(
	      3,
	      f
	    );
	  }
	  f = /** @type {string} */ (jspb.Message.getField(message, 2));
	  if (f != null) {
	    writer.writeString(
	      2,
	      f
	    );
	  }
	  f = /** @type {string} */ (jspb.Message.getField(message, 7));
	  if (f != null) {
	    writer.writeString(
	      7,
	      f
	    );
	  }
	  f = /** @type {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.CacheWritingBehavior} */ (jspb.Message.getField(message, 10));
	  if (f != null) {
	    writer.writeEnum(
	      10,
	      f
	    );
	  }
	  f = /** @type {string} */ (jspb.Message.getField(message, 8));
	  if (f != null) {
	    writer.writeString(
	      8,
	      f
	    );
	  }
	  f = /** @type {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.InferenceUsage} */ (jspb.Message.getField(message, 5));
	  if (f != null) {
	    writer.writeEnum(
	      5,
	      f
	    );
	  }
	};


	/**
	 * @enum {number}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.Api = {
	  ANY: 0,
	  OPENGL: 1,
	  OPENCL: 2
	};

	/**
	 * @enum {number}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.CacheWritingBehavior = {
	  NO_WRITE: 0,
	  TRY_WRITE: 1,
	  WRITE_OR_ERROR: 2
	};

	/**
	 * @enum {number}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.InferenceUsage = {
	  UNSPECIFIED: 0,
	  FAST_SINGLE_ANSWER: 1,
	  SUSTAINED_SPEED: 2
	};

	/**
	 * optional bool use_advanced_gpu_api = 1;
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.getUseAdvancedGpuApi = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.setUseAdvancedGpuApi = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.clearUseAdvancedGpuApi = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.hasUseAdvancedGpuApi = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * optional Api api = 4;
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.Api}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.getApi = function() {
	  return /** @type {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.Api} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
	};


	/**
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.Api} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.setApi = function(value) {
	  return jspb.Message.setField(this, 4, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.clearApi = function() {
	  return jspb.Message.setField(this, 4, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.hasApi = function() {
	  return jspb.Message.getField(this, 4) != null;
	};


	/**
	 * optional bool allow_precision_loss = 3;
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.getAllowPrecisionLoss = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, true));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.setAllowPrecisionLoss = function(value) {
	  return jspb.Message.setField(this, 3, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.clearAllowPrecisionLoss = function() {
	  return jspb.Message.setField(this, 3, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.hasAllowPrecisionLoss = function() {
	  return jspb.Message.getField(this, 3) != null;
	};


	/**
	 * optional string cached_kernel_path = 2;
	 * @return {string}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.getCachedKernelPath = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.setCachedKernelPath = function(value) {
	  return jspb.Message.setField(this, 2, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.clearCachedKernelPath = function() {
	  return jspb.Message.setField(this, 2, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.hasCachedKernelPath = function() {
	  return jspb.Message.getField(this, 2) != null;
	};


	/**
	 * optional string serialized_model_dir = 7;
	 * @return {string}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.getSerializedModelDir = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.setSerializedModelDir = function(value) {
	  return jspb.Message.setField(this, 7, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.clearSerializedModelDir = function() {
	  return jspb.Message.setField(this, 7, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.hasSerializedModelDir = function() {
	  return jspb.Message.getField(this, 7) != null;
	};


	/**
	 * optional CacheWritingBehavior cache_writing_behavior = 10;
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.CacheWritingBehavior}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.getCacheWritingBehavior = function() {
	  return /** @type {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.CacheWritingBehavior} */ (jspb.Message.getFieldWithDefault(this, 10, 2));
	};


	/**
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.CacheWritingBehavior} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.setCacheWritingBehavior = function(value) {
	  return jspb.Message.setField(this, 10, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.clearCacheWritingBehavior = function() {
	  return jspb.Message.setField(this, 10, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.hasCacheWritingBehavior = function() {
	  return jspb.Message.getField(this, 10) != null;
	};


	/**
	 * optional string model_token = 8;
	 * @return {string}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.getModelToken = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.setModelToken = function(value) {
	  return jspb.Message.setField(this, 8, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.clearModelToken = function() {
	  return jspb.Message.setField(this, 8, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.hasModelToken = function() {
	  return jspb.Message.getField(this, 8) != null;
	};


	/**
	 * optional InferenceUsage usage = 5;
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.InferenceUsage}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.getUsage = function() {
	  return /** @type {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.InferenceUsage} */ (jspb.Message.getFieldWithDefault(this, 5, 2));
	};


	/**
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.InferenceUsage} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.setUsage = function(value) {
	  return jspb.Message.setField(this, 5, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.clearUsage = function() {
	  return jspb.Message.setField(this, 5, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu.prototype.hasUsage = function() {
	  return jspb.Message.getField(this, 5) != null;
	};





	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    cacheDir: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
	    modelToken: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f,
	    acceleratorName: (f = jspb.Message.getField(msg, 3)) == null ? undefined : f
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi;
	  return proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setCacheDir(value);
	      break;
	    case 2:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setModelToken(value);
	      break;
	    case 3:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setAcceleratorName(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {string} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeString(
	      1,
	      f
	    );
	  }
	  f = /** @type {string} */ (jspb.Message.getField(message, 2));
	  if (f != null) {
	    writer.writeString(
	      2,
	      f
	    );
	  }
	  f = /** @type {string} */ (jspb.Message.getField(message, 3));
	  if (f != null) {
	    writer.writeString(
	      3,
	      f
	    );
	  }
	};


	/**
	 * optional string cache_dir = 1;
	 * @return {string}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.prototype.getCacheDir = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.prototype.setCacheDir = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.prototype.clearCacheDir = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.prototype.hasCacheDir = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * optional string model_token = 2;
	 * @return {string}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.prototype.getModelToken = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.prototype.setModelToken = function(value) {
	  return jspb.Message.setField(this, 2, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.prototype.clearModelToken = function() {
	  return jspb.Message.setField(this, 2, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.prototype.hasModelToken = function() {
	  return jspb.Message.getField(this, 2) != null;
	};


	/**
	 * optional string accelerator_name = 3;
	 * @return {string}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.prototype.getAcceleratorName = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.prototype.setAcceleratorName = function(value) {
	  return jspb.Message.setField(this, 3, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.prototype.clearAcceleratorName = function() {
	  return jspb.Message.setField(this, 3, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi.prototype.hasAcceleratorName = function() {
	  return jspb.Message.getField(this, 3) != null;
	};





	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    numThreads: jspb.Message.getFieldWithDefault(msg, 1, -1),
	    enableZeroCopyTensorIo: (f = jspb.Message.getBooleanField(msg, 7)) == null ? undefined : f
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack;
	  return proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {number} */ (reader.readInt32());
	      msg.setNumThreads(value);
	      break;
	    case 7:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setEnableZeroCopyTensorIo(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {number} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeInt32(
	      1,
	      f
	    );
	  }
	  f = /** @type {boolean} */ (jspb.Message.getField(message, 7));
	  if (f != null) {
	    writer.writeBool(
	      7,
	      f
	    );
	  }
	};


	/**
	 * optional int32 num_threads = 1;
	 * @return {number}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.prototype.getNumThreads = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, -1));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.prototype.setNumThreads = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.prototype.clearNumThreads = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.prototype.hasNumThreads = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * optional bool enable_zero_copy_tensor_io = 7;
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.prototype.getEnableZeroCopyTensorIo = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 7, false));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.prototype.setEnableZeroCopyTensorIo = function(value) {
	  return jspb.Message.setField(this, 7, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.prototype.clearEnableZeroCopyTensorIo = function() {
	  return jspb.Message.setField(this, 7, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack.prototype.hasEnableZeroCopyTensorIo = function() {
	  return jspb.Message.getField(this, 7) != null;
	};


	/**
	 * optional TfLite tflite = 1;
	 * @return {?proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.getTflite = function() {
	  return /** @type{?proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite} */ (
	    jspb.Message.getWrapperField(this, proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite, 1));
	};


	/**
	 * @param {?proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite|undefined} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate} returns this
	*/
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.setTflite = function(value) {
	  return jspb.Message.setOneofWrapperField(this, 1, proto.mediapipe.InferenceCalculatorOptions.Delegate.oneofGroups_[0], value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.clearTflite = function() {
	  return this.setTflite(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.hasTflite = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * optional Gpu gpu = 2;
	 * @return {?proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.getGpu = function() {
	  return /** @type{?proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} */ (
	    jspb.Message.getWrapperField(this, proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu, 2));
	};


	/**
	 * @param {?proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu|undefined} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate} returns this
	*/
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.setGpu = function(value) {
	  return jspb.Message.setOneofWrapperField(this, 2, proto.mediapipe.InferenceCalculatorOptions.Delegate.oneofGroups_[0], value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.clearGpu = function() {
	  return this.setGpu(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.hasGpu = function() {
	  return jspb.Message.getField(this, 2) != null;
	};


	/**
	 * optional Nnapi nnapi = 3;
	 * @return {?proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.getNnapi = function() {
	  return /** @type{?proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi} */ (
	    jspb.Message.getWrapperField(this, proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi, 3));
	};


	/**
	 * @param {?proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi|undefined} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate} returns this
	*/
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.setNnapi = function(value) {
	  return jspb.Message.setOneofWrapperField(this, 3, proto.mediapipe.InferenceCalculatorOptions.Delegate.oneofGroups_[0], value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.clearNnapi = function() {
	  return this.setNnapi(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.hasNnapi = function() {
	  return jspb.Message.getField(this, 3) != null;
	};


	/**
	 * optional Xnnpack xnnpack = 4;
	 * @return {?proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.getXnnpack = function() {
	  return /** @type{?proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack} */ (
	    jspb.Message.getWrapperField(this, proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack, 4));
	};


	/**
	 * @param {?proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack|undefined} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate} returns this
	*/
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.setXnnpack = function(value) {
	  return jspb.Message.setOneofWrapperField(this, 4, proto.mediapipe.InferenceCalculatorOptions.Delegate.oneofGroups_[0], value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.Delegate} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.clearXnnpack = function() {
	  return this.setXnnpack(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.Delegate.prototype.hasXnnpack = function() {
	  return jspb.Message.getField(this, 4) != null;
	};



	/**
	 * List of repeated fields within this message type.
	 * @private {!Array<number>}
	 * @const
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.repeatedFields_ = [5];

	/**
	 * Oneof group definitions for this message. Each group defines the field
	 * numbers belonging to that group. When of these fields' value is set, all
	 * other fields in the group are cleared. During deserialization, if multiple
	 * fields are encountered for a group, only the last value seen will be kept.
	 * @private {!Array<!Array<number>>}
	 * @const
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.oneofGroups_ = [[1,3],[2,4]];

	/**
	 * @enum {number}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.InputtensormapCase = {
	  INPUTTENSORMAP_NOT_SET: 0,
	  INPUT_TENSOR_INDICES_MAP: 1,
	  INPUT_TENSOR_NAMES_MAP: 3
	};

	/**
	 * @return {proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.InputtensormapCase}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.getInputtensormapCase = function() {
	  return /** @type {proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.InputtensormapCase} */(jspb.Message.computeOneofCase(this, proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.oneofGroups_[0]));
	};

	/**
	 * @enum {number}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.OutputtensormapCase = {
	  OUTPUTTENSORMAP_NOT_SET: 0,
	  OUTPUT_TENSOR_INDICES_MAP: 2,
	  OUTPUT_TENSOR_NAMES_MAP: 4
	};

	/**
	 * @return {proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.OutputtensormapCase}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.getOutputtensormapCase = function() {
	  return /** @type {proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.OutputtensormapCase} */(jspb.Message.computeOneofCase(this, proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.oneofGroups_[1]));
	};



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    inputTensorIndicesMap: (f = msg.getInputTensorIndicesMap()) && proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.toObject(includeInstance, f),
	    inputTensorNamesMap: (f = msg.getInputTensorNamesMap()) && proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.toObject(includeInstance, f),
	    outputTensorIndicesMap: (f = msg.getOutputTensorIndicesMap()) && proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.toObject(includeInstance, f),
	    outputTensorNamesMap: (f = msg.getOutputTensorNamesMap()) && proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.toObject(includeInstance, f),
	    feedbackTensorLinksList: jspb.Message.toObjectList(msg.getFeedbackTensorLinksList(),
	    proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.toObject, includeInstance)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig;
	  return proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = new proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap;
	      reader.readMessage(value,proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.deserializeBinaryFromReader);
	      msg.setInputTensorIndicesMap(value);
	      break;
	    case 3:
	      var value = new proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap;
	      reader.readMessage(value,proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.deserializeBinaryFromReader);
	      msg.setInputTensorNamesMap(value);
	      break;
	    case 2:
	      var value = new proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap;
	      reader.readMessage(value,proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.deserializeBinaryFromReader);
	      msg.setOutputTensorIndicesMap(value);
	      break;
	    case 4:
	      var value = new proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap;
	      reader.readMessage(value,proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.deserializeBinaryFromReader);
	      msg.setOutputTensorNamesMap(value);
	      break;
	    case 5:
	      var value = new proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink;
	      reader.readMessage(value,proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.deserializeBinaryFromReader);
	      msg.addFeedbackTensorLinks(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = message.getInputTensorIndicesMap();
	  if (f != null) {
	    writer.writeMessage(
	      1,
	      f,
	      proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.serializeBinaryToWriter
	    );
	  }
	  f = message.getInputTensorNamesMap();
	  if (f != null) {
	    writer.writeMessage(
	      3,
	      f,
	      proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.serializeBinaryToWriter
	    );
	  }
	  f = message.getOutputTensorIndicesMap();
	  if (f != null) {
	    writer.writeMessage(
	      2,
	      f,
	      proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.serializeBinaryToWriter
	    );
	  }
	  f = message.getOutputTensorNamesMap();
	  if (f != null) {
	    writer.writeMessage(
	      4,
	      f,
	      proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.serializeBinaryToWriter
	    );
	  }
	  f = message.getFeedbackTensorLinksList();
	  if (f.length > 0) {
	    writer.writeRepeatedMessage(
	      5,
	      f,
	      proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.serializeBinaryToWriter
	    );
	  }
	};



	/**
	 * List of repeated fields within this message type.
	 * @private {!Array<number>}
	 * @const
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.repeatedFields_ = [1];



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    modelTensorIndicesList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap;
	  return proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var values = /** @type {!Array<number>} */ (reader.isDelimited() ? reader.readPackedInt32() : [reader.readInt32()]);
	      for (var i = 0; i < values.length; i++) {
	        msg.addModelTensorIndices(values[i]);
	      }
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = message.getModelTensorIndicesList();
	  if (f.length > 0) {
	    writer.writePackedInt32(
	      1,
	      f
	    );
	  }
	};


	/**
	 * repeated int32 model_tensor_indices = 1;
	 * @return {!Array<number>}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.prototype.getModelTensorIndicesList = function() {
	  return /** @type {!Array<number>} */ (jspb.Message.getRepeatedField(this, 1));
	};


	/**
	 * @param {!Array<number>} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.prototype.setModelTensorIndicesList = function(value) {
	  return jspb.Message.setField(this, 1, value || []);
	};


	/**
	 * @param {number} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.prototype.addModelTensorIndices = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap.prototype.clearModelTensorIndicesList = function() {
	  return this.setModelTensorIndicesList([]);
	};



	/**
	 * List of repeated fields within this message type.
	 * @private {!Array<number>}
	 * @const
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.repeatedFields_ = [1];



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    tensorNamesList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap;
	  return proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addTensorNames(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = message.getTensorNamesList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      1,
	      f
	    );
	  }
	};


	/**
	 * repeated string tensor_names = 1;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.prototype.getTensorNamesList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.prototype.setTensorNamesList = function(value) {
	  return jspb.Message.setField(this, 1, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.prototype.addTensorNames = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap.prototype.clearTensorNamesList = function() {
	  return this.setTensorNamesList([]);
	};





	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    fromOutputTensorName: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
	    toInputTensorName: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink;
	  return proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setFromOutputTensorName(value);
	      break;
	    case 2:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setToInputTensorName(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {string} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeString(
	      1,
	      f
	    );
	  }
	  f = /** @type {string} */ (jspb.Message.getField(message, 2));
	  if (f != null) {
	    writer.writeString(
	      2,
	      f
	    );
	  }
	};


	/**
	 * optional string from_output_tensor_name = 1;
	 * @return {string}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.prototype.getFromOutputTensorName = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.prototype.setFromOutputTensorName = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.prototype.clearFromOutputTensorName = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.prototype.hasFromOutputTensorName = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * optional string to_input_tensor_name = 2;
	 * @return {string}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.prototype.getToInputTensorName = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.prototype.setToInputTensorName = function(value) {
	  return jspb.Message.setField(this, 2, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.prototype.clearToInputTensorName = function() {
	  return jspb.Message.setField(this, 2, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink.prototype.hasToInputTensorName = function() {
	  return jspb.Message.getField(this, 2) != null;
	};


	/**
	 * optional TensorIndicesMap input_tensor_indices_map = 1;
	 * @return {?proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.getInputTensorIndicesMap = function() {
	  return /** @type{?proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap} */ (
	    jspb.Message.getWrapperField(this, proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap, 1));
	};


	/**
	 * @param {?proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap|undefined} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig} returns this
	*/
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.setInputTensorIndicesMap = function(value) {
	  return jspb.Message.setOneofWrapperField(this, 1, proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.oneofGroups_[0], value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.clearInputTensorIndicesMap = function() {
	  return this.setInputTensorIndicesMap(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.hasInputTensorIndicesMap = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * optional TensorNamesMap input_tensor_names_map = 3;
	 * @return {?proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.getInputTensorNamesMap = function() {
	  return /** @type{?proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap} */ (
	    jspb.Message.getWrapperField(this, proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap, 3));
	};


	/**
	 * @param {?proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap|undefined} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig} returns this
	*/
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.setInputTensorNamesMap = function(value) {
	  return jspb.Message.setOneofWrapperField(this, 3, proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.oneofGroups_[0], value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.clearInputTensorNamesMap = function() {
	  return this.setInputTensorNamesMap(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.hasInputTensorNamesMap = function() {
	  return jspb.Message.getField(this, 3) != null;
	};


	/**
	 * optional TensorIndicesMap output_tensor_indices_map = 2;
	 * @return {?proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.getOutputTensorIndicesMap = function() {
	  return /** @type{?proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap} */ (
	    jspb.Message.getWrapperField(this, proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap, 2));
	};


	/**
	 * @param {?proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorIndicesMap|undefined} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig} returns this
	*/
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.setOutputTensorIndicesMap = function(value) {
	  return jspb.Message.setOneofWrapperField(this, 2, proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.oneofGroups_[1], value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.clearOutputTensorIndicesMap = function() {
	  return this.setOutputTensorIndicesMap(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.hasOutputTensorIndicesMap = function() {
	  return jspb.Message.getField(this, 2) != null;
	};


	/**
	 * optional TensorNamesMap output_tensor_names_map = 4;
	 * @return {?proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.getOutputTensorNamesMap = function() {
	  return /** @type{?proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap} */ (
	    jspb.Message.getWrapperField(this, proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap, 4));
	};


	/**
	 * @param {?proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.TensorNamesMap|undefined} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig} returns this
	*/
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.setOutputTensorNamesMap = function(value) {
	  return jspb.Message.setOneofWrapperField(this, 4, proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.oneofGroups_[1], value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.clearOutputTensorNamesMap = function() {
	  return this.setOutputTensorNamesMap(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.hasOutputTensorNamesMap = function() {
	  return jspb.Message.getField(this, 4) != null;
	};


	/**
	 * repeated FeedbackTensorLink feedback_tensor_links = 5;
	 * @return {!Array<!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink>}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.getFeedbackTensorLinksList = function() {
	  return /** @type{!Array<!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink>} */ (
	    jspb.Message.getRepeatedWrapperField(this, proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink, 5));
	};


	/**
	 * @param {!Array<!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink>} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig} returns this
	*/
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.setFeedbackTensorLinksList = function(value) {
	  return jspb.Message.setRepeatedWrapperField(this, 5, value);
	};


	/**
	 * @param {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink=} opt_value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink}
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.addFeedbackTensorLinks = function(opt_value, opt_index) {
	  return jspb.Message.addToRepeatedWrapperField(this, 5, opt_value, proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.FeedbackTensorLink, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig.prototype.clearFeedbackTensorLinksList = function() {
	  return this.setFeedbackTensorLinksList([]);
	};



	/**
	 * A tuple of {field number, class constructor} for the extension
	 * field named `ext`.
	 * @type {!jspb.ExtensionFieldInfo<!proto.mediapipe.InferenceCalculatorOptions>}
	 */
	proto.mediapipe.InferenceCalculatorOptions.ext = new jspb.ExtensionFieldInfo(
	    336783863,
	    {ext: 0},
	    proto.mediapipe.InferenceCalculatorOptions,
	     /** @type {?function((boolean|undefined),!jspb.Message=): !Object} */ (
	         proto.mediapipe.InferenceCalculatorOptions.toObject),
	    0);

	mediapipe_framework_calculator_options_pb.CalculatorOptions.extensionsBinary[336783863] = new jspb.ExtensionFieldBinaryInfo(
	    proto.mediapipe.InferenceCalculatorOptions.ext,
	    jspb.BinaryReader.prototype.readMessage,
	    jspb.BinaryWriter.prototype.writeMessage,
	    proto.mediapipe.InferenceCalculatorOptions.serializeBinaryToWriter,
	    proto.mediapipe.InferenceCalculatorOptions.deserializeBinaryFromReader,
	    false);
	// This registers the extension field with the extended class, so that
	// toObject() will function correctly.
	mediapipe_framework_calculator_options_pb.CalculatorOptions.extensions[336783863] = proto.mediapipe.InferenceCalculatorOptions.ext;

	/**
	 * optional string model_path = 1;
	 * @return {string}
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.getModelPath = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.setModelPath = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.clearModelPath = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.hasModelPath = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * optional bool try_mmap_model = 7;
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.getTryMmapModel = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 7, false));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.setTryMmapModel = function(value) {
	  return jspb.Message.setField(this, 7, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.clearTryMmapModel = function() {
	  return jspb.Message.setField(this, 7, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.hasTryMmapModel = function() {
	  return jspb.Message.getField(this, 7) != null;
	};


	/**
	 * optional bool use_gpu = 2;
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.getUseGpu = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.setUseGpu = function(value) {
	  return jspb.Message.setField(this, 2, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.clearUseGpu = function() {
	  return jspb.Message.setField(this, 2, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.hasUseGpu = function() {
	  return jspb.Message.getField(this, 2) != null;
	};


	/**
	 * optional bool use_nnapi = 3;
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.getUseNnapi = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.setUseNnapi = function(value) {
	  return jspb.Message.setField(this, 3, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.clearUseNnapi = function() {
	  return jspb.Message.setField(this, 3, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.hasUseNnapi = function() {
	  return jspb.Message.getField(this, 3) != null;
	};


	/**
	 * optional int32 cpu_num_thread = 4;
	 * @return {number}
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.getCpuNumThread = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, -1));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.setCpuNumThread = function(value) {
	  return jspb.Message.setField(this, 4, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.clearCpuNumThread = function() {
	  return jspb.Message.setField(this, 4, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.hasCpuNumThread = function() {
	  return jspb.Message.getField(this, 4) != null;
	};


	/**
	 * optional Delegate delegate = 5;
	 * @return {?proto.mediapipe.InferenceCalculatorOptions.Delegate}
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.getDelegate = function() {
	  return /** @type{?proto.mediapipe.InferenceCalculatorOptions.Delegate} */ (
	    jspb.Message.getWrapperField(this, proto.mediapipe.InferenceCalculatorOptions.Delegate, 5));
	};


	/**
	 * @param {?proto.mediapipe.InferenceCalculatorOptions.Delegate|undefined} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions} returns this
	*/
	proto.mediapipe.InferenceCalculatorOptions.prototype.setDelegate = function(value) {
	  return jspb.Message.setWrapperField(this, 5, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.clearDelegate = function() {
	  return this.setDelegate(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.hasDelegate = function() {
	  return jspb.Message.getField(this, 5) != null;
	};


	/**
	 * optional InputOutputConfig input_output_config = 8;
	 * @return {?proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig}
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.getInputOutputConfig = function() {
	  return /** @type{?proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig} */ (
	    jspb.Message.getWrapperField(this, proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig, 8));
	};


	/**
	 * @param {?proto.mediapipe.InferenceCalculatorOptions.InputOutputConfig|undefined} value
	 * @return {!proto.mediapipe.InferenceCalculatorOptions} returns this
	*/
	proto.mediapipe.InferenceCalculatorOptions.prototype.setInputOutputConfig = function(value) {
	  return jspb.Message.setWrapperField(this, 8, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.InferenceCalculatorOptions} returns this
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.clearInputOutputConfig = function() {
	  return this.setInputOutputConfig(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.InferenceCalculatorOptions.prototype.hasInputOutputConfig = function() {
	  return jspb.Message.getField(this, 8) != null;
	};



	/**
	 * A tuple of {field number, class constructor} for the extension
	 * field named `ext`.
	 * @type {!jspb.ExtensionFieldInfo<!proto.mediapipe.InferenceCalculatorOptions>}
	 */
	proto.mediapipe.InferenceCalculatorOptions.ext = new jspb.ExtensionFieldInfo(
	    336783863,
	    {ext: 0},
	    proto.mediapipe.InferenceCalculatorOptions,
	     /** @type {?function((boolean|undefined),!jspb.Message=): !Object} */ (
	         proto.mediapipe.InferenceCalculatorOptions.toObject),
	    0);

	mediapipe_framework_calculator_options_pb.CalculatorOptions.extensionsBinary[336783863] = new jspb.ExtensionFieldBinaryInfo(
	    proto.mediapipe.InferenceCalculatorOptions.ext,
	    jspb.BinaryReader.prototype.readMessage,
	    jspb.BinaryWriter.prototype.writeMessage,
	    proto.mediapipe.InferenceCalculatorOptions.serializeBinaryToWriter,
	    proto.mediapipe.InferenceCalculatorOptions.deserializeBinaryFromReader,
	    false);
	// This registers the extension field with the extended class, so that
	// toObject() will function correctly.
	mediapipe_framework_calculator_options_pb.CalculatorOptions.extensions[336783863] = proto.mediapipe.InferenceCalculatorOptions.ext;

	goog.object.extend(exports, proto.mediapipe);
} (inference_calculator_pb));

(function (exports) {
	// source: mediapipe/tasks/cc/core/proto/acceleration.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	var mediapipe_calculators_tensor_inference_calculator_pb = inference_calculator_pb;
	goog.object.extend(proto, mediapipe_calculators_tensor_inference_calculator_pb);
	goog.exportSymbol('proto.mediapipe.tasks.core.proto.Acceleration', null, global);
	goog.exportSymbol('proto.mediapipe.tasks.core.proto.Acceleration.DelegateCase', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.tasks.core.proto.Acceleration = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.mediapipe.tasks.core.proto.Acceleration.oneofGroups_);
	};
	goog.inherits(proto.mediapipe.tasks.core.proto.Acceleration, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.tasks.core.proto.Acceleration.displayName = 'proto.mediapipe.tasks.core.proto.Acceleration';
	}

	/**
	 * Oneof group definitions for this message. Each group defines the field
	 * numbers belonging to that group. When of these fields' value is set, all
	 * other fields in the group are cleared. During deserialization, if multiple
	 * fields are encountered for a group, only the last value seen will be kept.
	 * @private {!Array<!Array<number>>}
	 * @const
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.oneofGroups_ = [[1,2,4,5]];

	/**
	 * @enum {number}
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.DelegateCase = {
	  DELEGATE_NOT_SET: 0,
	  XNNPACK: 1,
	  GPU: 2,
	  TFLITE: 4,
	  NNAPI: 5
	};

	/**
	 * @return {proto.mediapipe.tasks.core.proto.Acceleration.DelegateCase}
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.getDelegateCase = function() {
	  return /** @type {proto.mediapipe.tasks.core.proto.Acceleration.DelegateCase} */(jspb.Message.computeOneofCase(this, proto.mediapipe.tasks.core.proto.Acceleration.oneofGroups_[0]));
	};



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.tasks.core.proto.Acceleration.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.tasks.core.proto.Acceleration} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    xnnpack: (f = msg.getXnnpack()) && mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.Xnnpack.toObject(includeInstance, f),
	    gpu: (f = msg.getGpu()) && mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.Gpu.toObject(includeInstance, f),
	    tflite: (f = msg.getTflite()) && mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.TfLite.toObject(includeInstance, f),
	    nnapi: (f = msg.getNnapi()) && mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.Nnapi.toObject(includeInstance, f)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.tasks.core.proto.Acceleration}
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.tasks.core.proto.Acceleration;
	  return proto.mediapipe.tasks.core.proto.Acceleration.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.tasks.core.proto.Acceleration} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.tasks.core.proto.Acceleration}
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = new mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.Xnnpack;
	      reader.readMessage(value,mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.Xnnpack.deserializeBinaryFromReader);
	      msg.setXnnpack(value);
	      break;
	    case 2:
	      var value = new mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.Gpu;
	      reader.readMessage(value,mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.Gpu.deserializeBinaryFromReader);
	      msg.setGpu(value);
	      break;
	    case 4:
	      var value = new mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.TfLite;
	      reader.readMessage(value,mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.TfLite.deserializeBinaryFromReader);
	      msg.setTflite(value);
	      break;
	    case 5:
	      var value = new mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.Nnapi;
	      reader.readMessage(value,mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.Nnapi.deserializeBinaryFromReader);
	      msg.setNnapi(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.tasks.core.proto.Acceleration.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.tasks.core.proto.Acceleration} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = message.getXnnpack();
	  if (f != null) {
	    writer.writeMessage(
	      1,
	      f,
	      mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.Xnnpack.serializeBinaryToWriter
	    );
	  }
	  f = message.getGpu();
	  if (f != null) {
	    writer.writeMessage(
	      2,
	      f,
	      mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.Gpu.serializeBinaryToWriter
	    );
	  }
	  f = message.getTflite();
	  if (f != null) {
	    writer.writeMessage(
	      4,
	      f,
	      mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.TfLite.serializeBinaryToWriter
	    );
	  }
	  f = message.getNnapi();
	  if (f != null) {
	    writer.writeMessage(
	      5,
	      f,
	      mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.Nnapi.serializeBinaryToWriter
	    );
	  }
	};


	/**
	 * optional mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack xnnpack = 1;
	 * @return {?proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack}
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.getXnnpack = function() {
	  return /** @type{?proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack} */ (
	    jspb.Message.getWrapperField(this, mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.Xnnpack, 1));
	};


	/**
	 * @param {?proto.mediapipe.InferenceCalculatorOptions.Delegate.Xnnpack|undefined} value
	 * @return {!proto.mediapipe.tasks.core.proto.Acceleration} returns this
	*/
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.setXnnpack = function(value) {
	  return jspb.Message.setOneofWrapperField(this, 1, proto.mediapipe.tasks.core.proto.Acceleration.oneofGroups_[0], value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.tasks.core.proto.Acceleration} returns this
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.clearXnnpack = function() {
	  return this.setXnnpack(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.hasXnnpack = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * optional mediapipe.InferenceCalculatorOptions.Delegate.Gpu gpu = 2;
	 * @return {?proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu}
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.getGpu = function() {
	  return /** @type{?proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu} */ (
	    jspb.Message.getWrapperField(this, mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.Gpu, 2));
	};


	/**
	 * @param {?proto.mediapipe.InferenceCalculatorOptions.Delegate.Gpu|undefined} value
	 * @return {!proto.mediapipe.tasks.core.proto.Acceleration} returns this
	*/
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.setGpu = function(value) {
	  return jspb.Message.setOneofWrapperField(this, 2, proto.mediapipe.tasks.core.proto.Acceleration.oneofGroups_[0], value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.tasks.core.proto.Acceleration} returns this
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.clearGpu = function() {
	  return this.setGpu(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.hasGpu = function() {
	  return jspb.Message.getField(this, 2) != null;
	};


	/**
	 * optional mediapipe.InferenceCalculatorOptions.Delegate.TfLite tflite = 4;
	 * @return {?proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite}
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.getTflite = function() {
	  return /** @type{?proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite} */ (
	    jspb.Message.getWrapperField(this, mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.TfLite, 4));
	};


	/**
	 * @param {?proto.mediapipe.InferenceCalculatorOptions.Delegate.TfLite|undefined} value
	 * @return {!proto.mediapipe.tasks.core.proto.Acceleration} returns this
	*/
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.setTflite = function(value) {
	  return jspb.Message.setOneofWrapperField(this, 4, proto.mediapipe.tasks.core.proto.Acceleration.oneofGroups_[0], value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.tasks.core.proto.Acceleration} returns this
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.clearTflite = function() {
	  return this.setTflite(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.hasTflite = function() {
	  return jspb.Message.getField(this, 4) != null;
	};


	/**
	 * optional mediapipe.InferenceCalculatorOptions.Delegate.Nnapi nnapi = 5;
	 * @return {?proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi}
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.getNnapi = function() {
	  return /** @type{?proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi} */ (
	    jspb.Message.getWrapperField(this, mediapipe_calculators_tensor_inference_calculator_pb.InferenceCalculatorOptions.Delegate.Nnapi, 5));
	};


	/**
	 * @param {?proto.mediapipe.InferenceCalculatorOptions.Delegate.Nnapi|undefined} value
	 * @return {!proto.mediapipe.tasks.core.proto.Acceleration} returns this
	*/
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.setNnapi = function(value) {
	  return jspb.Message.setOneofWrapperField(this, 5, proto.mediapipe.tasks.core.proto.Acceleration.oneofGroups_[0], value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.tasks.core.proto.Acceleration} returns this
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.clearNnapi = function() {
	  return this.setNnapi(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.Acceleration.prototype.hasNnapi = function() {
	  return jspb.Message.getField(this, 5) != null;
	};


	goog.object.extend(exports, proto.mediapipe.tasks.core.proto);
} (acceleration_pb));

var external_file_pb = {};

(function (exports) {
	// source: mediapipe/tasks/cc/core/proto/external_file.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	goog.exportSymbol('proto.mediapipe.tasks.core.proto.ExternalFile', null, global);
	goog.exportSymbol('proto.mediapipe.tasks.core.proto.FileDescriptorMeta', null, global);
	goog.exportSymbol('proto.mediapipe.tasks.core.proto.FilePointerMeta', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.tasks.core.proto.ExternalFile, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.tasks.core.proto.ExternalFile.displayName = 'proto.mediapipe.tasks.core.proto.ExternalFile';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.tasks.core.proto.FileDescriptorMeta, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.tasks.core.proto.FileDescriptorMeta.displayName = 'proto.mediapipe.tasks.core.proto.FileDescriptorMeta';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.tasks.core.proto.FilePointerMeta = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.tasks.core.proto.FilePointerMeta, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.tasks.core.proto.FilePointerMeta.displayName = 'proto.mediapipe.tasks.core.proto.FilePointerMeta';
	}



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.tasks.core.proto.ExternalFile.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.tasks.core.proto.ExternalFile} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    fileContent: msg.getFileContent_asB64(),
	    fileName: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f,
	    fileDescriptorMeta: (f = msg.getFileDescriptorMeta()) && proto.mediapipe.tasks.core.proto.FileDescriptorMeta.toObject(includeInstance, f),
	    filePointerMeta: (f = msg.getFilePointerMeta()) && proto.mediapipe.tasks.core.proto.FilePointerMeta.toObject(includeInstance, f)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.tasks.core.proto.ExternalFile}
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.tasks.core.proto.ExternalFile;
	  return proto.mediapipe.tasks.core.proto.ExternalFile.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.tasks.core.proto.ExternalFile} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.tasks.core.proto.ExternalFile}
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {!Uint8Array} */ (reader.readBytes());
	      msg.setFileContent(value);
	      break;
	    case 2:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setFileName(value);
	      break;
	    case 3:
	      var value = new proto.mediapipe.tasks.core.proto.FileDescriptorMeta;
	      reader.readMessage(value,proto.mediapipe.tasks.core.proto.FileDescriptorMeta.deserializeBinaryFromReader);
	      msg.setFileDescriptorMeta(value);
	      break;
	    case 4:
	      var value = new proto.mediapipe.tasks.core.proto.FilePointerMeta;
	      reader.readMessage(value,proto.mediapipe.tasks.core.proto.FilePointerMeta.deserializeBinaryFromReader);
	      msg.setFilePointerMeta(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.tasks.core.proto.ExternalFile.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.tasks.core.proto.ExternalFile} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeBytes(
	      1,
	      f
	    );
	  }
	  f = /** @type {string} */ (jspb.Message.getField(message, 2));
	  if (f != null) {
	    writer.writeString(
	      2,
	      f
	    );
	  }
	  f = message.getFileDescriptorMeta();
	  if (f != null) {
	    writer.writeMessage(
	      3,
	      f,
	      proto.mediapipe.tasks.core.proto.FileDescriptorMeta.serializeBinaryToWriter
	    );
	  }
	  f = message.getFilePointerMeta();
	  if (f != null) {
	    writer.writeMessage(
	      4,
	      f,
	      proto.mediapipe.tasks.core.proto.FilePointerMeta.serializeBinaryToWriter
	    );
	  }
	};


	/**
	 * optional bytes file_content = 1;
	 * @return {!(string|Uint8Array)}
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.getFileContent = function() {
	  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
	};


	/**
	 * optional bytes file_content = 1;
	 * This is a type-conversion wrapper around `getFileContent()`
	 * @return {string}
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.getFileContent_asB64 = function() {
	  return /** @type {string} */ (jspb.Message.bytesAsB64(
	      this.getFileContent()));
	};


	/**
	 * optional bytes file_content = 1;
	 * Note that Uint8Array is not supported on all browsers.
	 * @see http://caniuse.com/Uint8Array
	 * This is a type-conversion wrapper around `getFileContent()`
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.getFileContent_asU8 = function() {
	  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
	      this.getFileContent()));
	};


	/**
	 * @param {!(string|Uint8Array)} value
	 * @return {!proto.mediapipe.tasks.core.proto.ExternalFile} returns this
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.setFileContent = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.tasks.core.proto.ExternalFile} returns this
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.clearFileContent = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.hasFileContent = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * optional string file_name = 2;
	 * @return {string}
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.getFileName = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.tasks.core.proto.ExternalFile} returns this
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.setFileName = function(value) {
	  return jspb.Message.setField(this, 2, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.tasks.core.proto.ExternalFile} returns this
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.clearFileName = function() {
	  return jspb.Message.setField(this, 2, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.hasFileName = function() {
	  return jspb.Message.getField(this, 2) != null;
	};


	/**
	 * optional FileDescriptorMeta file_descriptor_meta = 3;
	 * @return {?proto.mediapipe.tasks.core.proto.FileDescriptorMeta}
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.getFileDescriptorMeta = function() {
	  return /** @type{?proto.mediapipe.tasks.core.proto.FileDescriptorMeta} */ (
	    jspb.Message.getWrapperField(this, proto.mediapipe.tasks.core.proto.FileDescriptorMeta, 3));
	};


	/**
	 * @param {?proto.mediapipe.tasks.core.proto.FileDescriptorMeta|undefined} value
	 * @return {!proto.mediapipe.tasks.core.proto.ExternalFile} returns this
	*/
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.setFileDescriptorMeta = function(value) {
	  return jspb.Message.setWrapperField(this, 3, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.tasks.core.proto.ExternalFile} returns this
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.clearFileDescriptorMeta = function() {
	  return this.setFileDescriptorMeta(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.hasFileDescriptorMeta = function() {
	  return jspb.Message.getField(this, 3) != null;
	};


	/**
	 * optional FilePointerMeta file_pointer_meta = 4;
	 * @return {?proto.mediapipe.tasks.core.proto.FilePointerMeta}
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.getFilePointerMeta = function() {
	  return /** @type{?proto.mediapipe.tasks.core.proto.FilePointerMeta} */ (
	    jspb.Message.getWrapperField(this, proto.mediapipe.tasks.core.proto.FilePointerMeta, 4));
	};


	/**
	 * @param {?proto.mediapipe.tasks.core.proto.FilePointerMeta|undefined} value
	 * @return {!proto.mediapipe.tasks.core.proto.ExternalFile} returns this
	*/
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.setFilePointerMeta = function(value) {
	  return jspb.Message.setWrapperField(this, 4, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.tasks.core.proto.ExternalFile} returns this
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.clearFilePointerMeta = function() {
	  return this.setFilePointerMeta(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.ExternalFile.prototype.hasFilePointerMeta = function() {
	  return jspb.Message.getField(this, 4) != null;
	};





	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.tasks.core.proto.FileDescriptorMeta.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.tasks.core.proto.FileDescriptorMeta} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    fd: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
	    length: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f,
	    offset: (f = jspb.Message.getField(msg, 3)) == null ? undefined : f
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.tasks.core.proto.FileDescriptorMeta}
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.tasks.core.proto.FileDescriptorMeta;
	  return proto.mediapipe.tasks.core.proto.FileDescriptorMeta.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.tasks.core.proto.FileDescriptorMeta} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.tasks.core.proto.FileDescriptorMeta}
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {number} */ (reader.readInt32());
	      msg.setFd(value);
	      break;
	    case 2:
	      var value = /** @type {number} */ (reader.readInt64());
	      msg.setLength(value);
	      break;
	    case 3:
	      var value = /** @type {number} */ (reader.readInt64());
	      msg.setOffset(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.tasks.core.proto.FileDescriptorMeta.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.tasks.core.proto.FileDescriptorMeta} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {number} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeInt32(
	      1,
	      f
	    );
	  }
	  f = /** @type {number} */ (jspb.Message.getField(message, 2));
	  if (f != null) {
	    writer.writeInt64(
	      2,
	      f
	    );
	  }
	  f = /** @type {number} */ (jspb.Message.getField(message, 3));
	  if (f != null) {
	    writer.writeInt64(
	      3,
	      f
	    );
	  }
	};


	/**
	 * optional int32 fd = 1;
	 * @return {number}
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.prototype.getFd = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.tasks.core.proto.FileDescriptorMeta} returns this
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.prototype.setFd = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.tasks.core.proto.FileDescriptorMeta} returns this
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.prototype.clearFd = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.prototype.hasFd = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * optional int64 length = 2;
	 * @return {number}
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.prototype.getLength = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.tasks.core.proto.FileDescriptorMeta} returns this
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.prototype.setLength = function(value) {
	  return jspb.Message.setField(this, 2, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.tasks.core.proto.FileDescriptorMeta} returns this
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.prototype.clearLength = function() {
	  return jspb.Message.setField(this, 2, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.prototype.hasLength = function() {
	  return jspb.Message.getField(this, 2) != null;
	};


	/**
	 * optional int64 offset = 3;
	 * @return {number}
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.prototype.getOffset = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.tasks.core.proto.FileDescriptorMeta} returns this
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.prototype.setOffset = function(value) {
	  return jspb.Message.setField(this, 3, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.tasks.core.proto.FileDescriptorMeta} returns this
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.prototype.clearOffset = function() {
	  return jspb.Message.setField(this, 3, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.FileDescriptorMeta.prototype.hasOffset = function() {
	  return jspb.Message.getField(this, 3) != null;
	};





	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.tasks.core.proto.FilePointerMeta.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.tasks.core.proto.FilePointerMeta.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.tasks.core.proto.FilePointerMeta} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.tasks.core.proto.FilePointerMeta.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    pointer: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
	    length: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.tasks.core.proto.FilePointerMeta}
	 */
	proto.mediapipe.tasks.core.proto.FilePointerMeta.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.tasks.core.proto.FilePointerMeta;
	  return proto.mediapipe.tasks.core.proto.FilePointerMeta.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.tasks.core.proto.FilePointerMeta} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.tasks.core.proto.FilePointerMeta}
	 */
	proto.mediapipe.tasks.core.proto.FilePointerMeta.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {number} */ (reader.readUint64());
	      msg.setPointer(value);
	      break;
	    case 2:
	      var value = /** @type {number} */ (reader.readInt64());
	      msg.setLength(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.tasks.core.proto.FilePointerMeta.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.tasks.core.proto.FilePointerMeta.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.tasks.core.proto.FilePointerMeta} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.tasks.core.proto.FilePointerMeta.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {number} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeUint64(
	      1,
	      f
	    );
	  }
	  f = /** @type {number} */ (jspb.Message.getField(message, 2));
	  if (f != null) {
	    writer.writeInt64(
	      2,
	      f
	    );
	  }
	};


	/**
	 * optional uint64 pointer = 1;
	 * @return {number}
	 */
	proto.mediapipe.tasks.core.proto.FilePointerMeta.prototype.getPointer = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.tasks.core.proto.FilePointerMeta} returns this
	 */
	proto.mediapipe.tasks.core.proto.FilePointerMeta.prototype.setPointer = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.tasks.core.proto.FilePointerMeta} returns this
	 */
	proto.mediapipe.tasks.core.proto.FilePointerMeta.prototype.clearPointer = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.FilePointerMeta.prototype.hasPointer = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * optional int64 length = 2;
	 * @return {number}
	 */
	proto.mediapipe.tasks.core.proto.FilePointerMeta.prototype.getLength = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.tasks.core.proto.FilePointerMeta} returns this
	 */
	proto.mediapipe.tasks.core.proto.FilePointerMeta.prototype.setLength = function(value) {
	  return jspb.Message.setField(this, 2, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.tasks.core.proto.FilePointerMeta} returns this
	 */
	proto.mediapipe.tasks.core.proto.FilePointerMeta.prototype.clearLength = function() {
	  return jspb.Message.setField(this, 2, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.FilePointerMeta.prototype.hasLength = function() {
	  return jspb.Message.getField(this, 2) != null;
	};


	goog.object.extend(exports, proto.mediapipe.tasks.core.proto);
} (external_file_pb));

(function (exports) {
	// source: mediapipe/tasks/cc/core/proto/base_options.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	var mediapipe_gpu_gpu_origin_pb = gpu_origin_pb;
	goog.object.extend(proto, mediapipe_gpu_gpu_origin_pb);
	var mediapipe_tasks_cc_core_proto_acceleration_pb = acceleration_pb;
	goog.object.extend(proto, mediapipe_tasks_cc_core_proto_acceleration_pb);
	var mediapipe_tasks_cc_core_proto_external_file_pb = external_file_pb;
	goog.object.extend(proto, mediapipe_tasks_cc_core_proto_external_file_pb);
	goog.exportSymbol('proto.mediapipe.tasks.core.proto.BaseOptions', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.tasks.core.proto.BaseOptions, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.tasks.core.proto.BaseOptions.displayName = 'proto.mediapipe.tasks.core.proto.BaseOptions';
	}



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.tasks.core.proto.BaseOptions.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.tasks.core.proto.BaseOptions} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    modelAsset: (f = msg.getModelAsset()) && mediapipe_tasks_cc_core_proto_external_file_pb.ExternalFile.toObject(includeInstance, f),
	    useStreamMode: jspb.Message.getBooleanFieldWithDefault(msg, 2, false),
	    acceleration: (f = msg.getAcceleration()) && mediapipe_tasks_cc_core_proto_acceleration_pb.Acceleration.toObject(includeInstance, f),
	    gpuOrigin: jspb.Message.getFieldWithDefault(msg, 4, 2)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.tasks.core.proto.BaseOptions}
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.tasks.core.proto.BaseOptions;
	  return proto.mediapipe.tasks.core.proto.BaseOptions.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.tasks.core.proto.BaseOptions} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.tasks.core.proto.BaseOptions}
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = new mediapipe_tasks_cc_core_proto_external_file_pb.ExternalFile;
	      reader.readMessage(value,mediapipe_tasks_cc_core_proto_external_file_pb.ExternalFile.deserializeBinaryFromReader);
	      msg.setModelAsset(value);
	      break;
	    case 2:
	      var value = /** @type {boolean} */ (reader.readBool());
	      msg.setUseStreamMode(value);
	      break;
	    case 3:
	      var value = new mediapipe_tasks_cc_core_proto_acceleration_pb.Acceleration;
	      reader.readMessage(value,mediapipe_tasks_cc_core_proto_acceleration_pb.Acceleration.deserializeBinaryFromReader);
	      msg.setAcceleration(value);
	      break;
	    case 4:
	      var value = /** @type {!proto.mediapipe.GpuOrigin.Mode} */ (reader.readEnum());
	      msg.setGpuOrigin(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.tasks.core.proto.BaseOptions.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.tasks.core.proto.BaseOptions} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = message.getModelAsset();
	  if (f != null) {
	    writer.writeMessage(
	      1,
	      f,
	      mediapipe_tasks_cc_core_proto_external_file_pb.ExternalFile.serializeBinaryToWriter
	    );
	  }
	  f = /** @type {boolean} */ (jspb.Message.getField(message, 2));
	  if (f != null) {
	    writer.writeBool(
	      2,
	      f
	    );
	  }
	  f = message.getAcceleration();
	  if (f != null) {
	    writer.writeMessage(
	      3,
	      f,
	      mediapipe_tasks_cc_core_proto_acceleration_pb.Acceleration.serializeBinaryToWriter
	    );
	  }
	  f = /** @type {!proto.mediapipe.GpuOrigin.Mode} */ (jspb.Message.getField(message, 4));
	  if (f != null) {
	    writer.writeEnum(
	      4,
	      f
	    );
	  }
	};


	/**
	 * optional ExternalFile model_asset = 1;
	 * @return {?proto.mediapipe.tasks.core.proto.ExternalFile}
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.getModelAsset = function() {
	  return /** @type{?proto.mediapipe.tasks.core.proto.ExternalFile} */ (
	    jspb.Message.getWrapperField(this, mediapipe_tasks_cc_core_proto_external_file_pb.ExternalFile, 1));
	};


	/**
	 * @param {?proto.mediapipe.tasks.core.proto.ExternalFile|undefined} value
	 * @return {!proto.mediapipe.tasks.core.proto.BaseOptions} returns this
	*/
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.setModelAsset = function(value) {
	  return jspb.Message.setWrapperField(this, 1, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.tasks.core.proto.BaseOptions} returns this
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.clearModelAsset = function() {
	  return this.setModelAsset(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.hasModelAsset = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * optional bool use_stream_mode = 2;
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.getUseStreamMode = function() {
	  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
	};


	/**
	 * @param {boolean} value
	 * @return {!proto.mediapipe.tasks.core.proto.BaseOptions} returns this
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.setUseStreamMode = function(value) {
	  return jspb.Message.setField(this, 2, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.tasks.core.proto.BaseOptions} returns this
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.clearUseStreamMode = function() {
	  return jspb.Message.setField(this, 2, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.hasUseStreamMode = function() {
	  return jspb.Message.getField(this, 2) != null;
	};


	/**
	 * optional Acceleration acceleration = 3;
	 * @return {?proto.mediapipe.tasks.core.proto.Acceleration}
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.getAcceleration = function() {
	  return /** @type{?proto.mediapipe.tasks.core.proto.Acceleration} */ (
	    jspb.Message.getWrapperField(this, mediapipe_tasks_cc_core_proto_acceleration_pb.Acceleration, 3));
	};


	/**
	 * @param {?proto.mediapipe.tasks.core.proto.Acceleration|undefined} value
	 * @return {!proto.mediapipe.tasks.core.proto.BaseOptions} returns this
	*/
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.setAcceleration = function(value) {
	  return jspb.Message.setWrapperField(this, 3, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.tasks.core.proto.BaseOptions} returns this
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.clearAcceleration = function() {
	  return this.setAcceleration(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.hasAcceleration = function() {
	  return jspb.Message.getField(this, 3) != null;
	};


	/**
	 * optional mediapipe.GpuOrigin.Mode gpu_origin = 4;
	 * @return {!proto.mediapipe.GpuOrigin.Mode}
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.getGpuOrigin = function() {
	  return /** @type {!proto.mediapipe.GpuOrigin.Mode} */ (jspb.Message.getFieldWithDefault(this, 4, 2));
	};


	/**
	 * @param {!proto.mediapipe.GpuOrigin.Mode} value
	 * @return {!proto.mediapipe.tasks.core.proto.BaseOptions} returns this
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.setGpuOrigin = function(value) {
	  return jspb.Message.setField(this, 4, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.tasks.core.proto.BaseOptions} returns this
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.clearGpuOrigin = function() {
	  return jspb.Message.setField(this, 4, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.core.proto.BaseOptions.prototype.hasGpuOrigin = function() {
	  return jspb.Message.getField(this, 4) != null;
	};


	goog.object.extend(exports, proto.mediapipe.tasks.core.proto);
} (base_options_pb));

var tensors_to_segmentation_calculator_pb = {};

var segmenter_options_pb = {};

(function (exports) {
	// source: mediapipe/tasks/cc/vision/image_segmenter/proto/segmenter_options.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	goog.exportSymbol('proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions', null, global);
	goog.exportSymbol('proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.Activation', null, global);
	goog.exportSymbol('proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.OutputType', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.displayName = 'proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions';
	}



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    outputType: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
	    activation: jspb.Message.getFieldWithDefault(msg, 2, 0)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions;
	  return proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.OutputType} */ (reader.readEnum());
	      msg.setOutputType(value);
	      break;
	    case 2:
	      var value = /** @type {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.Activation} */ (reader.readEnum());
	      msg.setActivation(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.OutputType} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeEnum(
	      1,
	      f
	    );
	  }
	  f = /** @type {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.Activation} */ (jspb.Message.getField(message, 2));
	  if (f != null) {
	    writer.writeEnum(
	      2,
	      f
	    );
	  }
	};


	/**
	 * @enum {number}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.OutputType = {
	  UNSPECIFIED: 0,
	  CATEGORY_MASK: 1,
	  CONFIDENCE_MASK: 2
	};

	/**
	 * @enum {number}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.Activation = {
	  NONE: 0,
	  SIGMOID: 1,
	  SOFTMAX: 2
	};

	/**
	 * optional OutputType output_type = 1;
	 * @return {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.OutputType}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.prototype.getOutputType = function() {
	  return /** @type {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.OutputType} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
	};


	/**
	 * @param {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.OutputType} value
	 * @return {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions} returns this
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.prototype.setOutputType = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions} returns this
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.prototype.clearOutputType = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.prototype.hasOutputType = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * optional Activation activation = 2;
	 * @return {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.Activation}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.prototype.getActivation = function() {
	  return /** @type {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.Activation} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
	};


	/**
	 * @param {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.Activation} value
	 * @return {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions} returns this
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.prototype.setActivation = function(value) {
	  return jspb.Message.setField(this, 2, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions} returns this
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.prototype.clearActivation = function() {
	  return jspb.Message.setField(this, 2, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions.prototype.hasActivation = function() {
	  return jspb.Message.getField(this, 2) != null;
	};


	goog.object.extend(exports, proto.mediapipe.tasks.vision.image_segmenter.proto);
} (segmenter_options_pb));

var label_map_pb = {};

(function (exports) {
	// source: mediapipe/util/label_map.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	goog.exportSymbol('proto.mediapipe.LabelMapItem', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.LabelMapItem = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, proto.mediapipe.LabelMapItem.repeatedFields_, null);
	};
	goog.inherits(proto.mediapipe.LabelMapItem, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.LabelMapItem.displayName = 'proto.mediapipe.LabelMapItem';
	}

	/**
	 * List of repeated fields within this message type.
	 * @private {!Array<number>}
	 * @const
	 */
	proto.mediapipe.LabelMapItem.repeatedFields_ = [3];



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.LabelMapItem.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.LabelMapItem.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.LabelMapItem} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.LabelMapItem.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    name: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
	    displayName: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f,
	    childNameList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.LabelMapItem}
	 */
	proto.mediapipe.LabelMapItem.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.LabelMapItem;
	  return proto.mediapipe.LabelMapItem.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.LabelMapItem} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.LabelMapItem}
	 */
	proto.mediapipe.LabelMapItem.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setName(value);
	      break;
	    case 2:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setDisplayName(value);
	      break;
	    case 3:
	      var value = /** @type {string} */ (reader.readString());
	      msg.addChildName(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.LabelMapItem.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.LabelMapItem.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.LabelMapItem} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.LabelMapItem.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {string} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeString(
	      1,
	      f
	    );
	  }
	  f = /** @type {string} */ (jspb.Message.getField(message, 2));
	  if (f != null) {
	    writer.writeString(
	      2,
	      f
	    );
	  }
	  f = message.getChildNameList();
	  if (f.length > 0) {
	    writer.writeRepeatedString(
	      3,
	      f
	    );
	  }
	};


	/**
	 * optional string name = 1;
	 * @return {string}
	 */
	proto.mediapipe.LabelMapItem.prototype.getName = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.LabelMapItem} returns this
	 */
	proto.mediapipe.LabelMapItem.prototype.setName = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.LabelMapItem} returns this
	 */
	proto.mediapipe.LabelMapItem.prototype.clearName = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.LabelMapItem.prototype.hasName = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * optional string display_name = 2;
	 * @return {string}
	 */
	proto.mediapipe.LabelMapItem.prototype.getDisplayName = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.LabelMapItem} returns this
	 */
	proto.mediapipe.LabelMapItem.prototype.setDisplayName = function(value) {
	  return jspb.Message.setField(this, 2, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.LabelMapItem} returns this
	 */
	proto.mediapipe.LabelMapItem.prototype.clearDisplayName = function() {
	  return jspb.Message.setField(this, 2, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.LabelMapItem.prototype.hasDisplayName = function() {
	  return jspb.Message.getField(this, 2) != null;
	};


	/**
	 * repeated string child_name = 3;
	 * @return {!Array<string>}
	 */
	proto.mediapipe.LabelMapItem.prototype.getChildNameList = function() {
	  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 3));
	};


	/**
	 * @param {!Array<string>} value
	 * @return {!proto.mediapipe.LabelMapItem} returns this
	 */
	proto.mediapipe.LabelMapItem.prototype.setChildNameList = function(value) {
	  return jspb.Message.setField(this, 3, value || []);
	};


	/**
	 * @param {string} value
	 * @param {number=} opt_index
	 * @return {!proto.mediapipe.LabelMapItem} returns this
	 */
	proto.mediapipe.LabelMapItem.prototype.addChildName = function(value, opt_index) {
	  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
	};


	/**
	 * Clears the list making it empty but non-null.
	 * @return {!proto.mediapipe.LabelMapItem} returns this
	 */
	proto.mediapipe.LabelMapItem.prototype.clearChildNameList = function() {
	  return this.setChildNameList([]);
	};


	goog.object.extend(exports, proto.mediapipe);
} (label_map_pb));

(function (exports) {
	// source: mediapipe/tasks/cc/vision/image_segmenter/calculators/tensors_to_segmentation_calculator.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	var mediapipe_framework_calculator_options_pb = calculator_options_pb;
	goog.object.extend(proto, mediapipe_framework_calculator_options_pb);
	var mediapipe_tasks_cc_vision_image_segmenter_proto_segmenter_options_pb = segmenter_options_pb;
	goog.object.extend(proto, mediapipe_tasks_cc_vision_image_segmenter_proto_segmenter_options_pb);
	var mediapipe_util_label_map_pb = label_map_pb;
	goog.object.extend(proto, mediapipe_util_label_map_pb);
	goog.exportSymbol('proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.displayName = 'proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions';
	}



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    segmenterOptions: (f = msg.getSegmenterOptions()) && mediapipe_tasks_cc_vision_image_segmenter_proto_segmenter_options_pb.SegmenterOptions.toObject(includeInstance, f),
	    labelItemsMap: (f = msg.getLabelItemsMap()) ? f.toObject(includeInstance, proto.mediapipe.LabelMapItem.toObject) : []
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions}
	 */
	proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions;
	  return proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions}
	 */
	proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = new mediapipe_tasks_cc_vision_image_segmenter_proto_segmenter_options_pb.SegmenterOptions;
	      reader.readMessage(value,mediapipe_tasks_cc_vision_image_segmenter_proto_segmenter_options_pb.SegmenterOptions.deserializeBinaryFromReader);
	      msg.setSegmenterOptions(value);
	      break;
	    case 2:
	      var value = msg.getLabelItemsMap();
	      reader.readMessage(value, function(message, reader) {
	        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readInt64, jspb.BinaryReader.prototype.readMessage, proto.mediapipe.LabelMapItem.deserializeBinaryFromReader, 0, new proto.mediapipe.LabelMapItem());
	         });
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = message.getSegmenterOptions();
	  if (f != null) {
	    writer.writeMessage(
	      1,
	      f,
	      mediapipe_tasks_cc_vision_image_segmenter_proto_segmenter_options_pb.SegmenterOptions.serializeBinaryToWriter
	    );
	  }
	  f = message.getLabelItemsMap(true);
	  if (f && f.getLength() > 0) {
	    f.serializeBinary(2, writer, jspb.BinaryWriter.prototype.writeInt64, jspb.BinaryWriter.prototype.writeMessage, proto.mediapipe.LabelMapItem.serializeBinaryToWriter);
	  }
	};



	/**
	 * A tuple of {field number, class constructor} for the extension
	 * field named `ext`.
	 * @type {!jspb.ExtensionFieldInfo<!proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions>}
	 */
	proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.ext = new jspb.ExtensionFieldInfo(
	    458105876,
	    {ext: 0},
	    proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions,
	     /** @type {?function((boolean|undefined),!jspb.Message=): !Object} */ (
	         proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.toObject),
	    0);

	mediapipe_framework_calculator_options_pb.CalculatorOptions.extensionsBinary[458105876] = new jspb.ExtensionFieldBinaryInfo(
	    proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.ext,
	    jspb.BinaryReader.prototype.readMessage,
	    jspb.BinaryWriter.prototype.writeMessage,
	    proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.serializeBinaryToWriter,
	    proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.deserializeBinaryFromReader,
	    false);
	// This registers the extension field with the extended class, so that
	// toObject() will function correctly.
	mediapipe_framework_calculator_options_pb.CalculatorOptions.extensions[458105876] = proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.ext;

	/**
	 * optional vision.image_segmenter.proto.SegmenterOptions segmenter_options = 1;
	 * @return {?proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions}
	 */
	proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.prototype.getSegmenterOptions = function() {
	  return /** @type{?proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions} */ (
	    jspb.Message.getWrapperField(this, mediapipe_tasks_cc_vision_image_segmenter_proto_segmenter_options_pb.SegmenterOptions, 1));
	};


	/**
	 * @param {?proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions|undefined} value
	 * @return {!proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions} returns this
	*/
	proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.prototype.setSegmenterOptions = function(value) {
	  return jspb.Message.setWrapperField(this, 1, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions} returns this
	 */
	proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.prototype.clearSegmenterOptions = function() {
	  return this.setSegmenterOptions(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.prototype.hasSegmenterOptions = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * map<int64, mediapipe.LabelMapItem> label_items = 2;
	 * @param {boolean=} opt_noLazyCreate Do not create the map if
	 * empty, instead returning `undefined`
	 * @return {!jspb.Map<number,!proto.mediapipe.LabelMapItem>}
	 */
	proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.prototype.getLabelItemsMap = function(opt_noLazyCreate) {
	  return /** @type {!jspb.Map<number,!proto.mediapipe.LabelMapItem>} */ (
	      jspb.Message.getMapField(this, 2, opt_noLazyCreate,
	      proto.mediapipe.LabelMapItem));
	};


	/**
	 * Clears values from the map. The map will be non-null.
	 * @return {!proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions} returns this
	 */
	proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.prototype.clearLabelItemsMap = function() {
	  this.getLabelItemsMap().clear();
	  return this;
	};



	/**
	 * A tuple of {field number, class constructor} for the extension
	 * field named `ext`.
	 * @type {!jspb.ExtensionFieldInfo<!proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions>}
	 */
	proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.ext = new jspb.ExtensionFieldInfo(
	    458105876,
	    {ext: 0},
	    proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions,
	     /** @type {?function((boolean|undefined),!jspb.Message=): !Object} */ (
	         proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.toObject),
	    0);

	mediapipe_framework_calculator_options_pb.CalculatorOptions.extensionsBinary[458105876] = new jspb.ExtensionFieldBinaryInfo(
	    proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.ext,
	    jspb.BinaryReader.prototype.readMessage,
	    jspb.BinaryWriter.prototype.writeMessage,
	    proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.serializeBinaryToWriter,
	    proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.deserializeBinaryFromReader,
	    false);
	// This registers the extension field with the extended class, so that
	// toObject() will function correctly.
	mediapipe_framework_calculator_options_pb.CalculatorOptions.extensions[458105876] = proto.mediapipe.tasks.TensorsToSegmentationCalculatorOptions.ext;

	goog.object.extend(exports, proto.mediapipe.tasks);
} (tensors_to_segmentation_calculator_pb));

var image_segmenter_graph_options_pb = {};

(function (exports) {
	// source: mediapipe/tasks/cc/vision/image_segmenter/proto/image_segmenter_graph_options.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	var mediapipe_framework_calculator_pb = calculator_pb;
	goog.object.extend(proto, mediapipe_framework_calculator_pb);
	var mediapipe_framework_calculator_options_pb = calculator_options_pb;
	goog.object.extend(proto, mediapipe_framework_calculator_options_pb);
	var mediapipe_tasks_cc_core_proto_base_options_pb = base_options_pb;
	goog.object.extend(proto, mediapipe_tasks_cc_core_proto_base_options_pb);
	var mediapipe_tasks_cc_vision_image_segmenter_proto_segmenter_options_pb = segmenter_options_pb;
	goog.object.extend(proto, mediapipe_tasks_cc_vision_image_segmenter_proto_segmenter_options_pb);
	goog.exportSymbol('proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.displayName = 'proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions';
	}



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    baseOptions: (f = msg.getBaseOptions()) && mediapipe_tasks_cc_core_proto_base_options_pb.BaseOptions.toObject(includeInstance, f),
	    displayNamesLocale: jspb.Message.getFieldWithDefault(msg, 2, "en"),
	    segmenterOptions: (f = msg.getSegmenterOptions()) && mediapipe_tasks_cc_vision_image_segmenter_proto_segmenter_options_pb.SegmenterOptions.toObject(includeInstance, f)
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions;
	  return proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = new mediapipe_tasks_cc_core_proto_base_options_pb.BaseOptions;
	      reader.readMessage(value,mediapipe_tasks_cc_core_proto_base_options_pb.BaseOptions.deserializeBinaryFromReader);
	      msg.setBaseOptions(value);
	      break;
	    case 2:
	      var value = /** @type {string} */ (reader.readString());
	      msg.setDisplayNamesLocale(value);
	      break;
	    case 3:
	      var value = new mediapipe_tasks_cc_vision_image_segmenter_proto_segmenter_options_pb.SegmenterOptions;
	      reader.readMessage(value,mediapipe_tasks_cc_vision_image_segmenter_proto_segmenter_options_pb.SegmenterOptions.deserializeBinaryFromReader);
	      msg.setSegmenterOptions(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = message.getBaseOptions();
	  if (f != null) {
	    writer.writeMessage(
	      1,
	      f,
	      mediapipe_tasks_cc_core_proto_base_options_pb.BaseOptions.serializeBinaryToWriter
	    );
	  }
	  f = /** @type {string} */ (jspb.Message.getField(message, 2));
	  if (f != null) {
	    writer.writeString(
	      2,
	      f
	    );
	  }
	  f = message.getSegmenterOptions();
	  if (f != null) {
	    writer.writeMessage(
	      3,
	      f,
	      mediapipe_tasks_cc_vision_image_segmenter_proto_segmenter_options_pb.SegmenterOptions.serializeBinaryToWriter
	    );
	  }
	};



	/**
	 * A tuple of {field number, class constructor} for the extension
	 * field named `ext`.
	 * @type {!jspb.ExtensionFieldInfo<!proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions>}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.ext = new jspb.ExtensionFieldInfo(
	    458105758,
	    {ext: 0},
	    proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions,
	     /** @type {?function((boolean|undefined),!jspb.Message=): !Object} */ (
	         proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.toObject),
	    0);

	mediapipe_framework_calculator_options_pb.CalculatorOptions.extensionsBinary[458105758] = new jspb.ExtensionFieldBinaryInfo(
	    proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.ext,
	    jspb.BinaryReader.prototype.readMessage,
	    jspb.BinaryWriter.prototype.writeMessage,
	    proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.serializeBinaryToWriter,
	    proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.deserializeBinaryFromReader,
	    false);
	// This registers the extension field with the extended class, so that
	// toObject() will function correctly.
	mediapipe_framework_calculator_options_pb.CalculatorOptions.extensions[458105758] = proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.ext;

	/**
	 * optional mediapipe.tasks.core.proto.BaseOptions base_options = 1;
	 * @return {?proto.mediapipe.tasks.core.proto.BaseOptions}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.prototype.getBaseOptions = function() {
	  return /** @type{?proto.mediapipe.tasks.core.proto.BaseOptions} */ (
	    jspb.Message.getWrapperField(this, mediapipe_tasks_cc_core_proto_base_options_pb.BaseOptions, 1));
	};


	/**
	 * @param {?proto.mediapipe.tasks.core.proto.BaseOptions|undefined} value
	 * @return {!proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions} returns this
	*/
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.prototype.setBaseOptions = function(value) {
	  return jspb.Message.setWrapperField(this, 1, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions} returns this
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.prototype.clearBaseOptions = function() {
	  return this.setBaseOptions(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.prototype.hasBaseOptions = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * optional string display_names_locale = 2;
	 * @return {string}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.prototype.getDisplayNamesLocale = function() {
	  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, "en"));
	};


	/**
	 * @param {string} value
	 * @return {!proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions} returns this
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.prototype.setDisplayNamesLocale = function(value) {
	  return jspb.Message.setField(this, 2, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions} returns this
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.prototype.clearDisplayNamesLocale = function() {
	  return jspb.Message.setField(this, 2, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.prototype.hasDisplayNamesLocale = function() {
	  return jspb.Message.getField(this, 2) != null;
	};


	/**
	 * optional SegmenterOptions segmenter_options = 3;
	 * @return {?proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.prototype.getSegmenterOptions = function() {
	  return /** @type{?proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions} */ (
	    jspb.Message.getWrapperField(this, mediapipe_tasks_cc_vision_image_segmenter_proto_segmenter_options_pb.SegmenterOptions, 3));
	};


	/**
	 * @param {?proto.mediapipe.tasks.vision.image_segmenter.proto.SegmenterOptions|undefined} value
	 * @return {!proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions} returns this
	*/
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.prototype.setSegmenterOptions = function(value) {
	  return jspb.Message.setWrapperField(this, 3, value);
	};


	/**
	 * Clears the message field making it undefined.
	 * @return {!proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions} returns this
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.prototype.clearSegmenterOptions = function() {
	  return this.setSegmenterOptions(undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.prototype.hasSegmenterOptions = function() {
	  return jspb.Message.getField(this, 3) != null;
	};



	/**
	 * A tuple of {field number, class constructor} for the extension
	 * field named `ext`.
	 * @type {!jspb.ExtensionFieldInfo<!proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions>}
	 */
	proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.ext = new jspb.ExtensionFieldInfo(
	    458105758,
	    {ext: 0},
	    proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions,
	     /** @type {?function((boolean|undefined),!jspb.Message=): !Object} */ (
	         proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.toObject),
	    0);

	mediapipe_framework_calculator_options_pb.CalculatorOptions.extensionsBinary[458105758] = new jspb.ExtensionFieldBinaryInfo(
	    proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.ext,
	    jspb.BinaryReader.prototype.readMessage,
	    jspb.BinaryWriter.prototype.writeMessage,
	    proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.serializeBinaryToWriter,
	    proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.deserializeBinaryFromReader,
	    false);
	// This registers the extension field with the extended class, so that
	// toObject() will function correctly.
	mediapipe_framework_calculator_options_pb.CalculatorOptions.extensions[458105758] = proto.mediapipe.tasks.vision.image_segmenter.proto.ImageSegmenterGraphOptions.ext;

	goog.object.extend(exports, proto.mediapipe.tasks.vision.image_segmenter.proto);
} (image_segmenter_graph_options_pb));

var vision_task_runner = {};

var rect_pb = {};

(function (exports) {
	// source: mediapipe/framework/formats/rect.proto
	/**
	 * @fileoverview
	 * @enhanceable
	 * @suppress {missingRequire} reports error on implicit type usages.
	 * @suppress {messageConventions} JS Compiler reports an error if a variable or
	 *     field starts with 'MSG_' and isn't a translatable message.
	 * @public
	 */
	// GENERATED CODE -- DO NOT EDIT!
	/* eslint-disable */
	// @ts-nocheck

	var jspb = googleProtobuf;
	var goog = jspb;
	var global =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof window !== 'undefined' && window) ||
	    (typeof global !== 'undefined' && global) ||
	    (typeof self !== 'undefined' && self) ||
	    (function () { return this; }).call(null) ||
	    Function('return this')();

	goog.exportSymbol('proto.mediapipe.NormalizedRect', null, global);
	goog.exportSymbol('proto.mediapipe.Rect', null, global);
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.Rect = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.Rect, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.Rect.displayName = 'proto.mediapipe.Rect';
	}
	/**
	 * Generated by JsPbCodeGenerator.
	 * @param {Array=} opt_data Optional initial data array, typically from a
	 * server response, or constructed directly in Javascript. The array is used
	 * in place and becomes part of the constructed object. It is not cloned.
	 * If no data is provided, the constructed object will be empty, but still
	 * valid.
	 * @extends {jspb.Message}
	 * @constructor
	 */
	proto.mediapipe.NormalizedRect = function(opt_data) {
	  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
	};
	goog.inherits(proto.mediapipe.NormalizedRect, jspb.Message);
	if (goog.DEBUG && !COMPILED) {
	  /**
	   * @public
	   * @override
	   */
	  proto.mediapipe.NormalizedRect.displayName = 'proto.mediapipe.NormalizedRect';
	}



	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.Rect.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.Rect.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.Rect} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.Rect.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    xCenter: (f = jspb.Message.getField(msg, 1)) == null ? undefined : f,
	    yCenter: (f = jspb.Message.getField(msg, 2)) == null ? undefined : f,
	    height: (f = jspb.Message.getField(msg, 3)) == null ? undefined : f,
	    width: (f = jspb.Message.getField(msg, 4)) == null ? undefined : f,
	    rotation: jspb.Message.getFloatingPointFieldWithDefault(msg, 5, 0.0),
	    rectId: (f = jspb.Message.getField(msg, 6)) == null ? undefined : f
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.Rect}
	 */
	proto.mediapipe.Rect.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.Rect;
	  return proto.mediapipe.Rect.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.Rect} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.Rect}
	 */
	proto.mediapipe.Rect.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {number} */ (reader.readInt32());
	      msg.setXCenter(value);
	      break;
	    case 2:
	      var value = /** @type {number} */ (reader.readInt32());
	      msg.setYCenter(value);
	      break;
	    case 3:
	      var value = /** @type {number} */ (reader.readInt32());
	      msg.setHeight(value);
	      break;
	    case 4:
	      var value = /** @type {number} */ (reader.readInt32());
	      msg.setWidth(value);
	      break;
	    case 5:
	      var value = /** @type {number} */ (reader.readFloat());
	      msg.setRotation(value);
	      break;
	    case 6:
	      var value = /** @type {number} */ (reader.readInt64());
	      msg.setRectId(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.Rect.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.Rect.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.Rect} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.Rect.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {number} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeInt32(
	      1,
	      f
	    );
	  }
	  f = /** @type {number} */ (jspb.Message.getField(message, 2));
	  if (f != null) {
	    writer.writeInt32(
	      2,
	      f
	    );
	  }
	  f = /** @type {number} */ (jspb.Message.getField(message, 3));
	  if (f != null) {
	    writer.writeInt32(
	      3,
	      f
	    );
	  }
	  f = /** @type {number} */ (jspb.Message.getField(message, 4));
	  if (f != null) {
	    writer.writeInt32(
	      4,
	      f
	    );
	  }
	  f = /** @type {number} */ (jspb.Message.getField(message, 5));
	  if (f != null) {
	    writer.writeFloat(
	      5,
	      f
	    );
	  }
	  f = /** @type {number} */ (jspb.Message.getField(message, 6));
	  if (f != null) {
	    writer.writeInt64(
	      6,
	      f
	    );
	  }
	};


	/**
	 * required int32 x_center = 1;
	 * @return {number}
	 */
	proto.mediapipe.Rect.prototype.getXCenter = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.Rect} returns this
	 */
	proto.mediapipe.Rect.prototype.setXCenter = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.Rect} returns this
	 */
	proto.mediapipe.Rect.prototype.clearXCenter = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.Rect.prototype.hasXCenter = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * required int32 y_center = 2;
	 * @return {number}
	 */
	proto.mediapipe.Rect.prototype.getYCenter = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.Rect} returns this
	 */
	proto.mediapipe.Rect.prototype.setYCenter = function(value) {
	  return jspb.Message.setField(this, 2, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.Rect} returns this
	 */
	proto.mediapipe.Rect.prototype.clearYCenter = function() {
	  return jspb.Message.setField(this, 2, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.Rect.prototype.hasYCenter = function() {
	  return jspb.Message.getField(this, 2) != null;
	};


	/**
	 * required int32 height = 3;
	 * @return {number}
	 */
	proto.mediapipe.Rect.prototype.getHeight = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.Rect} returns this
	 */
	proto.mediapipe.Rect.prototype.setHeight = function(value) {
	  return jspb.Message.setField(this, 3, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.Rect} returns this
	 */
	proto.mediapipe.Rect.prototype.clearHeight = function() {
	  return jspb.Message.setField(this, 3, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.Rect.prototype.hasHeight = function() {
	  return jspb.Message.getField(this, 3) != null;
	};


	/**
	 * required int32 width = 4;
	 * @return {number}
	 */
	proto.mediapipe.Rect.prototype.getWidth = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.Rect} returns this
	 */
	proto.mediapipe.Rect.prototype.setWidth = function(value) {
	  return jspb.Message.setField(this, 4, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.Rect} returns this
	 */
	proto.mediapipe.Rect.prototype.clearWidth = function() {
	  return jspb.Message.setField(this, 4, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.Rect.prototype.hasWidth = function() {
	  return jspb.Message.getField(this, 4) != null;
	};


	/**
	 * optional float rotation = 5;
	 * @return {number}
	 */
	proto.mediapipe.Rect.prototype.getRotation = function() {
	  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 5, 0.0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.Rect} returns this
	 */
	proto.mediapipe.Rect.prototype.setRotation = function(value) {
	  return jspb.Message.setField(this, 5, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.Rect} returns this
	 */
	proto.mediapipe.Rect.prototype.clearRotation = function() {
	  return jspb.Message.setField(this, 5, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.Rect.prototype.hasRotation = function() {
	  return jspb.Message.getField(this, 5) != null;
	};


	/**
	 * optional int64 rect_id = 6;
	 * @return {number}
	 */
	proto.mediapipe.Rect.prototype.getRectId = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.Rect} returns this
	 */
	proto.mediapipe.Rect.prototype.setRectId = function(value) {
	  return jspb.Message.setField(this, 6, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.Rect} returns this
	 */
	proto.mediapipe.Rect.prototype.clearRectId = function() {
	  return jspb.Message.setField(this, 6, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.Rect.prototype.hasRectId = function() {
	  return jspb.Message.getField(this, 6) != null;
	};





	if (jspb.Message.GENERATE_TO_OBJECT) {
	/**
	 * Creates an object representation of this proto.
	 * Field names that are reserved in JavaScript and will be renamed to pb_name.
	 * Optional fields that are not set will be set to undefined.
	 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
	 * For the list of reserved names please see:
	 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
	 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
	 *     JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @return {!Object}
	 */
	proto.mediapipe.NormalizedRect.prototype.toObject = function(opt_includeInstance) {
	  return proto.mediapipe.NormalizedRect.toObject(opt_includeInstance, this);
	};


	/**
	 * Static version of the {@see toObject} method.
	 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
	 *     the JSPB instance for transitional soy proto support:
	 *     http://goto/soy-param-migration
	 * @param {!proto.mediapipe.NormalizedRect} msg The msg instance to transform.
	 * @return {!Object}
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.NormalizedRect.toObject = function(includeInstance, msg) {
	  var f, obj = {
	    xCenter: (f = jspb.Message.getOptionalFloatingPointField(msg, 1)) == null ? undefined : f,
	    yCenter: (f = jspb.Message.getOptionalFloatingPointField(msg, 2)) == null ? undefined : f,
	    height: (f = jspb.Message.getOptionalFloatingPointField(msg, 3)) == null ? undefined : f,
	    width: (f = jspb.Message.getOptionalFloatingPointField(msg, 4)) == null ? undefined : f,
	    rotation: jspb.Message.getFloatingPointFieldWithDefault(msg, 5, 0.0),
	    rectId: (f = jspb.Message.getField(msg, 6)) == null ? undefined : f
	  };

	  if (includeInstance) {
	    obj.$jspbMessageInstance = msg;
	  }
	  return obj;
	};
	}


	/**
	 * Deserializes binary data (in protobuf wire format).
	 * @param {jspb.ByteSource} bytes The bytes to deserialize.
	 * @return {!proto.mediapipe.NormalizedRect}
	 */
	proto.mediapipe.NormalizedRect.deserializeBinary = function(bytes) {
	  var reader = new jspb.BinaryReader(bytes);
	  var msg = new proto.mediapipe.NormalizedRect;
	  return proto.mediapipe.NormalizedRect.deserializeBinaryFromReader(msg, reader);
	};


	/**
	 * Deserializes binary data (in protobuf wire format) from the
	 * given reader into the given message object.
	 * @param {!proto.mediapipe.NormalizedRect} msg The message object to deserialize into.
	 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
	 * @return {!proto.mediapipe.NormalizedRect}
	 */
	proto.mediapipe.NormalizedRect.deserializeBinaryFromReader = function(msg, reader) {
	  while (reader.nextField()) {
	    if (reader.isEndGroup()) {
	      break;
	    }
	    var field = reader.getFieldNumber();
	    switch (field) {
	    case 1:
	      var value = /** @type {number} */ (reader.readFloat());
	      msg.setXCenter(value);
	      break;
	    case 2:
	      var value = /** @type {number} */ (reader.readFloat());
	      msg.setYCenter(value);
	      break;
	    case 3:
	      var value = /** @type {number} */ (reader.readFloat());
	      msg.setHeight(value);
	      break;
	    case 4:
	      var value = /** @type {number} */ (reader.readFloat());
	      msg.setWidth(value);
	      break;
	    case 5:
	      var value = /** @type {number} */ (reader.readFloat());
	      msg.setRotation(value);
	      break;
	    case 6:
	      var value = /** @type {number} */ (reader.readInt64());
	      msg.setRectId(value);
	      break;
	    default:
	      reader.skipField();
	      break;
	    }
	  }
	  return msg;
	};


	/**
	 * Serializes the message to binary data (in protobuf wire format).
	 * @return {!Uint8Array}
	 */
	proto.mediapipe.NormalizedRect.prototype.serializeBinary = function() {
	  var writer = new jspb.BinaryWriter();
	  proto.mediapipe.NormalizedRect.serializeBinaryToWriter(this, writer);
	  return writer.getResultBuffer();
	};


	/**
	 * Serializes the given message to binary data (in protobuf wire
	 * format), writing to the given BinaryWriter.
	 * @param {!proto.mediapipe.NormalizedRect} message
	 * @param {!jspb.BinaryWriter} writer
	 * @suppress {unusedLocalVariables} f is only used for nested messages
	 */
	proto.mediapipe.NormalizedRect.serializeBinaryToWriter = function(message, writer) {
	  var f = undefined;
	  f = /** @type {number} */ (jspb.Message.getField(message, 1));
	  if (f != null) {
	    writer.writeFloat(
	      1,
	      f
	    );
	  }
	  f = /** @type {number} */ (jspb.Message.getField(message, 2));
	  if (f != null) {
	    writer.writeFloat(
	      2,
	      f
	    );
	  }
	  f = /** @type {number} */ (jspb.Message.getField(message, 3));
	  if (f != null) {
	    writer.writeFloat(
	      3,
	      f
	    );
	  }
	  f = /** @type {number} */ (jspb.Message.getField(message, 4));
	  if (f != null) {
	    writer.writeFloat(
	      4,
	      f
	    );
	  }
	  f = /** @type {number} */ (jspb.Message.getField(message, 5));
	  if (f != null) {
	    writer.writeFloat(
	      5,
	      f
	    );
	  }
	  f = /** @type {number} */ (jspb.Message.getField(message, 6));
	  if (f != null) {
	    writer.writeInt64(
	      6,
	      f
	    );
	  }
	};


	/**
	 * required float x_center = 1;
	 * @return {number}
	 */
	proto.mediapipe.NormalizedRect.prototype.getXCenter = function() {
	  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 1, 0.0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.NormalizedRect} returns this
	 */
	proto.mediapipe.NormalizedRect.prototype.setXCenter = function(value) {
	  return jspb.Message.setField(this, 1, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.NormalizedRect} returns this
	 */
	proto.mediapipe.NormalizedRect.prototype.clearXCenter = function() {
	  return jspb.Message.setField(this, 1, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.NormalizedRect.prototype.hasXCenter = function() {
	  return jspb.Message.getField(this, 1) != null;
	};


	/**
	 * required float y_center = 2;
	 * @return {number}
	 */
	proto.mediapipe.NormalizedRect.prototype.getYCenter = function() {
	  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 2, 0.0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.NormalizedRect} returns this
	 */
	proto.mediapipe.NormalizedRect.prototype.setYCenter = function(value) {
	  return jspb.Message.setField(this, 2, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.NormalizedRect} returns this
	 */
	proto.mediapipe.NormalizedRect.prototype.clearYCenter = function() {
	  return jspb.Message.setField(this, 2, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.NormalizedRect.prototype.hasYCenter = function() {
	  return jspb.Message.getField(this, 2) != null;
	};


	/**
	 * required float height = 3;
	 * @return {number}
	 */
	proto.mediapipe.NormalizedRect.prototype.getHeight = function() {
	  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 3, 0.0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.NormalizedRect} returns this
	 */
	proto.mediapipe.NormalizedRect.prototype.setHeight = function(value) {
	  return jspb.Message.setField(this, 3, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.NormalizedRect} returns this
	 */
	proto.mediapipe.NormalizedRect.prototype.clearHeight = function() {
	  return jspb.Message.setField(this, 3, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.NormalizedRect.prototype.hasHeight = function() {
	  return jspb.Message.getField(this, 3) != null;
	};


	/**
	 * required float width = 4;
	 * @return {number}
	 */
	proto.mediapipe.NormalizedRect.prototype.getWidth = function() {
	  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 4, 0.0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.NormalizedRect} returns this
	 */
	proto.mediapipe.NormalizedRect.prototype.setWidth = function(value) {
	  return jspb.Message.setField(this, 4, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.NormalizedRect} returns this
	 */
	proto.mediapipe.NormalizedRect.prototype.clearWidth = function() {
	  return jspb.Message.setField(this, 4, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.NormalizedRect.prototype.hasWidth = function() {
	  return jspb.Message.getField(this, 4) != null;
	};


	/**
	 * optional float rotation = 5;
	 * @return {number}
	 */
	proto.mediapipe.NormalizedRect.prototype.getRotation = function() {
	  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 5, 0.0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.NormalizedRect} returns this
	 */
	proto.mediapipe.NormalizedRect.prototype.setRotation = function(value) {
	  return jspb.Message.setField(this, 5, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.NormalizedRect} returns this
	 */
	proto.mediapipe.NormalizedRect.prototype.clearRotation = function() {
	  return jspb.Message.setField(this, 5, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.NormalizedRect.prototype.hasRotation = function() {
	  return jspb.Message.getField(this, 5) != null;
	};


	/**
	 * optional int64 rect_id = 6;
	 * @return {number}
	 */
	proto.mediapipe.NormalizedRect.prototype.getRectId = function() {
	  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
	};


	/**
	 * @param {number} value
	 * @return {!proto.mediapipe.NormalizedRect} returns this
	 */
	proto.mediapipe.NormalizedRect.prototype.setRectId = function(value) {
	  return jspb.Message.setField(this, 6, value);
	};


	/**
	 * Clears the field making it undefined.
	 * @return {!proto.mediapipe.NormalizedRect} returns this
	 */
	proto.mediapipe.NormalizedRect.prototype.clearRectId = function() {
	  return jspb.Message.setField(this, 6, undefined);
	};


	/**
	 * Returns whether this field is set.
	 * @return {boolean}
	 */
	proto.mediapipe.NormalizedRect.prototype.hasRectId = function() {
	  return jspb.Message.getField(this, 6) != null;
	};


	goog.object.extend(exports, proto.mediapipe);
} (rect_pb));

var task_runner = {};

var graph_runner = {};

var run_script_helper = {};

// Placeholder for internal dependency on jsloader
// Placeholder for internal dependency on trusted resource url
Object.defineProperty(run_script_helper, "__esModule", { value: true });
run_script_helper.runScript = void 0;
// Quick helper to run the given script safely
async function runScript(scriptUrl) {
    if (typeof importScripts === 'function') {
        importScripts(scriptUrl.toString());
    }
    else {
        const script = document.createElement('script');
        script.src = scriptUrl.toString();
        script.crossOrigin = 'anonymous';
        return new Promise((resolve, revoke) => {
            script.addEventListener('load', () => {
                resolve();
            }, false);
            script.addEventListener('error', e => {
                revoke(e);
            }, false);
            document.body.appendChild(script);
        });
    }
}
run_script_helper.runScript = runScript;

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createGraphRunner = exports.createMediaPipeLib = exports.GraphRunner = exports.getImageSourceSize = exports.CALCULATOR_GRAPH_CONFIG_LISTENER_NAME = void 0;
	// Placeholder for internal dependency on assertTruthy
	const platform_utils_1 = platform_utils;
	const run_script_helper_1 = run_script_helper;
	/**
	 * The name of the internal listener that we use to obtain the calculator graph
	 * config. Intended for internal usage. Exported for testing only.
	 */
	exports.CALCULATOR_GRAPH_CONFIG_LISTENER_NAME = '__graph_config__';
	/**
	 * Detects image source size.
	 */
	function getImageSourceSize(imageSource) {
	    if (imageSource.videoWidth !== undefined) {
	        const videoElement = imageSource;
	        return [videoElement.videoWidth, videoElement.videoHeight];
	    }
	    else if (imageSource.naturalWidth !== undefined) {
	        // TODO: Ensure this works with SVG images
	        const imageElement = imageSource;
	        return [imageElement.naturalWidth, imageElement.naturalHeight];
	    }
	    else if (imageSource.displayWidth !== undefined) {
	        const videoFrame = imageSource;
	        return [videoFrame.displayWidth, videoFrame.displayHeight];
	    }
	    else {
	        const notVideoFrame = imageSource;
	        return [notVideoFrame.width, notVideoFrame.height];
	    }
	}
	exports.getImageSourceSize = getImageSourceSize;
	/**
	 * Simple class to run an arbitrary image-in/image-out MediaPipe graph (i.e.
	 * as created by wasm_mediapipe_demo BUILD macro), and either render results
	 * into canvas, or else return the output WebGLTexture. Takes a WebAssembly
	 * Module.
	 */
	class GraphRunner {
	    /**
	     * Creates a new MediaPipe WASM module. Must be called *after* wasm Module has
	     * initialized. Note that we take control of the GL canvas from here on out,
	     * and will resize it to fit input.
	     *
	     * @param module The underlying Wasm Module to use.
	     * @param glCanvas The type of the GL canvas to use, or `null` if no GL
	     *    canvas should be initialzed. Initializes an offscreen canvas if not
	     *    provided.
	     */
	    constructor(module, glCanvas) {
	        this.autoResizeCanvas = true;
	        this.wasmModule = module;
	        this.audioPtr = null;
	        this.audioSize = 0;
	        this.hasMultiStreamSupport =
	            (typeof this.wasmModule._addIntToInputStream === 'function');
	        if (glCanvas !== undefined) {
	            this.wasmModule.canvas = glCanvas;
	        }
	        else if ((0, platform_utils_1.supportsOffscreenCanvas)()) {
	            // If no canvas is provided, assume Chrome/Firefox and just make an
	            // OffscreenCanvas for GPU processing. Note that we exclude older Safari
	            // versions that not support WebGL for OffscreenCanvas.
	            this.wasmModule.canvas = new OffscreenCanvas(1, 1);
	        }
	        else {
	            console.warn('OffscreenCanvas not supported and GraphRunner constructor ' +
	                'glCanvas parameter is undefined. Creating backup canvas.');
	            this.wasmModule.canvas = document.createElement('canvas');
	        }
	    }
	    /** {@override GraphRunnerApi} */
	    async initializeGraph(graphFile) {
	        // Fetch and set graph
	        const response = await fetch(graphFile);
	        const graphData = await response.arrayBuffer();
	        const isBinary = !(graphFile.endsWith('.pbtxt') || graphFile.endsWith('.textproto'));
	        this.setGraph(new Uint8Array(graphData), isBinary);
	    }
	    /** {@override GraphRunnerApi} */
	    setGraphFromString(graphConfig) {
	        this.setGraph((new TextEncoder()).encode(graphConfig), false);
	    }
	    /** {@override GraphRunnerApi} */
	    setGraph(graphData, isBinary) {
	        const size = graphData.length;
	        const dataPtr = this.wasmModule._malloc(size);
	        this.wasmModule.HEAPU8.set(graphData, dataPtr);
	        if (isBinary) {
	            this.wasmModule._changeBinaryGraph(size, dataPtr);
	        }
	        else {
	            this.wasmModule._changeTextGraph(size, dataPtr);
	        }
	        this.wasmModule._free(dataPtr);
	    }
	    /** {@override GraphRunnerApi} */
	    configureAudio(numChannels, numSamples, sampleRate, streamName, headerName) {
	        if (!this.wasmModule._configureAudio) {
	            console.warn('Attempting to use configureAudio without support for input audio. ' +
	                'Is build dep ":gl_graph_runner_audio" missing?');
	        }
	        streamName = streamName || 'input_audio';
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            headerName = headerName || 'audio_header';
	            this.wrapStringPtr(headerName, (headerNamePtr) => {
	                this.wasmModule._configureAudio(streamNamePtr, headerNamePtr, numChannels, numSamples, sampleRate);
	            });
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    setAutoResizeCanvas(resize) {
	        this.autoResizeCanvas = resize;
	    }
	    /** {@override GraphRunnerApi} */
	    setAutoRenderToScreen(enabled) {
	        this.wasmModule._setAutoRenderToScreen(enabled);
	    }
	    /** {@override GraphRunnerApi} */
	    setGpuBufferVerticalFlip(bottomLeftIsOrigin) {
	        this.wasmModule.gpuOriginForWebTexturesIsBottomLeft = bottomLeftIsOrigin;
	    }
	    /**
	     * Bind texture to our internal canvas, and upload image source to GPU.
	     * Returns tuple [width, height] of texture.  Intended for internal usage.
	     */
	    bindTextureToStream(imageSource, streamNamePtr) {
	        if (!this.wasmModule.canvas) {
	            throw new Error('No OpenGL canvas configured.');
	        }
	        if (!streamNamePtr) {
	            // TODO: Remove this path once completely refactored away.
	            console.assert(this.wasmModule._bindTextureToCanvas());
	        }
	        else {
	            this.wasmModule._bindTextureToStream(streamNamePtr);
	        }
	        const gl = (this.wasmModule.canvas.getContext('webgl2') ||
	            this.wasmModule.canvas.getContext('webgl'));
	        if (!gl) {
	            throw new Error('Failed to obtain WebGL context from the provided canvas. ' +
	                '`getContext()` should only be invoked with `webgl` or `webgl2`.');
	        }
	        if (this.wasmModule.gpuOriginForWebTexturesIsBottomLeft) {
	            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	        }
	        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageSource);
	        if (this.wasmModule.gpuOriginForWebTexturesIsBottomLeft) {
	            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
	        }
	        const [width, height] = getImageSourceSize(imageSource);
	        if (this.autoResizeCanvas &&
	            (width !== this.wasmModule.canvas.width ||
	                height !== this.wasmModule.canvas.height)) {
	            this.wasmModule.canvas.width = width;
	            this.wasmModule.canvas.height = height;
	        }
	        return [width, height];
	    }
	    /**
	     * Takes the raw data from a JS image source, and sends it to C++ to be
	     * processed, waiting synchronously for the response. Note that we will resize
	     * our GL canvas to fit the input, so input size should only change
	     * infrequently. NOTE: This call has been deprecated in favor of
	     * `addGpuBufferToStream`.
	     * @param imageSource An image source to process.
	     * @param timestamp The timestamp of the current frame, in ms.
	     * @return texture? The WebGL texture reference, if one was produced.
	     */
	    processGl(imageSource, timestamp) {
	        // Bind to default input stream
	        const [width, height] = this.bindTextureToStream(imageSource);
	        // 2 ints and a ll (timestamp)
	        const frameDataPtr = this.wasmModule._malloc(16);
	        this.wasmModule.HEAPU32[frameDataPtr / 4] = width;
	        this.wasmModule.HEAPU32[(frameDataPtr / 4) + 1] = height;
	        this.wasmModule.HEAPF64[(frameDataPtr / 8) + 1] = timestamp;
	        // outputPtr points in HEAPF32-space to running mspf calculations, which we
	        // don't use at the moment.
	        // tslint:disable-next-line:no-unused-variable
	        this.wasmModule._processGl(frameDataPtr) / 4;
	        this.wasmModule._free(frameDataPtr);
	        // TODO: Hook up WebGLTexture output, when given.
	        // TODO: Allow user to toggle whether or not to render output into canvas.
	        return undefined;
	    }
	    /**
	     * Converts JavaScript string input parameters into C++ c-string pointers.
	     * See b/204830158 for more details. Intended for internal usage.
	     */
	    wrapStringPtr(stringData, stringPtrFunc) {
	        if (!this.hasMultiStreamSupport) {
	            console.error('No wasm multistream support detected: ensure dependency ' +
	                'inclusion of :gl_graph_runner_internal_multi_input target');
	        }
	        const stringDataPtr = this.wasmModule.stringToNewUTF8(stringData);
	        stringPtrFunc(stringDataPtr);
	        this.wasmModule._free(stringDataPtr);
	    }
	    /**
	     * Converts JavaScript string input parameters into C++ c-string pointers.
	     * See b/204830158 for more details.
	     */
	    wrapStringPtrPtr(stringData, ptrFunc) {
	        if (!this.hasMultiStreamSupport) {
	            console.error('No wasm multistream support detected: ensure dependency ' +
	                'inclusion of :gl_graph_runner_internal_multi_input target');
	        }
	        const uint32Array = new Uint32Array(stringData.length);
	        for (let i = 0; i < stringData.length; i++) {
	            uint32Array[i] = this.wasmModule.stringToNewUTF8(stringData[i]);
	        }
	        const heapSpace = this.wasmModule._malloc(uint32Array.length * 4);
	        this.wasmModule.HEAPU32.set(uint32Array, heapSpace >> 2);
	        ptrFunc(heapSpace);
	        for (const uint32ptr of uint32Array) {
	            this.wasmModule._free(uint32ptr);
	        }
	        this.wasmModule._free(heapSpace);
	    }
	    /**
	     * Invokes the callback with the current calculator configuration (in binary
	     * format).
	     *
	     * Consumers must deserialize the binary representation themselves as this
	     * avoids adding a direct dependency on the Protobuf JSPB target in the graph
	     * library.
	     */
	    getCalculatorGraphConfig(callback, makeDeepCopy) {
	        const listener = exports.CALCULATOR_GRAPH_CONFIG_LISTENER_NAME;
	        // Create a short-lived listener to receive the binary encoded proto
	        this.setListener(listener, (data) => {
	            callback(data);
	        });
	        this.wrapStringPtr(listener, (outputStreamNamePtr) => {
	            this.wasmModule._getGraphConfig(outputStreamNamePtr, makeDeepCopy);
	        });
	        delete this.wasmModule.simpleListeners[listener];
	    }
	    /**
	     * Ensures existence of the simple listeners table and registers the callback.
	     * Intended for internal usage.
	     */
	    setListener(outputStreamName, callbackFcn) {
	        this.wasmModule.simpleListeners = this.wasmModule.simpleListeners || {};
	        this.wasmModule.simpleListeners[outputStreamName] =
	            callbackFcn;
	    }
	    /**
	     * Ensures existence of the vector listeners table and registers the callback.
	     * Intended for internal usage.
	     */
	    setVectorListener(outputStreamName, callbackFcn) {
	        let buffer = [];
	        this.wasmModule.simpleListeners = this.wasmModule.simpleListeners || {};
	        this.wasmModule.simpleListeners[outputStreamName] =
	            (data, done, timestamp) => {
	                if (done) {
	                    callbackFcn(buffer, timestamp);
	                    buffer = [];
	                }
	                else {
	                    buffer.push(data);
	                }
	            };
	    }
	    /** {@override GraphRunnerApi} */
	    attachErrorListener(callbackFcn) {
	        this.wasmModule.errorListener = callbackFcn;
	    }
	    /** {@override GraphRunnerApi} */
	    attachEmptyPacketListener(outputStreamName, callbackFcn) {
	        this.wasmModule.emptyPacketListeners =
	            this.wasmModule.emptyPacketListeners || {};
	        this.wasmModule.emptyPacketListeners[outputStreamName] = callbackFcn;
	    }
	    /** {@override GraphRunnerApi} */
	    addAudioToStream(audioData, streamName, timestamp) {
	        // numChannels and numSamples being 0 will cause defaults to be used,
	        // which will reflect values from last call to configureAudio.
	        this.addAudioToStreamWithShape(audioData, 0, 0, streamName, timestamp);
	    }
	    /** {@override GraphRunnerApi} */
	    addAudioToStreamWithShape(audioData, numChannels, numSamples, streamName, timestamp) {
	        // 4 bytes for each F32
	        const size = audioData.length * 4;
	        if (this.audioSize !== size) {
	            if (this.audioPtr) {
	                this.wasmModule._free(this.audioPtr);
	            }
	            this.audioPtr = this.wasmModule._malloc(size);
	            this.audioSize = size;
	        }
	        this.wasmModule.HEAPF32.set(audioData, this.audioPtr / 4);
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            this.wasmModule._addAudioToInputStream(this.audioPtr, numChannels, numSamples, streamNamePtr, timestamp);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addGpuBufferToStream(imageSource, streamName, timestamp) {
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            const [width, height] = this.bindTextureToStream(imageSource, streamNamePtr);
	            this.wasmModule._addBoundTextureToStream(streamNamePtr, width, height, timestamp);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addBoolToStream(data, streamName, timestamp) {
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            this.wasmModule._addBoolToInputStream(data, streamNamePtr, timestamp);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addDoubleToStream(data, streamName, timestamp) {
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            this.wasmModule._addDoubleToInputStream(data, streamNamePtr, timestamp);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addFloatToStream(data, streamName, timestamp) {
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            // NOTE: _addFloatToStream and _addIntToStream are reserved for JS
	            // Calculators currently; we may want to revisit this naming scheme in the
	            // future.
	            this.wasmModule._addFloatToInputStream(data, streamNamePtr, timestamp);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addIntToStream(data, streamName, timestamp) {
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            this.wasmModule._addIntToInputStream(data, streamNamePtr, timestamp);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addUintToStream(data, streamName, timestamp) {
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            this.wasmModule._addUintToInputStream(data, streamNamePtr, timestamp);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addStringToStream(data, streamName, timestamp) {
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            this.wrapStringPtr(data, (dataPtr) => {
	                this.wasmModule._addStringToInputStream(dataPtr, streamNamePtr, timestamp);
	            });
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addStringRecordToStream(data, streamName, timestamp) {
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            this.wrapStringPtrPtr(Object.keys(data), (keyList) => {
	                this.wrapStringPtrPtr(Object.values(data), (valueList) => {
	                    this.wasmModule._addFlatHashMapToInputStream(keyList, valueList, Object.keys(data).length, streamNamePtr, timestamp);
	                });
	            });
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addProtoToStream(data, protoType, streamName, timestamp) {
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            this.wrapStringPtr(protoType, (protoTypePtr) => {
	                // Deep-copy proto data into Wasm heap
	                const dataPtr = this.wasmModule._malloc(data.length);
	                // TODO: Ensure this is the fastest way to copy this data.
	                this.wasmModule.HEAPU8.set(data, dataPtr);
	                this.wasmModule._addProtoToInputStream(dataPtr, data.length, protoTypePtr, streamNamePtr, timestamp);
	                this.wasmModule._free(dataPtr);
	            });
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addEmptyPacketToStream(streamName, timestamp) {
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            this.wasmModule._addEmptyPacketToInputStream(streamNamePtr, timestamp);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addBoolVectorToStream(data, streamName, timestamp) {
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            const vecPtr = this.wasmModule._allocateBoolVector(data.length);
	            if (!vecPtr) {
	                throw new Error('Unable to allocate new bool vector on heap.');
	            }
	            for (const entry of data) {
	                this.wasmModule._addBoolVectorEntry(vecPtr, entry);
	            }
	            this.wasmModule._addBoolVectorToInputStream(vecPtr, streamNamePtr, timestamp);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addDoubleVectorToStream(data, streamName, timestamp) {
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            const vecPtr = this.wasmModule._allocateDoubleVector(data.length);
	            if (!vecPtr) {
	                throw new Error('Unable to allocate new double vector on heap.');
	            }
	            for (const entry of data) {
	                this.wasmModule._addDoubleVectorEntry(vecPtr, entry);
	            }
	            this.wasmModule._addDoubleVectorToInputStream(vecPtr, streamNamePtr, timestamp);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addFloatVectorToStream(data, streamName, timestamp) {
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            const vecPtr = this.wasmModule._allocateFloatVector(data.length);
	            if (!vecPtr) {
	                throw new Error('Unable to allocate new float vector on heap.');
	            }
	            for (const entry of data) {
	                this.wasmModule._addFloatVectorEntry(vecPtr, entry);
	            }
	            this.wasmModule._addFloatVectorToInputStream(vecPtr, streamNamePtr, timestamp);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addIntVectorToStream(data, streamName, timestamp) {
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            const vecPtr = this.wasmModule._allocateIntVector(data.length);
	            if (!vecPtr) {
	                throw new Error('Unable to allocate new int vector on heap.');
	            }
	            for (const entry of data) {
	                this.wasmModule._addIntVectorEntry(vecPtr, entry);
	            }
	            this.wasmModule._addIntVectorToInputStream(vecPtr, streamNamePtr, timestamp);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addUintVectorToStream(data, streamName, timestamp) {
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            const vecPtr = this.wasmModule._allocateUintVector(data.length);
	            if (!vecPtr) {
	                throw new Error('Unable to allocate new unsigned int vector on heap.');
	            }
	            for (const entry of data) {
	                this.wasmModule._addUintVectorEntry(vecPtr, entry);
	            }
	            this.wasmModule._addUintVectorToInputStream(vecPtr, streamNamePtr, timestamp);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addStringVectorToStream(data, streamName, timestamp) {
	        this.wrapStringPtr(streamName, (streamNamePtr) => {
	            const vecPtr = this.wasmModule._allocateStringVector(data.length);
	            if (!vecPtr) {
	                throw new Error('Unable to allocate new string vector on heap.');
	            }
	            for (const entry of data) {
	                this.wrapStringPtr(entry, (entryStringPtr) => {
	                    this.wasmModule._addStringVectorEntry(vecPtr, entryStringPtr);
	                });
	            }
	            this.wasmModule._addStringVectorToInputStream(vecPtr, streamNamePtr, timestamp);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addBoolToInputSidePacket(data, sidePacketName) {
	        this.wrapStringPtr(sidePacketName, (sidePacketNamePtr) => {
	            this.wasmModule._addBoolToInputSidePacket(data, sidePacketNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addDoubleToInputSidePacket(data, sidePacketName) {
	        this.wrapStringPtr(sidePacketName, (sidePacketNamePtr) => {
	            this.wasmModule._addDoubleToInputSidePacket(data, sidePacketNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addFloatToInputSidePacket(data, sidePacketName) {
	        this.wrapStringPtr(sidePacketName, (sidePacketNamePtr) => {
	            this.wasmModule._addFloatToInputSidePacket(data, sidePacketNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addIntToInputSidePacket(data, sidePacketName) {
	        this.wrapStringPtr(sidePacketName, (sidePacketNamePtr) => {
	            this.wasmModule._addIntToInputSidePacket(data, sidePacketNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addUintToInputSidePacket(data, sidePacketName) {
	        this.wrapStringPtr(sidePacketName, (sidePacketNamePtr) => {
	            this.wasmModule._addUintToInputSidePacket(data, sidePacketNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addStringToInputSidePacket(data, sidePacketName) {
	        this.wrapStringPtr(sidePacketName, (sidePacketNamePtr) => {
	            this.wrapStringPtr(data, (dataPtr) => {
	                this.wasmModule._addStringToInputSidePacket(dataPtr, sidePacketNamePtr);
	            });
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addProtoToInputSidePacket(data, protoType, sidePacketName) {
	        this.wrapStringPtr(sidePacketName, (sidePacketNamePtr) => {
	            this.wrapStringPtr(protoType, (protoTypePtr) => {
	                // Deep-copy proto data into Wasm heap
	                const dataPtr = this.wasmModule._malloc(data.length);
	                // TODO: Ensure this is the fastest way to copy this data.
	                this.wasmModule.HEAPU8.set(data, dataPtr);
	                this.wasmModule._addProtoToInputSidePacket(dataPtr, data.length, protoTypePtr, sidePacketNamePtr);
	                this.wasmModule._free(dataPtr);
	            });
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addBoolVectorToInputSidePacket(data, sidePacketName) {
	        this.wrapStringPtr(sidePacketName, (sidePacketNamePtr) => {
	            const vecPtr = this.wasmModule._allocateBoolVector(data.length);
	            if (!vecPtr) {
	                throw new Error('Unable to allocate new bool vector on heap.');
	            }
	            for (const entry of data) {
	                this.wasmModule._addBoolVectorEntry(vecPtr, entry);
	            }
	            this.wasmModule._addBoolVectorToInputSidePacket(vecPtr, sidePacketNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addDoubleVectorToInputSidePacket(data, sidePacketName) {
	        this.wrapStringPtr(sidePacketName, (sidePacketNamePtr) => {
	            const vecPtr = this.wasmModule._allocateDoubleVector(data.length);
	            if (!vecPtr) {
	                throw new Error('Unable to allocate new double vector on heap.');
	            }
	            for (const entry of data) {
	                this.wasmModule._addDoubleVectorEntry(vecPtr, entry);
	            }
	            this.wasmModule._addDoubleVectorToInputSidePacket(vecPtr, sidePacketNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addFloatVectorToInputSidePacket(data, sidePacketName) {
	        this.wrapStringPtr(sidePacketName, (sidePacketNamePtr) => {
	            const vecPtr = this.wasmModule._allocateFloatVector(data.length);
	            if (!vecPtr) {
	                throw new Error('Unable to allocate new float vector on heap.');
	            }
	            for (const entry of data) {
	                this.wasmModule._addFloatVectorEntry(vecPtr, entry);
	            }
	            this.wasmModule._addFloatVectorToInputSidePacket(vecPtr, sidePacketNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addIntVectorToInputSidePacket(data, sidePacketName) {
	        this.wrapStringPtr(sidePacketName, (sidePacketNamePtr) => {
	            const vecPtr = this.wasmModule._allocateIntVector(data.length);
	            if (!vecPtr) {
	                throw new Error('Unable to allocate new int vector on heap.');
	            }
	            for (const entry of data) {
	                this.wasmModule._addIntVectorEntry(vecPtr, entry);
	            }
	            this.wasmModule._addIntVectorToInputSidePacket(vecPtr, sidePacketNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addUintVectorToInputSidePacket(data, sidePacketName) {
	        this.wrapStringPtr(sidePacketName, (sidePacketNamePtr) => {
	            const vecPtr = this.wasmModule._allocateUintVector(data.length);
	            if (!vecPtr) {
	                throw new Error('Unable to allocate new unsigned int vector on heap.');
	            }
	            for (const entry of data) {
	                this.wasmModule._addUintVectorEntry(vecPtr, entry);
	            }
	            this.wasmModule._addUintVectorToInputSidePacket(vecPtr, sidePacketNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    addStringVectorToInputSidePacket(data, sidePacketName) {
	        this.wrapStringPtr(sidePacketName, (sidePacketNamePtr) => {
	            const vecPtr = this.wasmModule._allocateStringVector(data.length);
	            if (!vecPtr) {
	                throw new Error('Unable to allocate new string vector on heap.');
	            }
	            for (const entry of data) {
	                this.wrapStringPtr(entry, (entryStringPtr) => {
	                    this.wasmModule._addStringVectorEntry(vecPtr, entryStringPtr);
	                });
	            }
	            this.wasmModule._addStringVectorToInputSidePacket(vecPtr, sidePacketNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    attachBoolListener(outputStreamName, callbackFcn) {
	        // Set up our TS listener to receive any packets for this stream.
	        this.setListener(outputStreamName, callbackFcn);
	        // Tell our graph to listen for bool packets on this stream.
	        this.wrapStringPtr(outputStreamName, (outputStreamNamePtr) => {
	            this.wasmModule._attachBoolListener(outputStreamNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    attachBoolVectorListener(outputStreamName, callbackFcn) {
	        // Set up our TS listener to receive any packets for this stream.
	        this.setVectorListener(outputStreamName, callbackFcn);
	        // Tell our graph to listen for std::vector<bool> packets on this stream.
	        this.wrapStringPtr(outputStreamName, (outputStreamNamePtr) => {
	            this.wasmModule._attachBoolVectorListener(outputStreamNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    attachIntListener(outputStreamName, callbackFcn) {
	        // Set up our TS listener to receive any packets for this stream.
	        this.setListener(outputStreamName, callbackFcn);
	        // Tell our graph to listen for int packets on this stream.
	        this.wrapStringPtr(outputStreamName, (outputStreamNamePtr) => {
	            this.wasmModule._attachIntListener(outputStreamNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    attachIntVectorListener(outputStreamName, callbackFcn) {
	        // Set up our TS listener to receive any packets for this stream.
	        this.setVectorListener(outputStreamName, callbackFcn);
	        // Tell our graph to listen for std::vector<int> packets on this stream.
	        this.wrapStringPtr(outputStreamName, (outputStreamNamePtr) => {
	            this.wasmModule._attachIntVectorListener(outputStreamNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    attachUintListener(outputStreamName, callbackFcn) {
	        // Set up our TS listener to receive any packets for this stream.
	        this.setListener(outputStreamName, callbackFcn);
	        // Tell our graph to listen for uint32_t packets on this stream.
	        this.wrapStringPtr(outputStreamName, (outputStreamNamePtr) => {
	            this.wasmModule._attachUintListener(outputStreamNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    attachUintVectorListener(outputStreamName, callbackFcn) {
	        // Set up our TS listener to receive any packets for this stream.
	        this.setVectorListener(outputStreamName, callbackFcn);
	        // Tell our graph to listen for std::vector<uint32_t> packets on this
	        // stream.
	        this.wrapStringPtr(outputStreamName, (outputStreamNamePtr) => {
	            this.wasmModule._attachUintVectorListener(outputStreamNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    attachDoubleListener(outputStreamName, callbackFcn) {
	        // Set up our TS listener to receive any packets for this stream.
	        this.setListener(outputStreamName, callbackFcn);
	        // Tell our graph to listen for double packets on this stream.
	        this.wrapStringPtr(outputStreamName, (outputStreamNamePtr) => {
	            this.wasmModule._attachDoubleListener(outputStreamNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    attachDoubleVectorListener(outputStreamName, callbackFcn) {
	        // Set up our TS listener to receive any packets for this stream.
	        this.setVectorListener(outputStreamName, callbackFcn);
	        // Tell our graph to listen for std::vector<double> packets on this stream.
	        this.wrapStringPtr(outputStreamName, (outputStreamNamePtr) => {
	            this.wasmModule._attachDoubleVectorListener(outputStreamNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    attachFloatListener(outputStreamName, callbackFcn) {
	        // Set up our TS listener to receive any packets for this stream.
	        this.setListener(outputStreamName, callbackFcn);
	        // Tell our graph to listen for float packets on this stream.
	        this.wrapStringPtr(outputStreamName, (outputStreamNamePtr) => {
	            this.wasmModule._attachFloatListener(outputStreamNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    attachFloatVectorListener(outputStreamName, callbackFcn) {
	        // Set up our TS listener to receive any packets for this stream.
	        this.setVectorListener(outputStreamName, callbackFcn);
	        // Tell our graph to listen for std::vector<float> packets on this stream.
	        this.wrapStringPtr(outputStreamName, (outputStreamNamePtr) => {
	            this.wasmModule._attachFloatVectorListener(outputStreamNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    attachStringListener(outputStreamName, callbackFcn) {
	        // Set up our TS listener to receive any packets for this stream.
	        this.setListener(outputStreamName, callbackFcn);
	        // Tell our graph to listen for string packets on this stream.
	        this.wrapStringPtr(outputStreamName, (outputStreamNamePtr) => {
	            this.wasmModule._attachStringListener(outputStreamNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    attachStringVectorListener(outputStreamName, callbackFcn) {
	        // Set up our TS listener to receive any packets for this stream.
	        this.setVectorListener(outputStreamName, callbackFcn);
	        // Tell our graph to listen for std::vector<string> packets on this stream.
	        this.wrapStringPtr(outputStreamName, (outputStreamNamePtr) => {
	            this.wasmModule._attachStringVectorListener(outputStreamNamePtr);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    attachProtoListener(outputStreamName, callbackFcn, makeDeepCopy) {
	        // Set up our TS listener to receive any packets for this stream.
	        this.setListener(outputStreamName, callbackFcn);
	        // Tell our graph to listen for binary serialized proto data packets on this
	        // stream.
	        this.wrapStringPtr(outputStreamName, (outputStreamNamePtr) => {
	            this.wasmModule._attachProtoListener(outputStreamNamePtr, makeDeepCopy || false);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    attachProtoVectorListener(outputStreamName, callbackFcn, makeDeepCopy) {
	        // Set up our TS listener to receive any packets for this stream.
	        this.setVectorListener(outputStreamName, callbackFcn);
	        // Tell our graph to listen for a vector of binary serialized proto packets
	        // on this stream.
	        this.wrapStringPtr(outputStreamName, (outputStreamNamePtr) => {
	            this.wasmModule._attachProtoVectorListener(outputStreamNamePtr, makeDeepCopy || false);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    attachAudioListener(outputStreamName, callbackFcn, makeDeepCopy) {
	        if (!this.wasmModule._attachAudioListener) {
	            console.warn('Attempting to use attachAudioListener without support for ' +
	                'output audio. Is build dep ":gl_graph_runner_audio_out" missing?');
	        }
	        // Set up our TS listener to receive any packets for this stream, and
	        // additionally reformat our Uint8Array into a Float32Array for the user.
	        this.setListener(outputStreamName, (data, timestamp) => {
	            // Should be very fast
	            const floatArray = new Float32Array(data.buffer, data.byteOffset, data.length / 4);
	            callbackFcn(floatArray, timestamp);
	        });
	        // Tell our graph to listen for string packets on this stream.
	        this.wrapStringPtr(outputStreamName, (outputStreamNamePtr) => {
	            this.wasmModule._attachAudioListener(outputStreamNamePtr, makeDeepCopy || false);
	        });
	    }
	    /** {@override GraphRunnerApi} */
	    finishProcessing() {
	        this.wasmModule._waitUntilIdle();
	    }
	    /** {@override GraphRunnerApi} */
	    closeGraph() {
	        this.wasmModule._closeGraph();
	        this.wasmModule.simpleListeners = undefined;
	        this.wasmModule.emptyPacketListeners = undefined;
	    }
	}
	exports.GraphRunner = GraphRunner;
	/** {@override CreateMediaPipeLibApi} */
	const createMediaPipeLib = async (constructorFcn, wasmLoaderScript, assetLoaderScript, glCanvas, fileLocator) => {
	    // Run wasm-loader script here
	    if (wasmLoaderScript) {
	        await (0, run_script_helper_1.runScript)(wasmLoaderScript);
	    }
	    if (!self.ModuleFactory) {
	        throw new Error('ModuleFactory not set.');
	    }
	    // Run asset-loader script here; must be run after wasm-loader script if we
	    // are re-wrapping the existing MODULARIZE export.
	    if (assetLoaderScript) {
	        await (0, run_script_helper_1.runScript)(assetLoaderScript);
	        if (!self.ModuleFactory) {
	            throw new Error('ModuleFactory not set.');
	        }
	    }
	    // Until asset scripts work nicely with MODULARIZE, when we are given both
	    // self.Module and a fileLocator, we manually merge them into self.Module and
	    // use that. TODO: Remove this when asset scripts are fixed.
	    if (self.Module && fileLocator) {
	        const moduleFileLocator = self.Module;
	        moduleFileLocator.locateFile = fileLocator.locateFile;
	        if (fileLocator.mainScriptUrlOrBlob) {
	            moduleFileLocator.mainScriptUrlOrBlob = fileLocator.mainScriptUrlOrBlob;
	        }
	    }
	    // TODO: Ensure that fileLocator is passed in by all users
	    // and make it required
	    const module = await self.ModuleFactory(self.Module || fileLocator);
	    // Don't reuse factory or module seed
	    self.ModuleFactory = self.Module = undefined;
	    return new constructorFcn(module, glCanvas);
	};
	exports.createMediaPipeLib = createMediaPipeLib;
	/** {@override CreateGraphRunnerApi} */
	const createGraphRunner = async (wasmLoaderScript, assetLoaderScript, glCanvas, fileLocator) => {
	    return (0, exports.createMediaPipeLib)(GraphRunner, wasmLoaderScript, assetLoaderScript, glCanvas, fileLocator);
	};
	exports.createGraphRunner = createGraphRunner;
	
} (graph_runner));

var register_model_resources_graph_service = {};

Object.defineProperty(register_model_resources_graph_service, "__esModule", { value: true });
register_model_resources_graph_service.SupportModelResourcesGraphService = void 0;
/**
 * An implementation of GraphRunner that supports registering model
 * resources to a cache, in the form of a GraphService C++-side. We implement as
 * a proper TS mixin, to allow for effective multiple inheritance. Sample usage:
 * `const GraphRunnerWithModelResourcesLib =
 *      SupportModelResourcesGraphService(GraphRunner);`
 */
// tslint:disable:enforce-name-casing
function SupportModelResourcesGraphService(Base) {
    return class extends Base {
        // tslint:enable:enforce-name-casing
        /**
         * Instructs the graph runner to use the model resource caching graph
         * service for both graph expansion/inintialization, as well as for graph
         * run.
         */
        registerModelResourcesGraphService() {
            this.wasmModule
                ._registerModelResourcesGraphService();
        }
    };
}
register_model_resources_graph_service.SupportModelResourcesGraphService = SupportModelResourcesGraphService;

/**
 * Copyright 2022 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(task_runner, "__esModule", { value: true });
task_runner.TaskRunner = task_runner.createTaskRunner = task_runner.CachedGraphRunner = void 0;
const inference_calculator_pb_1 = inference_calculator_pb;
const calculator_pb_1 = calculator_pb;
const acceleration_pb_1 = acceleration_pb;
const external_file_pb_1 = external_file_pb;
const graph_runner_1$1 = graph_runner;
const register_model_resources_graph_service_1$1 = register_model_resources_graph_service;
// Internal stream names for temporarily keeping memory alive, then freeing it.
const FREE_MEMORY_STREAM = 'free_memory';
const UNUSED_STREAM_SUFFIX = '_unused_out';
// tslint:disable-next-line:enforce-name-casing
const CachedGraphRunnerType = (0, register_model_resources_graph_service_1$1.SupportModelResourcesGraphService)(graph_runner_1$1.GraphRunner);
// The OSS JS API does not support the builder pattern.
// tslint:disable:jspb-use-builder-pattern
/**
 * An implementation of the GraphRunner that exposes the resource graph
 * service.
 */
class CachedGraphRunner extends CachedGraphRunnerType {
}
task_runner.CachedGraphRunner = CachedGraphRunner;
/**
 * Creates a new instance of a Mediapipe Task. Determines if SIMD is
 * supported and loads the relevant WASM binary.
 * @return A fully instantiated instance of `T`.
 */
async function createTaskRunner(type, canvas, fileset, options) {
    const fileLocator = {
        locateFile(file) {
            // We currently only use a single .wasm file and a single .data file (for
            // the tasks that have to load assets). We need to revisit how we
            // initialize the file locator if we ever need to differentiate between
            // diffferent files.
            if (file.endsWith('.wasm')) {
                return fileset.wasmBinaryPath.toString();
            }
            else if (fileset.assetBinaryPath && file.endsWith('.data')) {
                return fileset.assetBinaryPath.toString();
            }
            return file;
        },
    };
    const instance = await (0, graph_runner_1$1.createMediaPipeLib)(type, fileset.wasmLoaderPath, fileset.assetLoaderPath, canvas, fileLocator);
    await instance.setOptions(options);
    return instance;
}
task_runner.createTaskRunner = createTaskRunner;
/** Base class for all MediaPipe Tasks. */
class TaskRunner {
    /**
     * Creates a new instance of a Mediapipe Task. Determines if SIMD is
     * supported and loads the relevant WASM binary.
     * @return A fully instantiated instance of `T`.
     */
    static async createInstance(type, canvas, fileset, options) {
        return createTaskRunner(type, canvas, fileset, options);
    }
    /** @hideconstructor protected */
    constructor(graphRunner) {
        this.graphRunner = graphRunner;
        this.processingErrors = [];
        this.latestOutputTimestamp = 0;
        // Disables the automatic render-to-screen code, which allows for pure
        // CPU processing.
        this.graphRunner.setAutoRenderToScreen(false);
    }
    /**
     * Applies the current set of options, including optionally any base options
     * that have not been processed by the task implementation. The options are
     * applied synchronously unless a `modelAssetPath` is provided. This ensures
     * that for most use cases options are applied directly and immediately affect
     * the next inference.
     *
     * @param options The options for the task.
     * @param loadTfliteModel Whether to load the model specified in
     *     `options.baseOptions`.
     */
    applyOptions(options, loadTfliteModel = true) {
        if (loadTfliteModel) {
            const baseOptions = options.baseOptions || {};
            // Validate that exactly one model is configured
            if (options.baseOptions?.modelAssetBuffer &&
                options.baseOptions?.modelAssetPath) {
                throw new Error('Cannot set both baseOptions.modelAssetPath and baseOptions.modelAssetBuffer');
            }
            else if (!(this.baseOptions.getModelAsset()?.hasFileContent() ||
                this.baseOptions.getModelAsset()?.hasFileName() ||
                options.baseOptions?.modelAssetBuffer ||
                options.baseOptions?.modelAssetPath)) {
                throw new Error('Either baseOptions.modelAssetPath or baseOptions.modelAssetBuffer must be set');
            }
            this.setAcceleration(baseOptions);
            if (baseOptions.modelAssetPath) {
                // We don't use `await` here since we want to apply most settings
                // synchronously.
                return fetch(baseOptions.modelAssetPath.toString())
                    .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch model: ${baseOptions.modelAssetPath} (${response.status})`);
                    }
                    else {
                        return response.arrayBuffer();
                    }
                })
                    .then((buffer) => {
                    try {
                        // Try to delete file as we cannot overwrite an existing file
                        // using our current API.
                        this.graphRunner.wasmModule.FS_unlink('/model.dat');
                    }
                    catch { }
                    // TODO: Consider passing the model to the graph as an
                    // input side packet as this might reduce copies.
                    this.graphRunner.wasmModule.FS_createDataFile('/', 'model.dat', new Uint8Array(buffer), 
                    /* canRead= */ true, 
                    /* canWrite= */ false, 
                    /* canOwn= */ false);
                    this.setExternalFile('/model.dat');
                    this.refreshGraph();
                    this.onGraphRefreshed();
                });
            }
            else if (baseOptions.modelAssetBuffer instanceof Uint8Array) {
                this.setExternalFile(baseOptions.modelAssetBuffer);
            }
            else if (baseOptions.modelAssetBuffer) {
                return streamToUint8Array(baseOptions.modelAssetBuffer).then((buffer) => {
                    this.setExternalFile(buffer);
                    this.refreshGraph();
                    this.onGraphRefreshed();
                });
            }
        }
        // If there is no model to download, we can apply the setting synchronously.
        this.refreshGraph();
        this.onGraphRefreshed();
        return Promise.resolve();
    }
    /**
     * Callback that gets invoked once a new graph configuration has been
     * applied.
     */
    onGraphRefreshed() { }
    /** Returns the current CalculatorGraphConfig. */
    getCalculatorGraphConfig() {
        let config;
        this.graphRunner.getCalculatorGraphConfig((binaryData) => {
            config = calculator_pb_1.CalculatorGraphConfig.deserializeBinary(binaryData);
        });
        if (!config) {
            throw new Error('Failed to retrieve CalculatorGraphConfig');
        }
        return config;
    }
    /**
     * Takes the raw data from a MediaPipe graph, and passes it to C++ to be run
     * over the video stream. Will replace the previously running MediaPipe graph,
     * if there is one.
     * @param graphData The raw MediaPipe graph data, either in binary
     *     protobuffer format (.binarypb), or else in raw text format (.pbtxt or
     *     .textproto).
     * @param isBinary This should be set to true if the graph is in
     *     binary format, and false if it is in human-readable text format.
     */
    setGraph(graphData, isBinary) {
        this.graphRunner.attachErrorListener((code, message) => {
            this.processingErrors.push(new Error(message));
        });
        // Enables use of our model resource caching graph service; we apply this to
        // every MediaPipe graph we run.
        this.graphRunner.registerModelResourcesGraphService();
        this.graphRunner.setGraph(graphData, isBinary);
        this.keepaliveNode = undefined;
        this.handleErrors();
    }
    /**
     * Forces all queued-up packets to be pushed through the MediaPipe graph as
     * far as possible, performing all processing until no more processing can be
     * done.
     */
    finishProcessing() {
        this.graphRunner.finishProcessing();
        this.handleErrors();
    }
    /*
     * Sets the latest output timestamp received from the graph (in ms).
     * Timestamps that are smaller than the currently latest output timestamp are
     * ignored.
     */
    setLatestOutputTimestamp(timestamp) {
        this.latestOutputTimestamp = Math.max(this.latestOutputTimestamp, timestamp);
    }
    /**
     * Gets a syncthethic timestamp in ms that can be used to send data to the
     * next packet. The timestamp is one millisecond past the last timestamp
     * received from the graph.
     */
    getSynctheticTimestamp() {
        return this.latestOutputTimestamp + 1;
    }
    /** Throws the error from the error listener if an error was raised. */
    handleErrors() {
        try {
            const errorCount = this.processingErrors.length;
            if (errorCount === 1) {
                // Re-throw error to get a more meaningful stacktrace
                throw new Error(this.processingErrors[0].message);
            }
            else if (errorCount > 1) {
                throw new Error('Encountered multiple errors: ' +
                    this.processingErrors.map((e) => e.message).join(', '));
            }
        }
        finally {
            this.processingErrors = [];
        }
    }
    setExternalFile(modelAssetPathOrBuffer) {
        const externalFile = this.baseOptions.getModelAsset() || new external_file_pb_1.ExternalFile();
        if (typeof modelAssetPathOrBuffer === 'string') {
            externalFile.setFileName(modelAssetPathOrBuffer);
            externalFile.clearFileContent();
        }
        else if (modelAssetPathOrBuffer instanceof Uint8Array) {
            externalFile.setFileContent(modelAssetPathOrBuffer);
            externalFile.clearFileName();
        }
        this.baseOptions.setModelAsset(externalFile);
    }
    /** Configures the `acceleration` option. */
    setAcceleration(options) {
        let acceleration = this.baseOptions.getAcceleration();
        if (!acceleration) {
            // Create default instance for the initial configuration.
            acceleration = new acceleration_pb_1.Acceleration();
            acceleration.setTflite(new inference_calculator_pb_1.InferenceCalculatorOptions.Delegate.TfLite());
        }
        if ('delegate' in options) {
            if (options.delegate === 'GPU') {
                acceleration.setGpu(new inference_calculator_pb_1.InferenceCalculatorOptions.Delegate.Gpu());
            }
            else {
                acceleration.setTflite(new inference_calculator_pb_1.InferenceCalculatorOptions.Delegate.TfLite());
            }
        }
        this.baseOptions.setAcceleration(acceleration);
    }
    /**
     * Adds a node to the graph to temporarily keep certain streams alive.
     * NOTE: To use this call, PassThroughCalculator must be included in your wasm
     *     dependencies.
     */
    addKeepaliveNode(graphConfig) {
        this.keepaliveNode = new calculator_pb_1.CalculatorGraphConfig.Node();
        this.keepaliveNode.setCalculator('PassThroughCalculator');
        this.keepaliveNode.addInputStream(FREE_MEMORY_STREAM);
        this.keepaliveNode.addOutputStream(FREE_MEMORY_STREAM + UNUSED_STREAM_SUFFIX);
        graphConfig.addInputStream(FREE_MEMORY_STREAM);
        graphConfig.addNode(this.keepaliveNode);
    }
    /** Adds streams to the keepalive node to be kept alive until callback. */
    keepStreamAlive(streamName) {
        this.keepaliveNode.addInputStream(streamName);
        this.keepaliveNode.addOutputStream(streamName + UNUSED_STREAM_SUFFIX);
    }
    /** Frees any streams being kept alive by the keepStreamAlive callback. */
    freeKeepaliveStreams() {
        this.graphRunner.addBoolToStream(true, FREE_MEMORY_STREAM, this.latestOutputTimestamp);
    }
    /**
     * Closes and cleans up the resources held by this task.
     * @export
     */
    close() {
        this.keepaliveNode = undefined;
        this.graphRunner.closeGraph();
    }
}
task_runner.TaskRunner = TaskRunner;
/** Converts a ReadableStreamDefaultReader to a Uint8Array. */
async function streamToUint8Array(reader) {
    const chunks = [];
    let totalLength = 0;
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        chunks.push(value);
        totalLength += value.length;
    }
    if (chunks.length === 0) {
        return new Uint8Array(0);
    }
    else if (chunks.length === 1) {
        return chunks[0];
    }
    else {
        // Merge chunks
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            combined.set(chunk, offset);
            offset += chunk.length;
        }
        return combined;
    }
}

var graph_runner_image_lib = {};

Object.defineProperty(graph_runner_image_lib, "__esModule", { value: true });
graph_runner_image_lib.SupportImage = void 0;
/**
 * An implementation of GraphRunner that supports binding GPU image data as
 * `mediapipe::Image` instances. We implement as a proper TS mixin, to allow
 * for effective multiple inheritance. Example usage: `const GraphRunnerImageLib
 * = SupportImage(GraphRunner);`
 */
// tslint:disable-next-line:enforce-name-casing
function SupportImage(Base) {
    return class extends Base {
        get wasmImageModule() {
            return this.wasmModule;
        }
        /**
         * Takes the relevant information from the HTML video or image element,
         * and passes it into the WebGL-based graph for processing on the given
         * stream at the given timestamp as a MediaPipe image. Processing will not
         * occur until a blocking call (like processVideoGl or finishProcessing)
         * is made.
         * @param imageSource Reference to the video frame we wish to add into our
         *     graph.
         * @param streamName The name of the MediaPipe graph stream to add the
         *     frame to.
         * @param timestamp The timestamp of the input frame, in ms.
         */
        addGpuBufferAsImageToStream(imageSource, streamName, timestamp) {
            this.wrapStringPtr(streamName, (streamNamePtr) => {
                const [width, height] = this.bindTextureToStream(imageSource, streamNamePtr);
                this.wasmImageModule._addBoundTextureAsImageToStream(streamNamePtr, width, height, timestamp);
            });
        }
        /**
         * Attaches a mediapipe:Image packet listener to the specified output
         * stream.
         * @param outputStreamName The name of the graph output stream to grab
         *     mediapipe::Image data from.
         * @param callbackFcn The function that will be called back with the data,
         *     as it is received.  Note that the data is only guaranteed to exist
         *     for the duration of the callback, and the callback will be called
         *     inline, so it should not perform overly complicated (or any async)
         *     behavior.
         */
        attachImageListener(outputStreamName, callbackFcn) {
            // Set up our TS listener to receive any packets for this stream.
            this.setListener(outputStreamName, callbackFcn);
            // Tell our graph to listen for mediapipe::Image packets on this stream.
            this.wrapStringPtr(outputStreamName, (outputStreamNamePtr) => {
                this.wasmImageModule._attachImageListener(outputStreamNamePtr);
            });
        }
        /**
         * Attaches a mediapipe:Image[] packet listener to the specified
         * output_stream.
         * @param outputStreamName The name of the graph output stream to grab
         *     std::vector<mediapipe::Image> data from.
         * @param callbackFcn The function that will be called back with the data,
         *     as it is received.  Note that the data is only guaranteed to exist
         *     for the duration of the callback, and the callback will be called
         *     inline, so it should not perform overly complicated (or any async)
         *     behavior.
         */
        attachImageVectorListener(outputStreamName, callbackFcn) {
            // Set up our TS listener to receive any packets for this stream.
            this.setVectorListener(outputStreamName, callbackFcn);
            // Tell our graph to listen for std::vector<mediapipe::Image> packets on
            // this stream.
            this.wrapStringPtr(outputStreamName, (outputStreamNamePtr) => {
                this.wasmImageModule._attachImageVectorListener(outputStreamNamePtr);
            });
        }
    };
}
graph_runner_image_lib.SupportImage = SupportImage;

/**
 * Copyright 2022 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(vision_task_runner, "__esModule", { value: true });
vision_task_runner.VisionTaskRunner = vision_task_runner.VisionGraphRunner = void 0;
const rect_pb_1 = rect_pb;
const task_runner_1 = task_runner;
const image_1$1 = image;
const image_shader_context_1 = image_shader_context;
const mask_1$1 = mask;
const graph_runner_1 = graph_runner;
const graph_runner_image_lib_1 = graph_runner_image_lib;
const platform_utils_1 = platform_utils;
const register_model_resources_graph_service_1 = register_model_resources_graph_service;
// tslint:disable-next-line:enforce-name-casing
const GraphRunnerVisionType = (0, register_model_resources_graph_service_1.SupportModelResourcesGraphService)((0, graph_runner_image_lib_1.SupportImage)(graph_runner_1.GraphRunner));
/** An implementation of the GraphRunner that supports image operations */
class VisionGraphRunner extends GraphRunnerVisionType {
}
vision_task_runner.VisionGraphRunner = VisionGraphRunner;
// The OSS JS API does not support the builder pattern.
// tslint:disable:jspb-use-builder-pattern
/**
 * Creates a canvas for a MediaPipe vision task. Returns `undefined` if the
 * GraphRunner should create its own canvas.
 */
function createCanvas() {
    // Returns an HTML canvas or `undefined` if OffscreenCanvas is fully supported
    // (since the graph runner can initialize its own OffscreenCanvas).
    return (0, platform_utils_1.supportsOffscreenCanvas)() ? undefined :
        document.createElement('canvas');
}
/** Base class for all MediaPipe Vision Tasks. */
class VisionTaskRunner extends task_runner_1.TaskRunner {
    static async createVisionInstance(type, fileset, options) {
        const canvas = options.canvas ?? createCanvas();
        return task_runner_1.TaskRunner.createInstance(type, canvas, fileset, options);
    }
    /**
     * Constructor to initialize a `VisionTaskRunner`.
     *
     * @param graphRunner the graph runner for this task.
     * @param imageStreamName the name of the input image stream.
     * @param normRectStreamName the name of the input normalized rect image
     *     stream used to provide (mandatory) rotation and (optional)
     *     region-of-interest. `null` if the graph does not support normalized
     *     rects.
     * @param roiAllowed Whether this task supports Region-Of-Interest
     *     pre-processing
     *
     * @hideconstructor protected
     */
    constructor(graphRunner, imageStreamName, normRectStreamName, roiAllowed) {
        super(graphRunner);
        this.graphRunner = graphRunner;
        this.imageStreamName = imageStreamName;
        this.normRectStreamName = normRectStreamName;
        this.roiAllowed = roiAllowed;
        this.shaderContext = new image_shader_context_1.MPImageShaderContext();
    }
    /**
     * Configures the shared options of a vision task.
     *
     * @param options The options for the task.
     * @param loadTfliteModel Whether to load the model specified in
     *     `options.baseOptions`.
     */
    applyOptions(options, loadTfliteModel = true) {
        if ('runningMode' in options) {
            const useStreamMode = !!options.runningMode && options.runningMode !== 'IMAGE';
            this.baseOptions.setUseStreamMode(useStreamMode);
        }
        if (options.canvas !== undefined) {
            if (this.graphRunner.wasmModule.canvas !== options.canvas) {
                throw new Error('You must create a new task to reset the canvas.');
            }
        }
        return super.applyOptions(options, loadTfliteModel);
    }
    /** Sends a single image to the graph and awaits results. */
    processImageData(image, imageProcessingOptions) {
        if (!!this.baseOptions?.getUseStreamMode()) {
            throw new Error('Task is not initialized with image mode. ' +
                '\'runningMode\' must be set to \'IMAGE\'.');
        }
        this.process(image, imageProcessingOptions, this.getSynctheticTimestamp());
    }
    /** Sends a single video frame to the graph and awaits results. */
    processVideoData(imageFrame, imageProcessingOptions, timestamp) {
        if (!this.baseOptions?.getUseStreamMode()) {
            throw new Error('Task is not initialized with video mode. ' +
                '\'runningMode\' must be set to \'VIDEO\'.');
        }
        this.process(imageFrame, imageProcessingOptions, timestamp);
    }
    convertToNormalizedRect(imageSource, imageProcessingOptions) {
        const normalizedRect = new rect_pb_1.NormalizedRect();
        if (imageProcessingOptions?.regionOfInterest) {
            if (!this.roiAllowed) {
                throw new Error('This task doesn\'t support region-of-interest.');
            }
            const roi = imageProcessingOptions.regionOfInterest;
            if (roi.left >= roi.right || roi.top >= roi.bottom) {
                throw new Error('Expected RectF with left < right and top < bottom.');
            }
            if (roi.left < 0 || roi.top < 0 || roi.right > 1 || roi.bottom > 1) {
                throw new Error('Expected RectF values to be in [0,1].');
            }
            normalizedRect.setXCenter((roi.left + roi.right) / 2.0);
            normalizedRect.setYCenter((roi.top + roi.bottom) / 2.0);
            normalizedRect.setWidth(roi.right - roi.left);
            normalizedRect.setHeight(roi.bottom - roi.top);
        }
        else {
            normalizedRect.setXCenter(0.5);
            normalizedRect.setYCenter(0.5);
            normalizedRect.setWidth(1);
            normalizedRect.setHeight(1);
        }
        if (imageProcessingOptions?.rotationDegrees) {
            if (imageProcessingOptions?.rotationDegrees % 90 !== 0) {
                throw new Error('Expected rotation to be a multiple of 90°.');
            }
            // Convert to radians anti-clockwise.
            normalizedRect.setRotation(-Math.PI * imageProcessingOptions.rotationDegrees / 180.0);
            // For 90° and 270° rotations, we need to swap width and height.
            // This is due to the internal behavior of ImageToTensorCalculator, which:
            // - first denormalizes the provided rect by multiplying the rect width or
            //   height by the image width or height, respectively.
            // - then rotates this by denormalized rect by the provided rotation, and
            //   uses this for cropping,
            // - then finally rotates this back.
            if (imageProcessingOptions?.rotationDegrees % 180 !== 0) {
                const [imageWidth, imageHeight] = (0, graph_runner_1.getImageSourceSize)(imageSource);
                // tslint:disable:no-unnecessary-type-assertion
                const width = normalizedRect.getHeight() * imageHeight / imageWidth;
                const height = normalizedRect.getWidth() * imageWidth / imageHeight;
                // tslint:enable:no-unnecessary-type-assertion
                normalizedRect.setWidth(width);
                normalizedRect.setHeight(height);
            }
        }
        return normalizedRect;
    }
    /** Runs the graph and blocks on the response. */
    process(imageSource, imageProcessingOptions, timestamp) {
        if (this.normRectStreamName) {
            const normalizedRect = this.convertToNormalizedRect(imageSource, imageProcessingOptions);
            this.graphRunner.addProtoToStream(normalizedRect.serializeBinary(), 'mediapipe.NormalizedRect', this.normRectStreamName, timestamp);
        }
        this.graphRunner.addGpuBufferAsImageToStream(imageSource, this.imageStreamName, timestamp ?? performance.now());
        this.finishProcessing();
    }
    /**
     * Converts a WasmImage to an MPImage.
     *
     * Converts the underlying Uint8Array-backed images to ImageData
     * (adding an alpha channel if necessary), passes through WebGLTextures and
     * throws for Float32Array-backed images.
     */
    convertToMPImage(wasmImage, shouldCopyData) {
        const { data, width, height } = wasmImage;
        const pixels = width * height;
        let container;
        if (data instanceof Uint8Array) {
            if (data.length === pixels * 3) {
                // TODO: Convert in C++
                const rgba = new Uint8ClampedArray(pixels * 4);
                for (let i = 0; i < pixels; ++i) {
                    rgba[4 * i] = data[3 * i];
                    rgba[4 * i + 1] = data[3 * i + 1];
                    rgba[4 * i + 2] = data[3 * i + 2];
                    rgba[4 * i + 3] = 255;
                }
                container = new ImageData(rgba, width, height);
            }
            else if (data.length === pixels * 4) {
                container = new ImageData(new Uint8ClampedArray(data.buffer, data.byteOffset, data.length), width, height);
            }
            else {
                throw new Error(`Unsupported channel count: ${data.length / pixels}`);
            }
        }
        else if (data instanceof WebGLTexture) {
            container = data;
        }
        else {
            throw new Error(`Unsupported format: ${data.constructor.name}`);
        }
        const image = new image_1$1.MPImage([container], /* ownsImageBitmap= */ false, 
        /* ownsWebGLTexture= */ false, this.graphRunner.wasmModule.canvas, this.shaderContext, width, height);
        return shouldCopyData ? image.clone() : image;
    }
    /** Converts a WasmImage to an MPMask.  */
    convertToMPMask(wasmImage, interpolateValues, shouldCopyData) {
        const { data, width, height } = wasmImage;
        const pixels = width * height;
        let container;
        if (data instanceof Uint8Array || data instanceof Float32Array) {
            if (data.length === pixels) {
                container = data;
            }
            else {
                throw new Error(`Unsupported channel count: ${data.length / pixels}`);
            }
        }
        else {
            container = data;
        }
        const mask = new mask_1$1.MPMask([container], interpolateValues, 
        /* ownsWebGLTexture= */ false, this.graphRunner.wasmModule.canvas, this.shaderContext, width, height);
        return shouldCopyData ? mask.clone() : mask;
    }
    /**
     * Closes and cleans up the resources held by this task.
     * @export
     */
    close() {
        this.shaderContext.close();
        super.close();
    }
}
vision_task_runner.VisionTaskRunner = VisionTaskRunner;

var image_segmenter_result = {};

/**
 * Copyright 2023 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(image_segmenter_result, "__esModule", { value: true });
image_segmenter_result.ImageSegmenterResult = void 0;
/** The output result of ImageSegmenter. */
class ImageSegmenterResult {
    constructor(
    /**
     * Multiple masks represented as `Float32Array` or `WebGLTexture`-backed
     * `MPImage`s where, for each mask, each pixel represents the prediction
     * confidence, usually in the [0, 1] range.
     * @export
     */
    confidenceMasks, 
    /**
     * A category mask represented as a `Uint8ClampedArray` or
     * `WebGLTexture`-backed `MPImage` where each pixel represents the class
     * which the pixel in the original image was predicted to belong to.
     * @export
     */
    categoryMask, 
    /**
     * The quality scores of the result masks, in the range of [0, 1].
     * Defaults to `1` if the model doesn't output quality scores. Each
     * element corresponds to the score of the category in the model outputs.
     * @export
     */
    qualityScores) {
        this.confidenceMasks = confidenceMasks;
        this.categoryMask = categoryMask;
        this.qualityScores = qualityScores;
    }
    /**
     * Frees the resources held by the category and confidence masks.
     * @export
     */
    close() {
        this.confidenceMasks?.forEach(m => {
            m.close();
        });
        this.categoryMask?.close();
    }
}
image_segmenter_result.ImageSegmenterResult = ImageSegmenterResult;

var image_segmenter_options = {};

/**
 * Copyright 2022 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(image_segmenter_options, "__esModule", { value: true });

(function (exports) {
	/**
	 * Copyright 2022 The MediaPipe Authors.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ImageSegmenter = void 0;
	const calculator_pb_1 = calculator_pb;
	const calculator_options_pb_1 = calculator_options_pb;
	const base_options_pb_1 = base_options_pb;
	const tensors_to_segmentation_calculator_pb_1 = tensors_to_segmentation_calculator_pb;
	const image_segmenter_graph_options_pb_1 = image_segmenter_graph_options_pb;
	const segmenter_options_pb_1 = segmenter_options_pb;
	const vision_task_runner_1 = vision_task_runner;
	const image_segmenter_result_1 = image_segmenter_result;
	__exportStar(image_segmenter_options, exports);
	__exportStar(image_segmenter_result, exports);
	const IMAGE_STREAM = 'image_in';
	const NORM_RECT_STREAM = 'norm_rect';
	const CONFIDENCE_MASKS_STREAM = 'confidence_masks';
	const CATEGORY_MASK_STREAM = 'category_mask';
	const QUALITY_SCORES_STREAM = 'quality_scores';
	const IMAGE_SEGMENTER_GRAPH = 'mediapipe.tasks.vision.image_segmenter.ImageSegmenterGraph';
	const TENSORS_TO_SEGMENTATION_CALCULATOR_NAME = 'mediapipe.tasks.TensorsToSegmentationCalculator';
	const DEFAULT_OUTPUT_CATEGORY_MASK = false;
	const DEFAULT_OUTPUT_CONFIDENCE_MASKS = true;
	/** Performs image segmentation on images. */
	class ImageSegmenter extends vision_task_runner_1.VisionTaskRunner {
	    /**
	     * Initializes the Wasm runtime and creates a new image segmenter from the
	     * provided options.
	     * @export
	     * @param wasmFileset A configuration object that provides the location of
	     *     the Wasm binary and its loader.
	     * @param imageSegmenterOptions The options for the Image Segmenter. Note
	     *     that either a path to the model asset or a model buffer needs to be
	     *     provided (via `baseOptions`).
	     */
	    static createFromOptions(wasmFileset, imageSegmenterOptions) {
	        return vision_task_runner_1.VisionTaskRunner.createVisionInstance(ImageSegmenter, wasmFileset, imageSegmenterOptions);
	    }
	    /**
	     * Initializes the Wasm runtime and creates a new image segmenter based on
	     * the provided model asset buffer.
	     * @export
	     * @param wasmFileset A configuration object that provides the location of
	     *     the Wasm binary and its loader.
	     * @param modelAssetBuffer An array or a stream containing a binary
	     *    representation of the model.
	     */
	    static createFromModelBuffer(wasmFileset, modelAssetBuffer) {
	        return vision_task_runner_1.VisionTaskRunner.createVisionInstance(ImageSegmenter, wasmFileset, {
	            baseOptions: { modelAssetBuffer },
	        });
	    }
	    /**
	     * Initializes the Wasm runtime and creates a new image segmenter based on
	     * the path to the model asset.
	     * @export
	     * @param wasmFileset A configuration object that provides the location of
	     *     the Wasm binary and its loader.
	     * @param modelAssetPath The path to the model asset.
	     */
	    static createFromModelPath(wasmFileset, modelAssetPath) {
	        return vision_task_runner_1.VisionTaskRunner.createVisionInstance(ImageSegmenter, wasmFileset, {
	            baseOptions: { modelAssetPath },
	        });
	    }
	    /** @hideconstructor */
	    constructor(wasmModule, glCanvas) {
	        super(new vision_task_runner_1.VisionGraphRunner(wasmModule, glCanvas), IMAGE_STREAM, NORM_RECT_STREAM, 
	        /* roiAllowed= */ false);
	        this.labels = [];
	        this.outputCategoryMask = DEFAULT_OUTPUT_CATEGORY_MASK;
	        this.outputConfidenceMasks = DEFAULT_OUTPUT_CONFIDENCE_MASKS;
	        this.options = new image_segmenter_graph_options_pb_1.ImageSegmenterGraphOptions();
	        this.segmenterOptions = new segmenter_options_pb_1.SegmenterOptions();
	        this.options.setSegmenterOptions(this.segmenterOptions);
	        this.options.setBaseOptions(new base_options_pb_1.BaseOptions());
	    }
	    get baseOptions() {
	        return this.options.getBaseOptions();
	    }
	    set baseOptions(proto) {
	        this.options.setBaseOptions(proto);
	    }
	    /**
	     * Sets new options for the image segmenter.
	     *
	     * Calling `setOptions()` with a subset of options only affects those
	     * options. You can reset an option back to its default value by
	     * explicitly setting it to `undefined`.
	     *
	     * @export
	     * @param options The options for the image segmenter.
	     */
	    setOptions(options) {
	        // Note that we have to support both JSPB and ProtobufJS, hence we
	        // have to expliclity clear the values instead of setting them to
	        // `undefined`.
	        if (options.displayNamesLocale !== undefined) {
	            this.options.setDisplayNamesLocale(options.displayNamesLocale);
	        }
	        else if ('displayNamesLocale' in options) {
	            // Check for undefined
	            this.options.clearDisplayNamesLocale();
	        }
	        if ('outputCategoryMask' in options) {
	            this.outputCategoryMask =
	                options.outputCategoryMask ?? DEFAULT_OUTPUT_CATEGORY_MASK;
	        }
	        if ('outputConfidenceMasks' in options) {
	            this.outputConfidenceMasks =
	                options.outputConfidenceMasks ?? DEFAULT_OUTPUT_CONFIDENCE_MASKS;
	        }
	        return super.applyOptions(options);
	    }
	    onGraphRefreshed() {
	        this.populateLabels();
	    }
	    /**
	     * Populate the labelMap in TensorsToSegmentationCalculator to labels field.
	     * @throws Exception if there is an error during finding
	     *     TensorsToSegmentationCalculator.
	     */
	    populateLabels() {
	        const graphConfig = this.getCalculatorGraphConfig();
	        const tensorsToSegmentationCalculators = graphConfig
	            .getNodeList()
	            .filter((n) => n.getName().includes(TENSORS_TO_SEGMENTATION_CALCULATOR_NAME));
	        this.labels = [];
	        if (tensorsToSegmentationCalculators.length > 1) {
	            throw new Error(`The graph has more than one ${TENSORS_TO_SEGMENTATION_CALCULATOR_NAME}.`);
	        }
	        else if (tensorsToSegmentationCalculators.length === 1) {
	            const labelItems = tensorsToSegmentationCalculators[0]
	                .getOptions()
	                ?.getExtension(tensors_to_segmentation_calculator_pb_1.TensorsToSegmentationCalculatorOptions.ext)
	                ?.getLabelItemsMap() ?? new Map();
	            labelItems.forEach((value, index) => {
	                // tslint:disable-next-line:no-unnecessary-type-assertion
	                this.labels[Number(index)] = value.getName();
	            });
	        }
	    }
	    /** @export */
	    segment(image, imageProcessingOptionsOrCallback, callback) {
	        const imageProcessingOptions = typeof imageProcessingOptionsOrCallback !== 'function'
	            ? imageProcessingOptionsOrCallback
	            : {};
	        this.userCallback =
	            typeof imageProcessingOptionsOrCallback === 'function'
	                ? imageProcessingOptionsOrCallback
	                : callback;
	        this.reset();
	        this.processImageData(image, imageProcessingOptions);
	        return this.processResults();
	    }
	    /** @export */
	    segmentForVideo(videoFrame, timestamp, imageProcessingOptionsOrCallback, callback) {
	        const imageProcessingOptions = typeof imageProcessingOptionsOrCallback !== 'function'
	            ? imageProcessingOptionsOrCallback
	            : {};
	        this.userCallback =
	            typeof imageProcessingOptionsOrCallback === 'function'
	                ? imageProcessingOptionsOrCallback
	                : callback;
	        this.reset();
	        this.processVideoData(videoFrame, imageProcessingOptions, timestamp);
	        return this.processResults();
	    }
	    /**
	     * Get the category label list of the ImageSegmenter can recognize. For
	     * `CATEGORY_MASK` type, the index in the category mask corresponds to the
	     * category in the label list. For `CONFIDENCE_MASK` type, the output mask
	     * list at index corresponds to the category in the label list.
	     *
	     * If there is no labelmap provided in the model file, empty label array is
	     * returned.
	     *
	     * @export
	     * @return The labels used by the current model.
	     */
	    getLabels() {
	        return this.labels;
	    }
	    reset() {
	        this.categoryMask = undefined;
	        this.confidenceMasks = undefined;
	        this.qualityScores = undefined;
	    }
	    processResults() {
	        try {
	            const result = new image_segmenter_result_1.ImageSegmenterResult(this.confidenceMasks, this.categoryMask, this.qualityScores);
	            if (this.userCallback) {
	                this.userCallback(result);
	            }
	            else {
	                return result;
	            }
	        }
	        finally {
	            // Free the image memory, now that we've kept all streams alive long
	            // enough to be returned in our callbacks.
	            this.freeKeepaliveStreams();
	        }
	    }
	    /** Updates the MediaPipe graph configuration. */
	    refreshGraph() {
	        const graphConfig = new calculator_pb_1.CalculatorGraphConfig();
	        graphConfig.addInputStream(IMAGE_STREAM);
	        graphConfig.addInputStream(NORM_RECT_STREAM);
	        const calculatorOptions = new calculator_options_pb_1.CalculatorOptions();
	        calculatorOptions.setExtension(image_segmenter_graph_options_pb_1.ImageSegmenterGraphOptions.ext, this.options);
	        const segmenterNode = new calculator_pb_1.CalculatorGraphConfig.Node();
	        segmenterNode.setCalculator(IMAGE_SEGMENTER_GRAPH);
	        segmenterNode.addInputStream('IMAGE:' + IMAGE_STREAM);
	        segmenterNode.addInputStream('NORM_RECT:' + NORM_RECT_STREAM);
	        segmenterNode.setOptions(calculatorOptions);
	        graphConfig.addNode(segmenterNode);
	        this.addKeepaliveNode(graphConfig);
	        if (this.outputConfidenceMasks) {
	            graphConfig.addOutputStream(CONFIDENCE_MASKS_STREAM);
	            segmenterNode.addOutputStream('CONFIDENCE_MASKS:' + CONFIDENCE_MASKS_STREAM);
	            this.keepStreamAlive(CONFIDENCE_MASKS_STREAM);
	            this.graphRunner.attachImageVectorListener(CONFIDENCE_MASKS_STREAM, (masks, timestamp) => {
	                this.confidenceMasks = masks.map((wasmImage) => this.convertToMPImage(wasmImage, 
	                // /* interpolateValues= */ true,
	                /* shouldCopyData= */ !this.userCallback));
	                this.setLatestOutputTimestamp(timestamp);
	            });
	            this.graphRunner.attachEmptyPacketListener(CONFIDENCE_MASKS_STREAM, (timestamp) => {
	                this.confidenceMasks = [];
	                this.setLatestOutputTimestamp(timestamp);
	            });
	        }
	        if (this.outputCategoryMask) {
	            graphConfig.addOutputStream(CATEGORY_MASK_STREAM);
	            segmenterNode.addOutputStream('CATEGORY_MASK:' + CATEGORY_MASK_STREAM);
	            this.keepStreamAlive(CATEGORY_MASK_STREAM);
	            this.graphRunner.attachImageListener(CATEGORY_MASK_STREAM, (mask, timestamp) => {
	                this.categoryMask = this.convertToMPMask(mask, 
	                /* interpolateValues= */ false, 
	                /* shouldCopyData= */ !this.userCallback);
	                this.setLatestOutputTimestamp(timestamp);
	            });
	            this.graphRunner.attachEmptyPacketListener(CATEGORY_MASK_STREAM, (timestamp) => {
	                this.categoryMask = undefined;
	                this.setLatestOutputTimestamp(timestamp);
	            });
	        }
	        graphConfig.addOutputStream(QUALITY_SCORES_STREAM);
	        segmenterNode.addOutputStream('QUALITY_SCORES:' + QUALITY_SCORES_STREAM);
	        this.graphRunner.attachFloatVectorListener(QUALITY_SCORES_STREAM, (scores, timestamp) => {
	            this.qualityScores = scores;
	            this.setLatestOutputTimestamp(timestamp);
	        });
	        this.graphRunner.attachEmptyPacketListener(QUALITY_SCORES_STREAM, (timestamp) => {
	            this.categoryMask = undefined;
	            this.setLatestOutputTimestamp(timestamp);
	        });
	        const binaryGraph = graphConfig.serializeBinary();
	        this.setGraph(new Uint8Array(binaryGraph), /* isBinary= */ true);
	    }
	}
	exports.ImageSegmenter = ImageSegmenter;
	
} (image_segmenter));

/**
 * Copyright 2022 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(vision, "__esModule", { value: true });
var ImageSegmenter_1 = vision.ImageSegmenter = MPMask_1 = vision.MPMask = MPImage_1 = vision.MPImage = FilesetResolver_1 = vision.FilesetResolver = DrawingUtils_1 = vision.DrawingUtils = void 0;
const fileset_resolver_1 = fileset_resolver;
const drawing_utils_1 = drawing_utils;
const image_1 = image;
const mask_1 = mask;
/*
import {FaceDetector as FaceDetectorImpl} from '../../../tasks/web/vision/face_detector/face_detector';
import {FaceLandmarker as FaceLandmarkerImpl} from '../../../tasks/web/vision/face_landmarker/face_landmarker';
import {FaceStylizer as FaceStylizerImpl} from '../../../tasks/web/vision/face_stylizer/face_stylizer';
import {GestureRecognizer as GestureRecognizerImpl} from '../../../tasks/web/vision/gesture_recognizer/gesture_recognizer';
import {HandLandmarker as HandLandmarkerImpl} from '../../../tasks/web/vision/hand_landmarker/hand_landmarker';
import {HolisticLandmarker as HolisticLandmarkerImpl} from '../../../tasks/web/vision/holistic_landmarker/holistic_landmarker';
import {ImageClassifier as ImageClassifierImpl} from '../../../tasks/web/vision/image_classifier/image_classifier';
import {ImageEmbedder as ImageEmbedderImpl} from '../../../tasks/web/vision/image_embedder/image_embedder';
*/
const image_segmenter_1 = image_segmenter;
/*
import {InteractiveSegmenter as InteractiveSegmenterImpl} from '../../../tasks/web/vision/interactive_segmenter/interactive_segmenter';
import {ObjectDetector as ObjectDetectorImpl} from '../../../tasks/web/vision/object_detector/object_detector';
import {PoseLandmarker as PoseLandmarkerImpl} from '../../../tasks/web/vision/pose_landmarker/pose_landmarker';
*/
// Declare the variables locally so that Rollup in OSS includes them explicitly
// as exports.
const DrawingUtils = drawing_utils_1.DrawingUtils;
var DrawingUtils_1 = vision.DrawingUtils = DrawingUtils;
const FilesetResolver = fileset_resolver_1.FilesetResolver;
var FilesetResolver_1 = vision.FilesetResolver = FilesetResolver;
const MPImage = image_1.MPImage;
var MPImage_1 = vision.MPImage = MPImage;
const MPMask = mask_1.MPMask;
var MPMask_1 = vision.MPMask = MPMask;
/*
const FaceDetector = FaceDetectorImpl;
const FaceLandmarker = FaceLandmarkerImpl;
const FaceStylizer = FaceStylizerImpl;
const GestureRecognizer = GestureRecognizerImpl;
const HandLandmarker = HandLandmarkerImpl;
const HolisticLandmarker = HolisticLandmarkerImpl;
const ImageClassifier = ImageClassifierImpl;
const ImageEmbedder = ImageEmbedderImpl;
*/
const ImageSegmenter = image_segmenter_1.ImageSegmenter;
ImageSegmenter_1 = vision.ImageSegmenter = ImageSegmenter;

export { DrawingUtils_1 as DrawingUtils, FilesetResolver_1 as FilesetResolver, ImageSegmenter_1 as ImageSegmenter, MPImage_1 as MPImage, MPMask_1 as MPMask, vision as default };
//# sourceMappingURL=vision_bundle_mjs.js.map
