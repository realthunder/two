// Copyright 2010 The Emscripten Authors.  All rights reserved.
// Emscripten is available under two separate licenses, the MIT license and the
// University of Illinois/NCSA Open Source License.  Both these licenses can be
// found in the LICENSE file.

// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Module !== 'undefined' ? Module : {};

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)

  if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
    Module.finishedDataFileDownloads = 0;
  }
  Module.expectedDataFileDownloads++;
  (function() {
   var loadPackage = function(metadata) {
  
      var PACKAGE_PATH;
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
      } else if (typeof location !== 'undefined') {
        // worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
      } else {
        throw 'using preloaded data can only be done on a web page or in a web worker';
      }
      var PACKAGE_NAME = '../../../asmjs/bin/assets.data';
      var REMOTE_PACKAGE_BASE = 'assets.data';
      if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
        Module['locateFile'] = Module['locateFilePackage'];
        err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
      }
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
    
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];
      var PACKAGE_UUID = metadata['package_uuid'];
    
      function fetchRemotePackage(packageName, packageSize, callback, errback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', packageName, true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = function(event) {
          var url = packageName;
          var size = packageSize;
          if (event.total) size = event.total;
          if (event.loaded) {
            if (!xhr.addedTotal) {
              xhr.addedTotal = true;
              if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
              Module.dataFileDownloads[url] = {
                loaded: event.loaded,
                total: size
              };
            } else {
              Module.dataFileDownloads[url].loaded = event.loaded;
            }
            var total = 0;
            var loaded = 0;
            var num = 0;
            for (var download in Module.dataFileDownloads) {
            var data = Module.dataFileDownloads[download];
              total += data.total;
              loaded += data.loaded;
              num++;
            }
            total = Math.ceil(total * Module.expectedDataFileDownloads/num);
            if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
          } else if (!Module.dataFileDownloads) {
            if (Module['setStatus']) Module['setStatus']('Downloading data...');
          }
        };
        xhr.onerror = function(event) {
          throw new Error("NetworkError for: " + packageName);
        }
        xhr.onload = function(event) {
          if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            var packageData = xhr.response;
            callback(packageData);
          } else {
            throw new Error(xhr.statusText + " : " + xhr.responseURL);
          }
        };
        xhr.send(null);
      };

      function handleError(error) {
        console.error('package error:', error);
      };
    
        var fetchedCallback = null;
        var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

        if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
          if (fetchedCallback) {
            fetchedCallback(data);
            fetchedCallback = null;
          } else {
            fetched = data;
          }
        }, handleError);
      
    function runWithFS() {
  
      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }
  Module['FS_createPath']('/', 'temp', true, true);
Module['FS_createPath']('/', 'text', true, true);
Module['FS_createPath']('/', 'font', true, true);
Module['FS_createPath']('/', 'shaders', true, true);
Module['FS_createPath']('/shaders', 'dx11', true, true);
Module['FS_createPath']('/shaders', 'glsl', true, true);
Module['FS_createPath']('/shaders', 'metal', true, true);
Module['FS_createPath']('/shaders', 'dx9', true, true);
Module['FS_createPath']('/shaders', 'essl', true, true);
Module['FS_createPath']('/shaders', 'spirv', true, true);
Module['FS_createPath']('/shaders', 'pssl', true, true);
Module['FS_createPath']('/', 'meshes', true, true);
Module['FS_createPath']('/', 'textures', true, true);
Module['FS_createPath']('/', 'images', true, true);

      function DataRequest(start, end, audio) {
        this.start = start;
        this.end = end;
        this.audio = audio;
      }
      DataRequest.prototype = {
        requests: {},
        open: function(mode, name) {
          this.name = name;
          this.requests[name] = this;
          Module['addRunDependency']('fp ' + this.name);
        },
        send: function() {},
        onload: function() {
          var byteArray = this.byteArray.subarray(this.start, this.end);
          this.finish(byteArray);
        },
        finish: function(byteArray) {
          var that = this;
  
          Module['FS_createDataFile'](this.name, null, byteArray, true, true, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
          Module['removeRunDependency']('fp ' + that.name);
  
          this.requests[this.name] = null;
        }
      };
  
          var files = metadata['files'];
          for (var i = 0; i < files.length; ++i) {
            new DataRequest(files[i]['start'], files[i]['end'], files[i]['audio']).open('GET', files[i]['filename']);
          }
  
    
      function processPackageData(arrayBuffer) {
        Module.finishedDataFileDownloads++;
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        
          // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though
          // (we may be allocating before malloc is ready, during startup).
          var ptr = Module['getMemory'](byteArray.length);
          Module['HEAPU8'].set(byteArray, ptr);
          DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
    
            var files = metadata['files'];
            for (var i = 0; i < files.length; ++i) {
              DataRequest.prototype.requests[files[i].filename].onload();
            }
                Module['removeRunDependency']('datafile_../../../asmjs/bin/assets.data');

      };
      Module['addRunDependency']('datafile_../../../asmjs/bin/assets.data');
    
      if (!Module.preloadResults) Module.preloadResults = {};
    
        Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
        if (fetched) {
          processPackageData(fetched);
          fetched = null;
        } else {
          fetchedCallback = processPackageData;
        }
      
    }
    if (Module['calledRun']) {
      runWithFS();
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
    }
  
   }
   loadPackage({"files": [{"start": 0, "audio": 0, "end": 1429, "filename": "/ios-info.plist"}, {"start": 1429, "audio": 0, "end": 1453, "filename": "/.gitignore"}, {"start": 1453, "audio": 0, "end": 48293, "filename": "/gamecontrollerdb.txt"}, {"start": 48293, "audio": 0, "end": 49214, "filename": "/osx-info.plist"}, {"start": 49214, "audio": 0, "end": 50072, "filename": "/tvos-info.plist"}, {"start": 50072, "audio": 0, "end": 50075, "filename": "/temp/.gitignore"}, {"start": 50075, "audio": 0, "end": 96916, "filename": "/text/sherlock_holmes_a_scandal_in_bohemia_arthur_conan_doyle.txt"}, {"start": 96916, "audio": 0, "end": 198948, "filename": "/font/mias_scribblings.ttf"}, {"start": 198948, "audio": 0, "end": 344296, "filename": "/font/roboto-regular.ttf"}, {"start": 344296, "audio": 0, "end": 457796, "filename": "/font/robotomono-regular.ttf"}, {"start": 457796, "audio": 0, "end": 574868, "filename": "/font/droidsansmono.ttf"}, {"start": 574868, "audio": 0, "end": 764912, "filename": "/font/droidsans.ttf"}, {"start": 764912, "audio": 0, "end": 811096, "filename": "/font/kenney-icon-font.ttf"}, {"start": 811096, "audio": 0, "end": 857908, "filename": "/font/chp-fire.ttf"}, {"start": 857908, "audio": 0, "end": 984408, "filename": "/font/ruritania.ttf"}, {"start": 984408, "audio": 0, "end": 1125540, "filename": "/font/signika-regular.ttf"}, {"start": 1125540, "audio": 0, "end": 1291764, "filename": "/font/special_elite.ttf"}, {"start": 1291764, "audio": 0, "end": 1327156, "filename": "/font/entypo.ttf"}, {"start": 1327156, "audio": 0, "end": 1476052, "filename": "/font/bleeding_cowboys.ttf"}, {"start": 1476052, "audio": 0, "end": 1641600, "filename": "/font/fontawesome-webfont.ttf"}, {"start": 1641600, "audio": 0, "end": 2060404, "filename": "/font/NotoEmoji-Regular.ttf"}, {"start": 2060404, "audio": 0, "end": 2196224, "filename": "/font/roboto-bold.ttf"}, {"start": 2196224, "audio": 0, "end": 2223380, "filename": "/font/five_minutes.otf"}, {"start": 2223380, "audio": 0, "end": 2250932, "filename": "/font/visitor1.ttf"}, {"start": 2250932, "audio": 0, "end": 2251959, "filename": "/shaders/dx11/vs_wf_mesh.bin"}, {"start": 2251959, "audio": 0, "end": 2253183, "filename": "/shaders/dx11/cs_assao_non_smart_blur.bin"}, {"start": 2253183, "audio": 0, "end": 2254454, "filename": "/shaders/dx11/fs_hdr_blur.bin"}, {"start": 2254454, "audio": 0, "end": 2255544, "filename": "/shaders/dx11/vs_hdr_blur.bin"}, {"start": 2255544, "audio": 0, "end": 2255958, "filename": "/shaders/dx11/vs_shadowvolume_svfront.bin"}, {"start": 2255958, "audio": 0, "end": 2261091, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_hard_omni.bin"}, {"start": 2261091, "audio": 0, "end": 2261721, "filename": "/shaders/dx11/vs_vectordisplay_fb.bin"}, {"start": 2261721, "audio": 0, "end": 2264018, "filename": "/shaders/dx11/fs_stencil_color_lighting.bin"}, {"start": 2264018, "audio": 0, "end": 2266516, "filename": "/shaders/dx11/fs_stencil_texture_lighting.bin"}, {"start": 2266516, "audio": 0, "end": 2267566, "filename": "/shaders/dx11/fs_sky.bin"}, {"start": 2267566, "audio": 0, "end": 2268147, "filename": "/shaders/dx11/cs_terrain_update_draw.bin"}, {"start": 2268147, "audio": 0, "end": 2268851, "filename": "/shaders/dx11/fs_oit_wb.bin"}, {"start": 2268851, "audio": 0, "end": 2269296, "filename": "/shaders/dx11/fs_assao_gbuffer.bin"}, {"start": 2269296, "audio": 0, "end": 2269796, "filename": "/shaders/dx11/fs_albedo_output.bin"}, {"start": 2269796, "audio": 0, "end": 2270324, "filename": "/shaders/dx11/vs_shadowmaps_unpackdepth.bin"}, {"start": 2270324, "audio": 0, "end": 2272640, "filename": "/shaders/dx11/vs_shadowmaps_color_lighting_linear_csm.bin"}, {"start": 2272640, "audio": 0, "end": 2273771, "filename": "/shaders/dx11/vs_rsm_lbuffer.bin"}, {"start": 2273771, "audio": 0, "end": 2274493, "filename": "/shaders/dx11/vs_callback.bin"}, {"start": 2274493, "audio": 0, "end": 2274995, "filename": "/shaders/dx11/vs_shadowmaps_packdepth.bin"}, {"start": 2274995, "audio": 0, "end": 2275322, "filename": "/shaders/dx11/fs_rsm_shadow.bin"}, {"start": 2275322, "audio": 0, "end": 2275560, "filename": "/shaders/dx11/fs_sms_shadow.bin"}, {"start": 2275560, "audio": 0, "end": 2278812, "filename": "/shaders/dx11/cs_gdr_stream_compaction.bin"}, {"start": 2278812, "audio": 0, "end": 2280208, "filename": "/shaders/dx11/cs_assao_smart_blur.bin"}, {"start": 2280208, "audio": 0, "end": 2280977, "filename": "/shaders/dx11/vs_wf_wireframe.bin"}, {"start": 2280977, "audio": 0, "end": 2281335, "filename": "/shaders/dx11/fs_shadowvolume_svfronttex1.bin"}, {"start": 2281335, "audio": 0, "end": 2282251, "filename": "/shaders/dx11/vs_stencil_color_lighting.bin"}, {"start": 2282251, "audio": 0, "end": 2282895, "filename": "/shaders/dx11/fs_oit_wb_separate.bin"}, {"start": 2282895, "audio": 0, "end": 2283423, "filename": "/shaders/dx11/vs_rsm_combine.bin"}, {"start": 2283423, "audio": 0, "end": 2283910, "filename": "/shaders/dx11/fs_sms_shadow_pd.bin"}, {"start": 2283910, "audio": 0, "end": 2289910, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_hard_linear_csm.bin"}, {"start": 2289910, "audio": 0, "end": 2292137, "filename": "/shaders/dx11/vs_shadowmaps_color_lighting_linear_omni.bin"}, {"start": 2292137, "audio": 0, "end": 2292407, "filename": "/shaders/dx11/fs_deferred_debug_line.bin"}, {"start": 2292407, "audio": 0, "end": 2293933, "filename": "/shaders/dx11/fs_upsample.bin"}, {"start": 2293933, "audio": 0, "end": 2294344, "filename": "/shaders/dx11/fs_update_cmp.bin"}, {"start": 2294344, "audio": 0, "end": 2296609, "filename": "/shaders/dx11/fs_shadowmaps_hblur_vsm.bin"}, {"start": 2296609, "audio": 0, "end": 2297250, "filename": "/shaders/dx11/fs_shadowvolume_color_texture.bin"}, {"start": 2297250, "audio": 0, "end": 2298014, "filename": "/shaders/dx11/cs_assao_non_smart_half_apply.bin"}, {"start": 2298014, "audio": 0, "end": 2302931, "filename": "/shaders/dx11/cs_assao_prepare_depths_and_normals_half.bin"}, {"start": 2302931, "audio": 0, "end": 2303429, "filename": "/shaders/dx11/fs_vectordisplay_blit.bin"}, {"start": 2303429, "audio": 0, "end": 2304286, "filename": "/shaders/dx11/vs_instancing.bin"}, {"start": 2304286, "audio": 0, "end": 2311422, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_vsm_linear_csm.bin"}, {"start": 2311422, "audio": 0, "end": 2312224, "filename": "/shaders/dx11/fs_callback.bin"}, {"start": 2312224, "audio": 0, "end": 2312770, "filename": "/shaders/dx11/fs_oit_wb_blit.bin"}, {"start": 2312770, "audio": 0, "end": 2314328, "filename": "/shaders/dx11/fs_vectordisplay_blur.bin"}, {"start": 2314328, "audio": 0, "end": 2321610, "filename": "/shaders/dx11/cs_assao_generate_q2.bin"}, {"start": 2321610, "audio": 0, "end": 2323277, "filename": "/shaders/dx11/fs_mesh.bin"}, {"start": 2323277, "audio": 0, "end": 2323674, "filename": "/shaders/dx11/fs_picking_id.bin"}, {"start": 2323674, "audio": 0, "end": 2324202, "filename": "/shaders/dx11/vs_deferred_light.bin"}, {"start": 2324202, "audio": 0, "end": 2325767, "filename": "/shaders/dx11/fs_wf_mesh.bin"}, {"start": 2325767, "audio": 0, "end": 2326567, "filename": "/shaders/dx11/vs_sky_landscape.bin"}, {"start": 2326567, "audio": 0, "end": 2327477, "filename": "/shaders/dx11/cs_gdr_downscale_hi_z.bin"}, {"start": 2327477, "audio": 0, "end": 2327757, "filename": "/shaders/dx11/fs_shadowvolume_svbackcolor.bin"}, {"start": 2327757, "audio": 0, "end": 2331323, "filename": "/shaders/dx11/fs_rsm_combine.bin"}, {"start": 2331323, "audio": 0, "end": 2331936, "filename": "/shaders/dx11/fs_particle.bin"}, {"start": 2331936, "audio": 0, "end": 2332577, "filename": "/shaders/dx11/fs_stencil_color_texture.bin"}, {"start": 2332577, "audio": 0, "end": 2333670, "filename": "/shaders/dx11/vs_gdr_instanced_indirect_rendering.bin"}, {"start": 2333670, "audio": 0, "end": 2341698, "filename": "/shaders/dx11/cs_assao_generate_q3.bin"}, {"start": 2341698, "audio": 0, "end": 2342766, "filename": "/shaders/dx11/vs_tree.bin"}, {"start": 2342766, "audio": 0, "end": 2350600, "filename": "/shaders/dx11/cs_terrain_lod.bin"}, {"start": 2350600, "audio": 0, "end": 2351554, "filename": "/shaders/dx11/vs_hdr_mesh.bin"}, {"start": 2351554, "audio": 0, "end": 2352713, "filename": "/shaders/dx11/vs_shadowmaps_vblur.bin"}, {"start": 2352713, "audio": 0, "end": 2354762, "filename": "/shaders/dx11/fs_cubes.bin.h"}, {"start": 2354762, "audio": 0, "end": 2355493, "filename": "/shaders/dx11/fs_deferred_combine.bin"}, {"start": 2355493, "audio": 0, "end": 2362069, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_esm_csm.bin"}, {"start": 2362069, "audio": 0, "end": 2369476, "filename": "/shaders/dx11/fs_pom.bin"}, {"start": 2369476, "audio": 0, "end": 2370288, "filename": "/shaders/dx11/vs_oit.bin"}, {"start": 2370288, "audio": 0, "end": 2370952, "filename": "/shaders/dx11/fs_gdr_instanced_indirect_rendering.bin"}, {"start": 2370952, "audio": 0, "end": 2371190, "filename": "/shaders/dx11/fs_shadowvolume_svbackblank.bin"}, {"start": 2371190, "audio": 0, "end": 2373060, "filename": "/shaders/dx11/vs_bump.bin"}, {"start": 2373060, "audio": 0, "end": 2374028, "filename": "/shaders/dx11/fs_assao_deferred_combine.bin"}, {"start": 2374028, "audio": 0, "end": 2377540, "filename": "/shaders/dx11/fs_ibl_mesh.bin"}, {"start": 2377540, "audio": 0, "end": 2378068, "filename": "/shaders/dx11/vs_fullscreen.bin"}, {"start": 2378068, "audio": 0, "end": 2379553, "filename": "/shaders/dx11/fs_deferred_geom.bin"}, {"start": 2379553, "audio": 0, "end": 2381651, "filename": "/shaders/dx11/vs_deferred_geom.bin"}, {"start": 2381651, "audio": 0, "end": 2382607, "filename": "/shaders/dx11/cs_assao_non_smart_apply.bin"}, {"start": 2382607, "audio": 0, "end": 2385082, "filename": "/shaders/dx11/fs_shadowvolume_color_lighting.bin"}, {"start": 2385082, "audio": 0, "end": 2391546, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_esm_linear_csm.bin"}, {"start": 2391546, "audio": 0, "end": 2392753, "filename": "/shaders/dx11/vs_shadowmaps_color_lighting.bin"}, {"start": 2392753, "audio": 0, "end": 2396316, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_esm_linear.bin"}, {"start": 2396316, "audio": 0, "end": 2399907, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_esm.bin"}, {"start": 2399907, "audio": 0, "end": 2403382, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_hard.bin"}, {"start": 2403382, "audio": 0, "end": 2404366, "filename": "/shaders/dx11/vs_shadowmaps_texture_lighting.bin"}, {"start": 2404366, "audio": 0, "end": 2404840, "filename": "/shaders/dx11/fs_shadowvolume_svside.bin"}, {"start": 2404840, "audio": 0, "end": 2405254, "filename": "/shaders/dx11/vs_sms_shadow.bin"}, {"start": 2405254, "audio": 0, "end": 2405562, "filename": "/shaders/dx11/fs_shadowvolume_svsidecolor.bin"}, {"start": 2405562, "audio": 0, "end": 2407338, "filename": "/shaders/dx11/fs_sky_landscape.bin"}, {"start": 2407338, "audio": 0, "end": 2409218, "filename": "/shaders/dx11/vs_pom.bin"}, {"start": 2409218, "audio": 0, "end": 2409738, "filename": "/shaders/dx11/vs_cubes.bin"}, {"start": 2409738, "audio": 0, "end": 2410560, "filename": "/shaders/dx11/vs_rsm_gbuffer.bin"}, {"start": 2410560, "audio": 0, "end": 2410903, "filename": "/shaders/dx11/fs_shadowmaps_texture.bin"}, {"start": 2410903, "audio": 0, "end": 2412346, "filename": "/shaders/dx11/vs_mesh.bin"}, {"start": 2412346, "audio": 0, "end": 2412689, "filename": "/shaders/dx11/fs_deferred_debug.bin"}, {"start": 2412689, "audio": 0, "end": 2413217, "filename": "/shaders/dx11/vs_oit_blit.bin"}, {"start": 2413217, "audio": 0, "end": 2414033, "filename": "/shaders/dx11/vs_ibl_skybox.bin"}, {"start": 2414033, "audio": 0, "end": 2426089, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_pcf.bin"}, {"start": 2426089, "audio": 0, "end": 2429160, "filename": "/shaders/dx11/vs_sky.bin"}, {"start": 2429160, "audio": 0, "end": 2432382, "filename": "/shaders/dx11/fs_hdr_lumavg.bin"}, {"start": 2432382, "audio": 0, "end": 2434538, "filename": "/shaders/dx11/vs_shadowmaps_color_lighting_csm.bin"}, {"start": 2434538, "audio": 0, "end": 2444553, "filename": "/shaders/dx11/fs_raymarching.bin"}, {"start": 2444553, "audio": 0, "end": 2445073, "filename": "/shaders/dx11/vs_deferred_debug_line.bin"}, {"start": 2445073, "audio": 0, "end": 2445431, "filename": "/shaders/dx11/fs_shadowvolume_svbacktex1.bin"}, {"start": 2445431, "audio": 0, "end": 2446469, "filename": "/shaders/dx11/vs_hdr_tonemap.bin"}, {"start": 2446469, "audio": 0, "end": 2446997, "filename": "/shaders/dx11/vs_stencil_color_texture.bin"}, {"start": 2446997, "audio": 0, "end": 2448244, "filename": "/shaders/dx11/vs_shadowmaps_color_lighting_linear.bin"}, {"start": 2448244, "audio": 0, "end": 2448945, "filename": "/shaders/dx11/vs_gdr_render_occlusion.bin"}, {"start": 2448945, "audio": 0, "end": 2449469, "filename": "/shaders/dx11/vs_assao.bin"}, {"start": 2449469, "audio": 0, "end": 2451269, "filename": "/shaders/dx11/vs_bump_instanced.bin"}, {"start": 2451269, "audio": 0, "end": 2452382, "filename": "/shaders/dx11/vs_albedo_output.bin"}, {"start": 2452382, "audio": 0, "end": 2452961, "filename": "/shaders/dx11/fs_shadowvolume_svsidetex.bin"}, {"start": 2452961, "audio": 0, "end": 2453319, "filename": "/shaders/dx11/fs_shadowvolume_svbacktex2.bin"}, {"start": 2453319, "audio": 0, "end": 2453599, "filename": "/shaders/dx11/fs_shadowvolume_svfrontcolor.bin"}, {"start": 2453599, "audio": 0, "end": 2457306, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_vsm_linear.bin"}, {"start": 2457306, "audio": 0, "end": 2458252, "filename": "/shaders/dx11/vs_shadowvolume_color_lighting.bin"}, {"start": 2458252, "audio": 0, "end": 2459095, "filename": "/shaders/dx11/cs_assao_postprocess_importance_map_a.bin"}, {"start": 2459095, "audio": 0, "end": 2459540, "filename": "/shaders/dx11/cs_indirect.bin"}, {"start": 2459540, "audio": 0, "end": 2459778, "filename": "/shaders/dx11/fs_stencil_color_black.bin"}, {"start": 2459778, "audio": 0, "end": 2460216, "filename": "/shaders/dx11/fs_shadowmaps_packdepth.bin"}, {"start": 2460216, "audio": 0, "end": 2462283, "filename": "/shaders/dx11/vs_shadowmaps_color_lighting_omni.bin"}, {"start": 2462283, "audio": 0, "end": 2467254, "filename": "/shaders/dx11/cs_gdr_occlude_props.bin"}, {"start": 2467254, "audio": 0, "end": 2467858, "filename": "/shaders/dx11/vs_shadowvolume_svback.bin"}, {"start": 2467858, "audio": 0, "end": 2469017, "filename": "/shaders/dx11/vs_shadowmaps_hblur.bin"}, {"start": 2469017, "audio": 0, "end": 2470922, "filename": "/shaders/dx11/fs_shadowmaps_vblur.bin"}, {"start": 2470922, "audio": 0, "end": 2474440, "filename": "/shaders/dx11/cs_assao_generate_q0.bin"}, {"start": 2474440, "audio": 0, "end": 2474798, "filename": "/shaders/dx11/fs_shadowvolume_svfronttex2.bin"}, {"start": 2474798, "audio": 0, "end": 2475326, "filename": "/shaders/dx11/vs_hdr_bright.bin"}, {"start": 2475326, "audio": 0, "end": 2476731, "filename": "/shaders/dx11/fs_deferred_light.bin"}, {"start": 2476731, "audio": 0, "end": 2477248, "filename": "/shaders/dx11/fs_shadowmaps_unpackdepth.bin"}, {"start": 2477248, "audio": 0, "end": 2478970, "filename": "/shaders/dx11/fs_sky_color_banding_fix.bin"}, {"start": 2478970, "audio": 0, "end": 2482784, "filename": "/shaders/dx11/vs_cubes.bin.h"}, {"start": 2482784, "audio": 0, "end": 2484851, "filename": "/shaders/dx11/cs_assao_generate_importance_map.bin"}, {"start": 2484851, "audio": 0, "end": 2485357, "filename": "/shaders/dx11/fs_shadowmaps_packdepth_vsm_linear.bin"}, {"start": 2485357, "audio": 0, "end": 2485771, "filename": "/shaders/dx11/vs_shadowmaps_color.bin"}, {"start": 2485771, "audio": 0, "end": 2486697, "filename": "/shaders/dx11/fs_vt_mip.bin"}, {"start": 2486697, "audio": 0, "end": 2487225, "filename": "/shaders/dx11/vs_shadowmaps_color_texture.bin"}, {"start": 2487225, "audio": 0, "end": 2487727, "filename": "/shaders/dx11/fs_vectordisplay_fb.bin"}, {"start": 2487727, "audio": 0, "end": 2490293, "filename": "/shaders/dx11/fs_hdr_lum.bin"}, {"start": 2490293, "audio": 0, "end": 2490795, "filename": "/shaders/dx11/vs_sms_shadow_pd.bin"}, {"start": 2490795, "audio": 0, "end": 2501783, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_pcf_linear.bin"}, {"start": 2501783, "audio": 0, "end": 2502345, "filename": "/shaders/dx11/fs_terrain_render.bin"}, {"start": 2502345, "audio": 0, "end": 2503962, "filename": "/shaders/dx11/cs_update_instances.bin"}, {"start": 2503962, "audio": 0, "end": 2504780, "filename": "/shaders/dx11/fs_hdr_skybox.bin"}, {"start": 2504780, "audio": 0, "end": 2505554, "filename": "/shaders/dx11/vs_shadowvolume_svside.bin"}, {"start": 2505554, "audio": 0, "end": 2514051, "filename": "/shaders/dx11/cs_assao_prepare_depths_and_normals.bin"}, {"start": 2514051, "audio": 0, "end": 2514579, "filename": "/shaders/dx11/vs_update.bin"}, {"start": 2514579, "audio": 0, "end": 2516583, "filename": "/shaders/dx11/fs_downsample.bin"}, {"start": 2516583, "audio": 0, "end": 2516925, "filename": "/shaders/dx11/fs_update.bin"}, {"start": 2516925, "audio": 0, "end": 2517339, "filename": "/shaders/dx11/vs_stencil_color.bin"}, {"start": 2517339, "audio": 0, "end": 2523329, "filename": "/shaders/dx11/cs_assao_generate_q1.bin"}, {"start": 2523329, "audio": 0, "end": 2524281, "filename": "/shaders/dx11/vs_assao_gbuffer.bin"}, {"start": 2524281, "audio": 0, "end": 2524844, "filename": "/shaders/dx11/fs_bloom_combine.bin"}, {"start": 2524844, "audio": 0, "end": 2525418, "filename": "/shaders/dx11/fs_terrain_render_normal.bin"}, {"start": 2525418, "audio": 0, "end": 2525964, "filename": "/shaders/dx11/fs_oit_wb_separate_blit.bin"}, {"start": 2525964, "audio": 0, "end": 2527854, "filename": "/shaders/dx11/fs_hdr_mesh.bin"}, {"start": 2527854, "audio": 0, "end": 2529106, "filename": "/shaders/dx11/fs_rsm_lbuffer.bin"}, {"start": 2529106, "audio": 0, "end": 2532537, "filename": "/shaders/dx11/fs_bump.bin"}, {"start": 2532537, "audio": 0, "end": 2533303, "filename": "/shaders/dx11/vs_rsm_shadow.bin"}, {"start": 2533303, "audio": 0, "end": 2538408, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_hard_linear_omni.bin"}, {"start": 2538408, "audio": 0, "end": 2539463, "filename": "/shaders/dx11/vs_picking_shaded.bin"}, {"start": 2539463, "audio": 0, "end": 2542089, "filename": "/shaders/dx11/fs_hdr_tonemap.bin"}, {"start": 2542089, "audio": 0, "end": 2543306, "filename": "/shaders/dx11/cs_assao_prepare_depths.bin"}, {"start": 2543306, "audio": 0, "end": 2543728, "filename": "/shaders/dx11/cs_gdr_copy_z.bin"}, {"start": 2543728, "audio": 0, "end": 2556302, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_pcf_linear_omni.bin"}, {"start": 2556302, "audio": 0, "end": 2556681, "filename": "/shaders/dx11/fs_rsm_gbuffer.bin"}, {"start": 2556681, "audio": 0, "end": 2556995, "filename": "/shaders/dx11/fs_deferred_clear_uav.bin"}, {"start": 2556995, "audio": 0, "end": 2557784, "filename": "/shaders/dx11/cs_assao_prepare_depths_half.bin"}, {"start": 2557784, "audio": 0, "end": 2558831, "filename": "/shaders/dx11/cs_assao_postprocess_importance_map_b.bin"}, {"start": 2558831, "audio": 0, "end": 2559359, "filename": "/shaders/dx11/vs_shadowvolume_color_texture.bin"}, {"start": 2559359, "audio": 0, "end": 2563129, "filename": "/shaders/dx11/cs_assao_generate_q3base.bin"}, {"start": 2563129, "audio": 0, "end": 2566423, "filename": "/shaders/dx11/cs_assao_prepare_depth_mip.bin"}, {"start": 2566423, "audio": 0, "end": 2566689, "filename": "/shaders/dx11/fs_shadowvolume_svsideblank.bin"}, {"start": 2566689, "audio": 0, "end": 2569230, "filename": "/shaders/dx11/fs_hdr_bright.bin"}, {"start": 2569230, "audio": 0, "end": 2571135, "filename": "/shaders/dx11/fs_shadowmaps_hblur.bin"}, {"start": 2571135, "audio": 0, "end": 2576356, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_esm_linear_omni.bin"}, {"start": 2576356, "audio": 0, "end": 2576652, "filename": "/shaders/dx11/fs_oit.bin"}, {"start": 2576652, "audio": 0, "end": 2580099, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_hard_linear.bin"}, {"start": 2580099, "audio": 0, "end": 2581328, "filename": "/shaders/dx11/fs_vt_unlit.bin"}, {"start": 2581328, "audio": 0, "end": 2581856, "filename": "/shaders/dx11/vs_hdr_skybox.bin"}, {"start": 2581856, "audio": 0, "end": 2584121, "filename": "/shaders/dx11/fs_shadowmaps_vblur_vsm.bin"}, {"start": 2584121, "audio": 0, "end": 2585320, "filename": "/shaders/dx11/vs_sms_mesh.bin"}, {"start": 2585320, "audio": 0, "end": 2586111, "filename": "/shaders/dx11/cs_update.bin"}, {"start": 2586111, "audio": 0, "end": 2586639, "filename": "/shaders/dx11/vs_shadowvolume_texture.bin"}, {"start": 2586639, "audio": 0, "end": 2587269, "filename": "/shaders/dx11/vs_raymarching.bin"}, {"start": 2587269, "audio": 0, "end": 2588790, "filename": "/shaders/dx11/fs_deferred_light_uav.bin"}, {"start": 2588790, "audio": 0, "end": 2589133, "filename": "/shaders/dx11/fs_shadowvolume_texture.bin"}, {"start": 2589133, "audio": 0, "end": 2589661, "filename": "/shaders/dx11/vs_hdr_lum.bin"}, {"start": 2589661, "audio": 0, "end": 2590558, "filename": "/shaders/dx11/fs_wf_wireframe.bin"}, {"start": 2590558, "audio": 0, "end": 2591082, "filename": "/shaders/dx11/fs_update_3d.bin"}, {"start": 2591082, "audio": 0, "end": 2593444, "filename": "/shaders/dx11/vs_terrain_render.bin"}, {"start": 2593444, "audio": 0, "end": 2593858, "filename": "/shaders/dx11/vs_shadowmaps_depth.bin"}, {"start": 2593858, "audio": 0, "end": 2594783, "filename": "/shaders/dx11/vs_ibl_mesh.bin"}, {"start": 2594783, "audio": 0, "end": 2595126, "filename": "/shaders/dx11/fs_stencil_texture.bin"}, {"start": 2595126, "audio": 0, "end": 2595636, "filename": "/shaders/dx11/vs_shadowmaps_packdepth_linear.bin"}, {"start": 2595636, "audio": 0, "end": 2596164, "filename": "/shaders/dx11/vs_deferred_combine.bin"}, {"start": 2596164, "audio": 0, "end": 2596434, "filename": "/shaders/dx11/fs_cubes.bin"}, {"start": 2596434, "audio": 0, "end": 2601799, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_vsm_linear_omni.bin"}, {"start": 2601799, "audio": 0, "end": 2602037, "filename": "/shaders/dx11/fs_shadowvolume_svfrontblank.bin"}, {"start": 2602037, "audio": 0, "end": 2602615, "filename": "/shaders/dx11/fs_shadowmaps_packdepth_vsm.bin"}, {"start": 2602615, "audio": 0, "end": 2603349, "filename": "/shaders/dx11/vs_terrain_height_texture.bin"}, {"start": 2603349, "audio": 0, "end": 2603877, "filename": "/shaders/dx11/vs_hdr_lumavg.bin"}, {"start": 2603877, "audio": 0, "end": 2605322, "filename": "/shaders/dx11/fs_deferred_light_ta.bin"}, {"start": 2605322, "audio": 0, "end": 2607426, "filename": "/shaders/dx11/cs_assao_smart_blur_wide.bin"}, {"start": 2607426, "audio": 0, "end": 2613195, "filename": "/shaders/dx11/fs_sms_mesh_pd.bin"}, {"start": 2613195, "audio": 0, "end": 2615347, "filename": "/shaders/dx11/cs_assao_apply.bin"}, {"start": 2615347, "audio": 0, "end": 2616331, "filename": "/shaders/dx11/vs_shadowvolume_texture_lighting.bin"}, {"start": 2616331, "audio": 0, "end": 2617541, "filename": "/shaders/dx11/fs_picking_shaded.bin"}, {"start": 2617541, "audio": 0, "end": 2624314, "filename": "/shaders/dx11/cs_init_instances.bin"}, {"start": 2624314, "audio": 0, "end": 2626976, "filename": "/shaders/dx11/fs_shadowvolume_texture_lighting.bin"}, {"start": 2626976, "audio": 0, "end": 2632225, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_esm_omni.bin"}, {"start": 2632225, "audio": 0, "end": 2632753, "filename": "/shaders/dx11/vs_shadowmaps_texture.bin"}, {"start": 2632753, "audio": 0, "end": 2633119, "filename": "/shaders/dx11/fs_shadowmaps_packdepth_linear.bin"}, {"start": 2633119, "audio": 0, "end": 2637496, "filename": "/shaders/dx11/fs_sms_mesh.bin"}, {"start": 2637496, "audio": 0, "end": 2651158, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_pcf_omni.bin"}, {"start": 2651158, "audio": 0, "end": 2651742, "filename": "/shaders/dx11/vs_terrain.bin"}, {"start": 2651742, "audio": 0, "end": 2653099, "filename": "/shaders/dx11/cs_terrain_init.bin"}, {"start": 2653099, "audio": 0, "end": 2654538, "filename": "/shaders/dx11/fs_tree.bin"}, {"start": 2654538, "audio": 0, "end": 2655055, "filename": "/shaders/dx11/fs_shadowmaps_unpackdepth_vsm.bin"}, {"start": 2655055, "audio": 0, "end": 2655583, "filename": "/shaders/dx11/vs_stencil_texture.bin"}, {"start": 2655583, "audio": 0, "end": 2656264, "filename": "/shaders/dx11/vs_vt_generic.bin"}, {"start": 2656264, "audio": 0, "end": 2659999, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_vsm.bin"}, {"start": 2659999, "audio": 0, "end": 2665392, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_vsm_omni.bin"}, {"start": 2665392, "audio": 0, "end": 2665630, "filename": "/shaders/dx11/fs_shadowmaps_color_black.bin"}, {"start": 2665630, "audio": 0, "end": 2671742, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_hard_csm.bin"}, {"start": 2671742, "audio": 0, "end": 2678990, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_vsm_csm.bin"}, {"start": 2678990, "audio": 0, "end": 2679432, "filename": "/shaders/dx11/cs_terrain_update_indirect.bin"}, {"start": 2679432, "audio": 0, "end": 2679702, "filename": "/shaders/dx11/fs_instancing.bin"}, {"start": 2679702, "audio": 0, "end": 2680861, "filename": "/shaders/dx11/vs_particle.bin"}, {"start": 2680861, "audio": 0, "end": 2681067, "filename": "/shaders/dx11/cs_assao_load_counter_clear.bin"}, {"start": 2681067, "audio": 0, "end": 2682459, "filename": "/shaders/dx11/fs_ibl_skybox.bin"}, {"start": 2682459, "audio": 0, "end": 2682817, "filename": "/shaders/dx11/fs_terrain.bin"}, {"start": 2682817, "audio": 0, "end": 2683345, "filename": "/shaders/dx11/vs_deferred_debug.bin"}, {"start": 2683345, "audio": 0, "end": 2723938, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_pcf_csm.bin"}, {"start": 2723938, "audio": 0, "end": 2724579, "filename": "/shaders/dx11/fs_shadowmaps_color_texture.bin"}, {"start": 2724579, "audio": 0, "end": 2760816, "filename": "/shaders/dx11/fs_shadowmaps_color_lighting_pcf_linear_csm.bin"}, {"start": 2760816, "audio": 0, "end": 2761800, "filename": "/shaders/dx11/vs_stencil_texture_lighting.bin"}, {"start": 2761800, "audio": 0, "end": 2762489, "filename": "/shaders/glsl/vs_wf_mesh.bin"}, {"start": 2762489, "audio": 0, "end": 2764871, "filename": "/shaders/glsl/cs_assao_non_smart_blur.bin"}, {"start": 2764871, "audio": 0, "end": 2765799, "filename": "/shaders/glsl/fs_hdr_blur.bin"}, {"start": 2765799, "audio": 0, "end": 2767186, "filename": "/shaders/glsl/vs_hdr_blur.bin"}, {"start": 2767186, "audio": 0, "end": 2767414, "filename": "/shaders/glsl/vs_shadowvolume_svfront.bin"}, {"start": 2767414, "audio": 0, "end": 2774476, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_hard_omni.bin"}, {"start": 2774476, "audio": 0, "end": 2774858, "filename": "/shaders/glsl/vs_vectordisplay_fb.bin"}, {"start": 2774858, "audio": 0, "end": 2776982, "filename": "/shaders/glsl/fs_stencil_color_lighting.bin"}, {"start": 2776982, "audio": 0, "end": 2779364, "filename": "/shaders/glsl/fs_stencil_texture_lighting.bin"}, {"start": 2779364, "audio": 0, "end": 2780045, "filename": "/shaders/glsl/fs_sky.bin"}, {"start": 2780045, "audio": 0, "end": 2781938, "filename": "/shaders/glsl/cs_terrain_update_draw.bin"}, {"start": 2781938, "audio": 0, "end": 2782295, "filename": "/shaders/glsl/fs_oit_wb.bin"}, {"start": 2782295, "audio": 0, "end": 2782537, "filename": "/shaders/glsl/fs_assao_gbuffer.bin"}, {"start": 2782537, "audio": 0, "end": 2782666, "filename": "/shaders/glsl/fs_albedo_output.bin"}, {"start": 2782666, "audio": 0, "end": 2782977, "filename": "/shaders/glsl/vs_shadowmaps_unpackdepth.bin"}, {"start": 2782977, "audio": 0, "end": 2784591, "filename": "/shaders/glsl/vs_shadowmaps_color_lighting_linear_csm.bin"}, {"start": 2784591, "audio": 0, "end": 2785711, "filename": "/shaders/glsl/vs_rsm_lbuffer.bin"}, {"start": 2785711, "audio": 0, "end": 2786179, "filename": "/shaders/glsl/vs_callback.bin"}, {"start": 2786179, "audio": 0, "end": 2786460, "filename": "/shaders/glsl/vs_shadowmaps_packdepth.bin"}, {"start": 2786460, "audio": 0, "end": 2786625, "filename": "/shaders/glsl/fs_rsm_shadow.bin"}, {"start": 2786625, "audio": 0, "end": 2786786, "filename": "/shaders/glsl/fs_sms_shadow.bin"}, {"start": 2786786, "audio": 0, "end": 2790586, "filename": "/shaders/glsl/cs_gdr_stream_compaction.bin"}, {"start": 2790586, "audio": 0, "end": 2793827, "filename": "/shaders/glsl/cs_assao_smart_blur.bin"}, {"start": 2793827, "audio": 0, "end": 2794346, "filename": "/shaders/glsl/vs_wf_wireframe.bin"}, {"start": 2794346, "audio": 0, "end": 2794774, "filename": "/shaders/glsl/fs_shadowvolume_svfronttex1.bin"}, {"start": 2794774, "audio": 0, "end": 2795349, "filename": "/shaders/glsl/vs_stencil_color_lighting.bin"}, {"start": 2795349, "audio": 0, "end": 2795764, "filename": "/shaders/glsl/fs_oit_wb_separate.bin"}, {"start": 2795764, "audio": 0, "end": 2796075, "filename": "/shaders/glsl/vs_rsm_combine.bin"}, {"start": 2796075, "audio": 0, "end": 2796459, "filename": "/shaders/glsl/fs_sms_shadow_pd.bin"}, {"start": 2796459, "audio": 0, "end": 2805901, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_hard_linear_csm.bin"}, {"start": 2805901, "audio": 0, "end": 2807441, "filename": "/shaders/glsl/vs_shadowmaps_color_lighting_linear_omni.bin"}, {"start": 2807441, "audio": 0, "end": 2807528, "filename": "/shaders/glsl/fs_deferred_debug_line.bin"}, {"start": 2807528, "audio": 0, "end": 2809042, "filename": "/shaders/glsl/fs_upsample.bin"}, {"start": 2809042, "audio": 0, "end": 2809225, "filename": "/shaders/glsl/fs_update_cmp.bin"}, {"start": 2809225, "audio": 0, "end": 2811786, "filename": "/shaders/glsl/fs_shadowmaps_hblur_vsm.bin"}, {"start": 2811786, "audio": 0, "end": 2812392, "filename": "/shaders/glsl/fs_shadowvolume_color_texture.bin"}, {"start": 2812392, "audio": 0, "end": 2814307, "filename": "/shaders/glsl/cs_assao_non_smart_half_apply.bin"}, {"start": 2814307, "audio": 0, "end": 2821022, "filename": "/shaders/glsl/cs_assao_prepare_depths_and_normals_half.bin"}, {"start": 2821022, "audio": 0, "end": 2821377, "filename": "/shaders/glsl/fs_vectordisplay_blit.bin"}, {"start": 2821377, "audio": 0, "end": 2821917, "filename": "/shaders/glsl/vs_instancing.bin"}, {"start": 2821917, "audio": 0, "end": 2833809, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_vsm_linear_csm.bin"}, {"start": 2833809, "audio": 0, "end": 2834278, "filename": "/shaders/glsl/fs_callback.bin"}, {"start": 2834278, "audio": 0, "end": 2834677, "filename": "/shaders/glsl/fs_oit_wb_blit.bin"}, {"start": 2834677, "audio": 0, "end": 2836598, "filename": "/shaders/glsl/fs_vectordisplay_blur.bin"}, {"start": 2836598, "audio": 0, "end": 2851873, "filename": "/shaders/glsl/cs_assao_generate_q2.bin"}, {"start": 2851873, "audio": 0, "end": 2853224, "filename": "/shaders/glsl/fs_mesh.bin"}, {"start": 2853224, "audio": 0, "end": 2853346, "filename": "/shaders/glsl/fs_picking_id.bin"}, {"start": 2853346, "audio": 0, "end": 2853657, "filename": "/shaders/glsl/vs_deferred_light.bin"}, {"start": 2853657, "audio": 0, "end": 2855140, "filename": "/shaders/glsl/fs_wf_mesh.bin"}, {"start": 2855140, "audio": 0, "end": 2855665, "filename": "/shaders/glsl/vs_sky_landscape.bin"}, {"start": 2855665, "audio": 0, "end": 2857845, "filename": "/shaders/glsl/cs_gdr_downscale_hi_z.bin"}, {"start": 2857845, "audio": 0, "end": 2857977, "filename": "/shaders/glsl/fs_shadowvolume_svbackcolor.bin"}, {"start": 2857977, "audio": 0, "end": 2865546, "filename": "/shaders/glsl/fs_rsm_combine.bin"}, {"start": 2865546, "audio": 0, "end": 2865908, "filename": "/shaders/glsl/fs_particle.bin"}, {"start": 2865908, "audio": 0, "end": 2866514, "filename": "/shaders/glsl/fs_stencil_color_texture.bin"}, {"start": 2866514, "audio": 0, "end": 2867020, "filename": "/shaders/glsl/vs_gdr_instanced_indirect_rendering.bin"}, {"start": 2867020, "audio": 0, "end": 2882295, "filename": "/shaders/glsl/cs_assao_generate_q3.bin"}, {"start": 2882295, "audio": 0, "end": 2883014, "filename": "/shaders/glsl/vs_tree.bin"}, {"start": 2883014, "audio": 0, "end": 2890923, "filename": "/shaders/glsl/cs_terrain_lod.bin"}, {"start": 2890923, "audio": 0, "end": 2891541, "filename": "/shaders/glsl/vs_hdr_mesh.bin"}, {"start": 2891541, "audio": 0, "end": 2892933, "filename": "/shaders/glsl/vs_shadowmaps_vblur.bin"}, {"start": 2892933, "audio": 0, "end": 2893624, "filename": "/shaders/glsl/fs_deferred_combine.bin"}, {"start": 2893624, "audio": 0, "end": 2903450, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_esm_csm.bin"}, {"start": 2903450, "audio": 0, "end": 2906182, "filename": "/shaders/glsl/fs_pom.bin"}, {"start": 2906182, "audio": 0, "end": 2906742, "filename": "/shaders/glsl/vs_oit.bin"}, {"start": 2906742, "audio": 0, "end": 2907131, "filename": "/shaders/glsl/fs_gdr_instanced_indirect_rendering.bin"}, {"start": 2907131, "audio": 0, "end": 2907292, "filename": "/shaders/glsl/fs_shadowvolume_svbackblank.bin"}, {"start": 2907292, "audio": 0, "end": 2908640, "filename": "/shaders/glsl/vs_bump.bin"}, {"start": 2908640, "audio": 0, "end": 2909589, "filename": "/shaders/glsl/fs_assao_deferred_combine.bin"}, {"start": 2909589, "audio": 0, "end": 2912908, "filename": "/shaders/glsl/fs_ibl_mesh.bin"}, {"start": 2912908, "audio": 0, "end": 2913219, "filename": "/shaders/glsl/vs_fullscreen.bin"}, {"start": 2913219, "audio": 0, "end": 2914127, "filename": "/shaders/glsl/fs_deferred_geom.bin"}, {"start": 2914127, "audio": 0, "end": 2915724, "filename": "/shaders/glsl/vs_deferred_geom.bin"}, {"start": 2915724, "audio": 0, "end": 2917784, "filename": "/shaders/glsl/cs_assao_non_smart_apply.bin"}, {"start": 2917784, "audio": 0, "end": 2919886, "filename": "/shaders/glsl/fs_shadowvolume_color_lighting.bin"}, {"start": 2919886, "audio": 0, "end": 2929932, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_esm_linear_csm.bin"}, {"start": 2929932, "audio": 0, "end": 2930810, "filename": "/shaders/glsl/vs_shadowmaps_color_lighting.bin"}, {"start": 2930810, "audio": 0, "end": 2934828, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_esm_linear.bin"}, {"start": 2934828, "audio": 0, "end": 2938802, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_esm.bin"}, {"start": 2938802, "audio": 0, "end": 2942654, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_hard.bin"}, {"start": 2942654, "audio": 0, "end": 2943312, "filename": "/shaders/glsl/vs_shadowmaps_texture_lighting.bin"}, {"start": 2943312, "audio": 0, "end": 2943764, "filename": "/shaders/glsl/fs_shadowvolume_svside.bin"}, {"start": 2943764, "audio": 0, "end": 2943992, "filename": "/shaders/glsl/vs_sms_shadow.bin"}, {"start": 2943992, "audio": 0, "end": 2944124, "filename": "/shaders/glsl/fs_shadowvolume_svsidecolor.bin"}, {"start": 2944124, "audio": 0, "end": 2945292, "filename": "/shaders/glsl/fs_sky_landscape.bin"}, {"start": 2945292, "audio": 0, "end": 2946666, "filename": "/shaders/glsl/vs_pom.bin"}, {"start": 2946666, "audio": 0, "end": 2946965, "filename": "/shaders/glsl/vs_cubes.bin"}, {"start": 2946965, "audio": 0, "end": 2947439, "filename": "/shaders/glsl/vs_rsm_gbuffer.bin"}, {"start": 2947439, "audio": 0, "end": 2947603, "filename": "/shaders/glsl/fs_shadowmaps_texture.bin"}, {"start": 2947603, "audio": 0, "end": 2948976, "filename": "/shaders/glsl/vs_mesh.bin"}, {"start": 2948976, "audio": 0, "end": 2949140, "filename": "/shaders/glsl/fs_deferred_debug.bin"}, {"start": 2949140, "audio": 0, "end": 2949451, "filename": "/shaders/glsl/vs_oit_blit.bin"}, {"start": 2949451, "audio": 0, "end": 2950173, "filename": "/shaders/glsl/vs_ibl_skybox.bin"}, {"start": 2950173, "audio": 0, "end": 2965234, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_pcf.bin"}, {"start": 2965234, "audio": 0, "end": 2968468, "filename": "/shaders/glsl/vs_sky.bin"}, {"start": 2968468, "audio": 0, "end": 2971596, "filename": "/shaders/glsl/fs_hdr_lumavg.bin"}, {"start": 2971596, "audio": 0, "end": 2973046, "filename": "/shaders/glsl/vs_shadowmaps_color_lighting_csm.bin"}, {"start": 2973046, "audio": 0, "end": 2985000, "filename": "/shaders/glsl/fs_raymarching.bin"}, {"start": 2985000, "audio": 0, "end": 2985299, "filename": "/shaders/glsl/vs_deferred_debug_line.bin"}, {"start": 2985299, "audio": 0, "end": 2985730, "filename": "/shaders/glsl/fs_shadowvolume_svbacktex1.bin"}, {"start": 2985730, "audio": 0, "end": 2987047, "filename": "/shaders/glsl/vs_hdr_tonemap.bin"}, {"start": 2987047, "audio": 0, "end": 2987358, "filename": "/shaders/glsl/vs_stencil_color_texture.bin"}, {"start": 2987358, "audio": 0, "end": 2988281, "filename": "/shaders/glsl/vs_shadowmaps_color_lighting_linear.bin"}, {"start": 2988281, "audio": 0, "end": 2988679, "filename": "/shaders/glsl/vs_gdr_render_occlusion.bin"}, {"start": 2988679, "audio": 0, "end": 2988994, "filename": "/shaders/glsl/vs_assao.bin"}, {"start": 2988994, "audio": 0, "end": 2990621, "filename": "/shaders/glsl/vs_bump_instanced.bin"}, {"start": 2990621, "audio": 0, "end": 2991040, "filename": "/shaders/glsl/vs_albedo_output.bin"}, {"start": 2991040, "audio": 0, "end": 2991588, "filename": "/shaders/glsl/fs_shadowvolume_svsidetex.bin"}, {"start": 2991588, "audio": 0, "end": 2992019, "filename": "/shaders/glsl/fs_shadowvolume_svbacktex2.bin"}, {"start": 2992019, "audio": 0, "end": 2992151, "filename": "/shaders/glsl/fs_shadowvolume_svfrontcolor.bin"}, {"start": 2992151, "audio": 0, "end": 2996570, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_vsm_linear.bin"}, {"start": 2996570, "audio": 0, "end": 2997145, "filename": "/shaders/glsl/vs_shadowvolume_color_lighting.bin"}, {"start": 2997145, "audio": 0, "end": 2999654, "filename": "/shaders/glsl/cs_assao_postprocess_importance_map_a.bin"}, {"start": 2999654, "audio": 0, "end": 3001415, "filename": "/shaders/glsl/cs_indirect.bin"}, {"start": 3001415, "audio": 0, "end": 3001495, "filename": "/shaders/glsl/fs_stencil_color_black.bin"}, {"start": 3001495, "audio": 0, "end": 3001787, "filename": "/shaders/glsl/fs_shadowmaps_packdepth.bin"}, {"start": 3001787, "audio": 0, "end": 3003163, "filename": "/shaders/glsl/vs_shadowmaps_color_lighting_omni.bin"}, {"start": 3003163, "audio": 0, "end": 3006898, "filename": "/shaders/glsl/cs_gdr_occlude_props.bin"}, {"start": 3006898, "audio": 0, "end": 3007322, "filename": "/shaders/glsl/vs_shadowvolume_svback.bin"}, {"start": 3007322, "audio": 0, "end": 3008714, "filename": "/shaders/glsl/vs_shadowmaps_hblur.bin"}, {"start": 3008714, "audio": 0, "end": 3010299, "filename": "/shaders/glsl/fs_shadowmaps_vblur.bin"}, {"start": 3010299, "audio": 0, "end": 3025574, "filename": "/shaders/glsl/cs_assao_generate_q0.bin"}, {"start": 3025574, "audio": 0, "end": 3026002, "filename": "/shaders/glsl/fs_shadowvolume_svfronttex2.bin"}, {"start": 3026002, "audio": 0, "end": 3026313, "filename": "/shaders/glsl/vs_hdr_bright.bin"}, {"start": 3026313, "audio": 0, "end": 3028067, "filename": "/shaders/glsl/fs_deferred_light.bin"}, {"start": 3028067, "audio": 0, "end": 3028423, "filename": "/shaders/glsl/fs_shadowmaps_unpackdepth.bin"}, {"start": 3028423, "audio": 0, "end": 3029510, "filename": "/shaders/glsl/fs_sky_color_banding_fix.bin"}, {"start": 3029510, "audio": 0, "end": 3031948, "filename": "/shaders/glsl/cs_assao_generate_importance_map.bin"}, {"start": 3031948, "audio": 0, "end": 3032334, "filename": "/shaders/glsl/fs_shadowmaps_packdepth_vsm_linear.bin"}, {"start": 3032334, "audio": 0, "end": 3032562, "filename": "/shaders/glsl/vs_shadowmaps_color.bin"}, {"start": 3032562, "audio": 0, "end": 3033326, "filename": "/shaders/glsl/fs_vt_mip.bin"}, {"start": 3033326, "audio": 0, "end": 3033637, "filename": "/shaders/glsl/vs_shadowmaps_color_texture.bin"}, {"start": 3033637, "audio": 0, "end": 3033970, "filename": "/shaders/glsl/fs_vectordisplay_fb.bin"}, {"start": 3033970, "audio": 0, "end": 3036215, "filename": "/shaders/glsl/fs_hdr_lum.bin"}, {"start": 3036215, "audio": 0, "end": 3036496, "filename": "/shaders/glsl/vs_sms_shadow_pd.bin"}, {"start": 3036496, "audio": 0, "end": 3051602, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_pcf_linear.bin"}, {"start": 3051602, "audio": 0, "end": 3057541, "filename": "/shaders/glsl/fs_terrain_render.bin"}, {"start": 3057541, "audio": 0, "end": 3060768, "filename": "/shaders/glsl/cs_update_instances.bin"}, {"start": 3060768, "audio": 0, "end": 3061380, "filename": "/shaders/glsl/fs_hdr_skybox.bin"}, {"start": 3061380, "audio": 0, "end": 3061970, "filename": "/shaders/glsl/vs_shadowvolume_svside.bin"}, {"start": 3061970, "audio": 0, "end": 3069701, "filename": "/shaders/glsl/cs_assao_prepare_depths_and_normals.bin"}, {"start": 3069701, "audio": 0, "end": 3070012, "filename": "/shaders/glsl/vs_update.bin"}, {"start": 3070012, "audio": 0, "end": 3071922, "filename": "/shaders/glsl/fs_downsample.bin"}, {"start": 3071922, "audio": 0, "end": 3072087, "filename": "/shaders/glsl/fs_update.bin"}, {"start": 3072087, "audio": 0, "end": 3072315, "filename": "/shaders/glsl/vs_stencil_color.bin"}, {"start": 3072315, "audio": 0, "end": 3087590, "filename": "/shaders/glsl/cs_assao_generate_q1.bin"}, {"start": 3087590, "audio": 0, "end": 3088160, "filename": "/shaders/glsl/vs_assao_gbuffer.bin"}, {"start": 3088160, "audio": 0, "end": 3088531, "filename": "/shaders/glsl/fs_bloom_combine.bin"}, {"start": 3088531, "audio": 0, "end": 3094409, "filename": "/shaders/glsl/fs_terrain_render_normal.bin"}, {"start": 3094409, "audio": 0, "end": 3094808, "filename": "/shaders/glsl/fs_oit_wb_separate_blit.bin"}, {"start": 3094808, "audio": 0, "end": 3096461, "filename": "/shaders/glsl/fs_hdr_mesh.bin"}, {"start": 3096461, "audio": 0, "end": 3097567, "filename": "/shaders/glsl/fs_rsm_lbuffer.bin"}, {"start": 3097567, "audio": 0, "end": 3102000, "filename": "/shaders/glsl/fs_bump.bin"}, {"start": 3102000, "audio": 0, "end": 3102478, "filename": "/shaders/glsl/vs_rsm_shadow.bin"}, {"start": 3102478, "audio": 0, "end": 3109574, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_hard_linear_omni.bin"}, {"start": 3109574, "audio": 0, "end": 3110299, "filename": "/shaders/glsl/vs_picking_shaded.bin"}, {"start": 3110299, "audio": 0, "end": 3112857, "filename": "/shaders/glsl/fs_hdr_tonemap.bin"}, {"start": 3112857, "audio": 0, "end": 3115513, "filename": "/shaders/glsl/cs_assao_prepare_depths.bin"}, {"start": 3115513, "audio": 0, "end": 3117259, "filename": "/shaders/glsl/cs_gdr_copy_z.bin"}, {"start": 3117259, "audio": 0, "end": 3135770, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_pcf_linear_omni.bin"}, {"start": 3135770, "audio": 0, "end": 3135950, "filename": "/shaders/glsl/fs_rsm_gbuffer.bin"}, {"start": 3135950, "audio": 0, "end": 3146641, "filename": "/shaders/glsl/fs_deferred_clear_uav.bin"}, {"start": 3146641, "audio": 0, "end": 3148881, "filename": "/shaders/glsl/cs_assao_prepare_depths_half.bin"}, {"start": 3148881, "audio": 0, "end": 3151579, "filename": "/shaders/glsl/cs_assao_postprocess_importance_map_b.bin"}, {"start": 3151579, "audio": 0, "end": 3151890, "filename": "/shaders/glsl/vs_shadowvolume_color_texture.bin"}, {"start": 3151890, "audio": 0, "end": 3167163, "filename": "/shaders/glsl/cs_assao_generate_q3base.bin"}, {"start": 3167163, "audio": 0, "end": 3172087, "filename": "/shaders/glsl/cs_assao_prepare_depth_mip.bin"}, {"start": 3172087, "audio": 0, "end": 3172167, "filename": "/shaders/glsl/fs_shadowvolume_svsideblank.bin"}, {"start": 3172167, "audio": 0, "end": 3174474, "filename": "/shaders/glsl/fs_hdr_bright.bin"}, {"start": 3174474, "audio": 0, "end": 3176059, "filename": "/shaders/glsl/fs_shadowmaps_hblur.bin"}, {"start": 3176059, "audio": 0, "end": 3183288, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_esm_linear_omni.bin"}, {"start": 3183288, "audio": 0, "end": 3183387, "filename": "/shaders/glsl/fs_oit.bin"}, {"start": 3183387, "audio": 0, "end": 3187271, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_hard_linear.bin"}, {"start": 3187271, "audio": 0, "end": 3188311, "filename": "/shaders/glsl/fs_vt_unlit.bin"}, {"start": 3188311, "audio": 0, "end": 3188622, "filename": "/shaders/glsl/vs_hdr_skybox.bin"}, {"start": 3188622, "audio": 0, "end": 3191183, "filename": "/shaders/glsl/fs_shadowmaps_vblur_vsm.bin"}, {"start": 3191183, "audio": 0, "end": 3192015, "filename": "/shaders/glsl/vs_sms_mesh.bin"}, {"start": 3192015, "audio": 0, "end": 3193897, "filename": "/shaders/glsl/cs_update.bin"}, {"start": 3193897, "audio": 0, "end": 3194208, "filename": "/shaders/glsl/vs_shadowvolume_texture.bin"}, {"start": 3194208, "audio": 0, "end": 3194590, "filename": "/shaders/glsl/vs_raymarching.bin"}, {"start": 3194590, "audio": 0, "end": 3205961, "filename": "/shaders/glsl/fs_deferred_light_uav.bin"}, {"start": 3205961, "audio": 0, "end": 3206125, "filename": "/shaders/glsl/fs_shadowvolume_texture.bin"}, {"start": 3206125, "audio": 0, "end": 3206436, "filename": "/shaders/glsl/vs_hdr_lum.bin"}, {"start": 3206436, "audio": 0, "end": 3207147, "filename": "/shaders/glsl/fs_wf_wireframe.bin"}, {"start": 3207147, "audio": 0, "end": 3207589, "filename": "/shaders/glsl/fs_update_3d.bin"}, {"start": 3207589, "audio": 0, "end": 3214151, "filename": "/shaders/glsl/vs_terrain_render.bin"}, {"start": 3214151, "audio": 0, "end": 3214379, "filename": "/shaders/glsl/vs_shadowmaps_depth.bin"}, {"start": 3214379, "audio": 0, "end": 3215006, "filename": "/shaders/glsl/vs_ibl_mesh.bin"}, {"start": 3215006, "audio": 0, "end": 3215170, "filename": "/shaders/glsl/fs_stencil_texture.bin"}, {"start": 3215170, "audio": 0, "end": 3215464, "filename": "/shaders/glsl/vs_shadowmaps_packdepth_linear.bin"}, {"start": 3215464, "audio": 0, "end": 3215775, "filename": "/shaders/glsl/vs_deferred_combine.bin"}, {"start": 3215775, "audio": 0, "end": 3215862, "filename": "/shaders/glsl/fs_cubes.bin"}, {"start": 3215862, "audio": 0, "end": 3223494, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_vsm_linear_omni.bin"}, {"start": 3223494, "audio": 0, "end": 3223663, "filename": "/shaders/glsl/fs_shadowvolume_svfrontblank.bin"}, {"start": 3223663, "audio": 0, "end": 3224132, "filename": "/shaders/glsl/fs_shadowmaps_packdepth_vsm.bin"}, {"start": 3224132, "audio": 0, "end": 3224637, "filename": "/shaders/glsl/vs_terrain_height_texture.bin"}, {"start": 3224637, "audio": 0, "end": 3224948, "filename": "/shaders/glsl/vs_hdr_lumavg.bin"}, {"start": 3224948, "audio": 0, "end": 3226780, "filename": "/shaders/glsl/fs_deferred_light_ta.bin"}, {"start": 3226780, "audio": 0, "end": 3230204, "filename": "/shaders/glsl/cs_assao_smart_blur_wide.bin"}, {"start": 3230204, "audio": 0, "end": 3238430, "filename": "/shaders/glsl/fs_sms_mesh_pd.bin"}, {"start": 3238430, "audio": 0, "end": 3241864, "filename": "/shaders/glsl/cs_assao_apply.bin"}, {"start": 3241864, "audio": 0, "end": 3242522, "filename": "/shaders/glsl/vs_shadowvolume_texture_lighting.bin"}, {"start": 3242522, "audio": 0, "end": 3243352, "filename": "/shaders/glsl/fs_picking_shaded.bin"}, {"start": 3243352, "audio": 0, "end": 3247271, "filename": "/shaders/glsl/cs_init_instances.bin"}, {"start": 3247271, "audio": 0, "end": 3249595, "filename": "/shaders/glsl/fs_shadowvolume_texture_lighting.bin"}, {"start": 3249595, "audio": 0, "end": 3256778, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_esm_omni.bin"}, {"start": 3256778, "audio": 0, "end": 3257089, "filename": "/shaders/glsl/vs_shadowmaps_texture.bin"}, {"start": 3257089, "audio": 0, "end": 3257333, "filename": "/shaders/glsl/fs_shadowmaps_packdepth_linear.bin"}, {"start": 3257333, "audio": 0, "end": 3265253, "filename": "/shaders/glsl/fs_sms_mesh.bin"}, {"start": 3265253, "audio": 0, "end": 3283715, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_pcf_omni.bin"}, {"start": 3283715, "audio": 0, "end": 3284078, "filename": "/shaders/glsl/vs_terrain.bin"}, {"start": 3284078, "audio": 0, "end": 3286713, "filename": "/shaders/glsl/cs_terrain_init.bin"}, {"start": 3286713, "audio": 0, "end": 3287907, "filename": "/shaders/glsl/fs_tree.bin"}, {"start": 3287907, "audio": 0, "end": 3288240, "filename": "/shaders/glsl/fs_shadowmaps_unpackdepth_vsm.bin"}, {"start": 3288240, "audio": 0, "end": 3288551, "filename": "/shaders/glsl/vs_stencil_texture.bin"}, {"start": 3288551, "audio": 0, "end": 3288970, "filename": "/shaders/glsl/vs_vt_generic.bin"}, {"start": 3288970, "audio": 0, "end": 3293345, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_vsm.bin"}, {"start": 3293345, "audio": 0, "end": 3300931, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_vsm_omni.bin"}, {"start": 3300931, "audio": 0, "end": 3301011, "filename": "/shaders/glsl/fs_shadowmaps_color_black.bin"}, {"start": 3301011, "audio": 0, "end": 3310317, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_hard_csm.bin"}, {"start": 3310317, "audio": 0, "end": 3321989, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_vsm_csm.bin"}, {"start": 3321989, "audio": 0, "end": 3323934, "filename": "/shaders/glsl/cs_terrain_update_indirect.bin"}, {"start": 3323934, "audio": 0, "end": 3324021, "filename": "/shaders/glsl/fs_instancing.bin"}, {"start": 3324021, "audio": 0, "end": 3324850, "filename": "/shaders/glsl/vs_particle.bin"}, {"start": 3324850, "audio": 0, "end": 3326382, "filename": "/shaders/glsl/cs_assao_load_counter_clear.bin"}, {"start": 3326382, "audio": 0, "end": 3328094, "filename": "/shaders/glsl/fs_ibl_skybox.bin"}, {"start": 3328094, "audio": 0, "end": 3328313, "filename": "/shaders/glsl/fs_terrain.bin"}, {"start": 3328313, "audio": 0, "end": 3328624, "filename": "/shaders/glsl/vs_deferred_debug.bin"}, {"start": 3328624, "audio": 0, "end": 3390003, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_pcf_csm.bin"}, {"start": 3390003, "audio": 0, "end": 3390609, "filename": "/shaders/glsl/fs_shadowmaps_color_texture.bin"}, {"start": 3390609, "audio": 0, "end": 3452410, "filename": "/shaders/glsl/fs_shadowmaps_color_lighting_pcf_linear_csm.bin"}, {"start": 3452410, "audio": 0, "end": 3453068, "filename": "/shaders/glsl/vs_stencil_texture_lighting.bin"}, {"start": 3453068, "audio": 0, "end": 3454193, "filename": "/shaders/metal/vs_wf_mesh.bin"}, {"start": 3454193, "audio": 0, "end": 3456293, "filename": "/shaders/metal/cs_assao_non_smart_blur.bin"}, {"start": 3456293, "audio": 0, "end": 3457762, "filename": "/shaders/metal/fs_hdr_blur.bin"}, {"start": 3457762, "audio": 0, "end": 3459441, "filename": "/shaders/metal/vs_hdr_blur.bin"}, {"start": 3459441, "audio": 0, "end": 3459977, "filename": "/shaders/metal/vs_shadowvolume_svfront.bin"}, {"start": 3459977, "audio": 0, "end": 3466362, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_hard_omni.bin"}, {"start": 3466362, "audio": 0, "end": 3467200, "filename": "/shaders/metal/vs_vectordisplay_fb.bin"}, {"start": 3467200, "audio": 0, "end": 3469375, "filename": "/shaders/metal/fs_stencil_color_lighting.bin"}, {"start": 3469375, "audio": 0, "end": 3471829, "filename": "/shaders/metal/fs_stencil_texture_lighting.bin"}, {"start": 3471829, "audio": 0, "end": 3472760, "filename": "/shaders/metal/fs_sky.bin"}, {"start": 3472760, "audio": 0, "end": 3473497, "filename": "/shaders/metal/cs_terrain_update_draw.bin"}, {"start": 3473497, "audio": 0, "end": 3474379, "filename": "/shaders/metal/fs_oit_wb.bin"}, {"start": 3474379, "audio": 0, "end": 3475090, "filename": "/shaders/metal/fs_assao_gbuffer.bin"}, {"start": 3475090, "audio": 0, "end": 3475558, "filename": "/shaders/metal/fs_albedo_output.bin"}, {"start": 3475558, "audio": 0, "end": 3476251, "filename": "/shaders/metal/vs_shadowmaps_unpackdepth.bin"}, {"start": 3476251, "audio": 0, "end": 3478588, "filename": "/shaders/metal/vs_shadowmaps_color_lighting_linear_csm.bin"}, {"start": 3478588, "audio": 0, "end": 3480242, "filename": "/shaders/metal/vs_rsm_lbuffer.bin"}, {"start": 3480242, "audio": 0, "end": 3481107, "filename": "/shaders/metal/vs_callback.bin"}, {"start": 3481107, "audio": 0, "end": 3481766, "filename": "/shaders/metal/vs_shadowmaps_packdepth.bin"}, {"start": 3481766, "audio": 0, "end": 3482422, "filename": "/shaders/metal/fs_rsm_shadow.bin"}, {"start": 3482422, "audio": 0, "end": 3482713, "filename": "/shaders/metal/fs_sms_shadow.bin"}, {"start": 3482713, "audio": 0, "end": 3486884, "filename": "/shaders/metal/cs_gdr_stream_compaction.bin"}, {"start": 3486884, "audio": 0, "end": 3489174, "filename": "/shaders/metal/cs_assao_smart_blur.bin"}, {"start": 3489174, "audio": 0, "end": 3490093, "filename": "/shaders/metal/vs_wf_wireframe.bin"}, {"start": 3490093, "audio": 0, "end": 3490929, "filename": "/shaders/metal/fs_shadowvolume_svfronttex1.bin"}, {"start": 3490929, "audio": 0, "end": 3491867, "filename": "/shaders/metal/vs_stencil_color_lighting.bin"}, {"start": 3491867, "audio": 0, "end": 3492672, "filename": "/shaders/metal/fs_oit_wb_separate.bin"}, {"start": 3492672, "audio": 0, "end": 3493365, "filename": "/shaders/metal/vs_rsm_combine.bin"}, {"start": 3493365, "audio": 0, "end": 3494095, "filename": "/shaders/metal/fs_sms_shadow_pd.bin"}, {"start": 3494095, "audio": 0, "end": 3502575, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_hard_linear_csm.bin"}, {"start": 3502575, "audio": 0, "end": 3504850, "filename": "/shaders/metal/vs_shadowmaps_color_lighting_linear_omni.bin"}, {"start": 3504850, "audio": 0, "end": 3505236, "filename": "/shaders/metal/fs_deferred_debug_line.bin"}, {"start": 3505236, "audio": 0, "end": 3506738, "filename": "/shaders/metal/fs_upsample.bin"}, {"start": 3506738, "audio": 0, "end": 3507298, "filename": "/shaders/metal/fs_update_cmp.bin"}, {"start": 3507298, "audio": 0, "end": 3509949, "filename": "/shaders/metal/fs_shadowmaps_hblur_vsm.bin"}, {"start": 3509949, "audio": 0, "end": 3510917, "filename": "/shaders/metal/fs_shadowvolume_color_texture.bin"}, {"start": 3510917, "audio": 0, "end": 3511952, "filename": "/shaders/metal/cs_assao_non_smart_half_apply.bin"}, {"start": 3511952, "audio": 0, "end": 3517717, "filename": "/shaders/metal/cs_assao_prepare_depths_and_normals_half.bin"}, {"start": 3517717, "audio": 0, "end": 3518452, "filename": "/shaders/metal/fs_vectordisplay_blit.bin"}, {"start": 3518452, "audio": 0, "end": 3519573, "filename": "/shaders/metal/vs_instancing.bin"}, {"start": 3519573, "audio": 0, "end": 3529901, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_vsm_linear_csm.bin"}, {"start": 3529901, "audio": 0, "end": 3530529, "filename": "/shaders/metal/fs_callback.bin"}, {"start": 3530529, "audio": 0, "end": 3531345, "filename": "/shaders/metal/fs_oit_wb_blit.bin"}, {"start": 3531345, "audio": 0, "end": 3533474, "filename": "/shaders/metal/fs_vectordisplay_blur.bin"}, {"start": 3533474, "audio": 0, "end": 3546718, "filename": "/shaders/metal/cs_assao_generate_q2.bin"}, {"start": 3546718, "audio": 0, "end": 3548570, "filename": "/shaders/metal/fs_mesh.bin"}, {"start": 3548570, "audio": 0, "end": 3549066, "filename": "/shaders/metal/fs_picking_id.bin"}, {"start": 3549066, "audio": 0, "end": 3549759, "filename": "/shaders/metal/vs_deferred_light.bin"}, {"start": 3549759, "audio": 0, "end": 3552378, "filename": "/shaders/metal/fs_wf_mesh.bin"}, {"start": 3552378, "audio": 0, "end": 3553321, "filename": "/shaders/metal/vs_sky_landscape.bin"}, {"start": 3553321, "audio": 0, "end": 3554469, "filename": "/shaders/metal/cs_gdr_downscale_hi_z.bin"}, {"start": 3554469, "audio": 0, "end": 3554995, "filename": "/shaders/metal/fs_shadowvolume_svbackcolor.bin"}, {"start": 3554995, "audio": 0, "end": 3561376, "filename": "/shaders/metal/fs_rsm_combine.bin"}, {"start": 3561376, "audio": 0, "end": 3562169, "filename": "/shaders/metal/fs_particle.bin"}, {"start": 3562169, "audio": 0, "end": 3563137, "filename": "/shaders/metal/fs_stencil_color_texture.bin"}, {"start": 3563137, "audio": 0, "end": 3564191, "filename": "/shaders/metal/vs_gdr_instanced_indirect_rendering.bin"}, {"start": 3564191, "audio": 0, "end": 3578596, "filename": "/shaders/metal/cs_assao_generate_q3.bin"}, {"start": 3578596, "audio": 0, "end": 3579820, "filename": "/shaders/metal/vs_tree.bin"}, {"start": 3579820, "audio": 0, "end": 3590439, "filename": "/shaders/metal/cs_terrain_lod.bin"}, {"start": 3590439, "audio": 0, "end": 3591489, "filename": "/shaders/metal/vs_hdr_mesh.bin"}, {"start": 3591489, "audio": 0, "end": 3593165, "filename": "/shaders/metal/vs_shadowmaps_vblur.bin"}, {"start": 3593165, "audio": 0, "end": 3594098, "filename": "/shaders/metal/fs_deferred_combine.bin"}, {"start": 3594098, "audio": 0, "end": 3602810, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_esm_csm.bin"}, {"start": 3602810, "audio": 0, "end": 3606982, "filename": "/shaders/metal/fs_pom.bin"}, {"start": 3606982, "audio": 0, "end": 3607834, "filename": "/shaders/metal/vs_oit.bin"}, {"start": 3607834, "audio": 0, "end": 3608597, "filename": "/shaders/metal/fs_gdr_instanced_indirect_rendering.bin"}, {"start": 3608597, "audio": 0, "end": 3608888, "filename": "/shaders/metal/fs_shadowvolume_svbackblank.bin"}, {"start": 3608888, "audio": 0, "end": 3610669, "filename": "/shaders/metal/vs_bump.bin"}, {"start": 3610669, "audio": 0, "end": 3612239, "filename": "/shaders/metal/fs_assao_deferred_combine.bin"}, {"start": 3612239, "audio": 0, "end": 3616010, "filename": "/shaders/metal/fs_ibl_mesh.bin"}, {"start": 3616010, "audio": 0, "end": 3616703, "filename": "/shaders/metal/vs_fullscreen.bin"}, {"start": 3616703, "audio": 0, "end": 3618036, "filename": "/shaders/metal/fs_deferred_geom.bin"}, {"start": 3618036, "audio": 0, "end": 3619849, "filename": "/shaders/metal/vs_deferred_geom.bin"}, {"start": 3619849, "audio": 0, "end": 3621125, "filename": "/shaders/metal/cs_assao_non_smart_apply.bin"}, {"start": 3621125, "audio": 0, "end": 3623552, "filename": "/shaders/metal/fs_shadowvolume_color_lighting.bin"}, {"start": 3623552, "audio": 0, "end": 3632316, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_esm_linear_csm.bin"}, {"start": 3632316, "audio": 0, "end": 3633549, "filename": "/shaders/metal/vs_shadowmaps_color_lighting.bin"}, {"start": 3633549, "audio": 0, "end": 3637790, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_esm_linear.bin"}, {"start": 3637790, "audio": 0, "end": 3642014, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_esm.bin"}, {"start": 3642014, "audio": 0, "end": 3646167, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_hard.bin"}, {"start": 3646167, "audio": 0, "end": 3647260, "filename": "/shaders/metal/vs_shadowmaps_texture_lighting.bin"}, {"start": 3647260, "audio": 0, "end": 3648194, "filename": "/shaders/metal/fs_shadowvolume_svside.bin"}, {"start": 3648194, "audio": 0, "end": 3648730, "filename": "/shaders/metal/vs_sms_shadow.bin"}, {"start": 3648730, "audio": 0, "end": 3649256, "filename": "/shaders/metal/fs_shadowvolume_svsidecolor.bin"}, {"start": 3649256, "audio": 0, "end": 3651213, "filename": "/shaders/metal/fs_sky_landscape.bin"}, {"start": 3651213, "audio": 0, "end": 3652857, "filename": "/shaders/metal/vs_pom.bin"}, {"start": 3652857, "audio": 0, "end": 3653538, "filename": "/shaders/metal/vs_cubes.bin"}, {"start": 3653538, "audio": 0, "end": 3654354, "filename": "/shaders/metal/vs_rsm_gbuffer.bin"}, {"start": 3654354, "audio": 0, "end": 3654887, "filename": "/shaders/metal/fs_shadowmaps_texture.bin"}, {"start": 3654887, "audio": 0, "end": 3656508, "filename": "/shaders/metal/vs_mesh.bin"}, {"start": 3656508, "audio": 0, "end": 3657041, "filename": "/shaders/metal/fs_deferred_debug.bin"}, {"start": 3657041, "audio": 0, "end": 3657734, "filename": "/shaders/metal/vs_oit_blit.bin"}, {"start": 3657734, "audio": 0, "end": 3658938, "filename": "/shaders/metal/vs_ibl_skybox.bin"}, {"start": 3658938, "audio": 0, "end": 3670992, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_pcf.bin"}, {"start": 3670992, "audio": 0, "end": 3673910, "filename": "/shaders/metal/vs_sky.bin"}, {"start": 3673910, "audio": 0, "end": 3676947, "filename": "/shaders/metal/fs_hdr_lumavg.bin"}, {"start": 3676947, "audio": 0, "end": 3678984, "filename": "/shaders/metal/vs_shadowmaps_color_lighting_csm.bin"}, {"start": 3678984, "audio": 0, "end": 3685943, "filename": "/shaders/metal/fs_raymarching.bin"}, {"start": 3685943, "audio": 0, "end": 3686624, "filename": "/shaders/metal/vs_deferred_debug_line.bin"}, {"start": 3686624, "audio": 0, "end": 3687461, "filename": "/shaders/metal/fs_shadowvolume_svbacktex1.bin"}, {"start": 3687461, "audio": 0, "end": 3689159, "filename": "/shaders/metal/vs_hdr_tonemap.bin"}, {"start": 3689159, "audio": 0, "end": 3689852, "filename": "/shaders/metal/vs_stencil_color_texture.bin"}, {"start": 3689852, "audio": 0, "end": 3691160, "filename": "/shaders/metal/vs_shadowmaps_color_lighting_linear.bin"}, {"start": 3691160, "audio": 0, "end": 3692084, "filename": "/shaders/metal/vs_gdr_render_occlusion.bin"}, {"start": 3692084, "audio": 0, "end": 3692777, "filename": "/shaders/metal/vs_assao.bin"}, {"start": 3692777, "audio": 0, "end": 3694919, "filename": "/shaders/metal/vs_bump_instanced.bin"}, {"start": 3694919, "audio": 0, "end": 3696235, "filename": "/shaders/metal/vs_albedo_output.bin"}, {"start": 3696235, "audio": 0, "end": 3697398, "filename": "/shaders/metal/fs_shadowvolume_svsidetex.bin"}, {"start": 3697398, "audio": 0, "end": 3698235, "filename": "/shaders/metal/fs_shadowvolume_svbacktex2.bin"}, {"start": 3698235, "audio": 0, "end": 3698761, "filename": "/shaders/metal/fs_shadowvolume_svfrontcolor.bin"}, {"start": 3698761, "audio": 0, "end": 3703303, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_vsm_linear.bin"}, {"start": 3703303, "audio": 0, "end": 3704243, "filename": "/shaders/metal/vs_shadowvolume_color_lighting.bin"}, {"start": 3704243, "audio": 0, "end": 3705875, "filename": "/shaders/metal/cs_assao_postprocess_importance_map_a.bin"}, {"start": 3705875, "audio": 0, "end": 3706460, "filename": "/shaders/metal/cs_indirect.bin"}, {"start": 3706460, "audio": 0, "end": 3706751, "filename": "/shaders/metal/fs_stencil_color_black.bin"}, {"start": 3706751, "audio": 0, "end": 3707316, "filename": "/shaders/metal/fs_shadowmaps_packdepth.bin"}, {"start": 3707316, "audio": 0, "end": 3709291, "filename": "/shaders/metal/vs_shadowmaps_color_lighting_omni.bin"}, {"start": 3709291, "audio": 0, "end": 3713395, "filename": "/shaders/metal/cs_gdr_occlude_props.bin"}, {"start": 3713395, "audio": 0, "end": 3714130, "filename": "/shaders/metal/vs_shadowvolume_svback.bin"}, {"start": 3714130, "audio": 0, "end": 3715806, "filename": "/shaders/metal/vs_shadowmaps_hblur.bin"}, {"start": 3715806, "audio": 0, "end": 3718095, "filename": "/shaders/metal/fs_shadowmaps_vblur.bin"}, {"start": 3718095, "audio": 0, "end": 3727030, "filename": "/shaders/metal/cs_assao_generate_q0.bin"}, {"start": 3727030, "audio": 0, "end": 3727866, "filename": "/shaders/metal/fs_shadowvolume_svfronttex2.bin"}, {"start": 3727866, "audio": 0, "end": 3728559, "filename": "/shaders/metal/vs_hdr_bright.bin"}, {"start": 3728559, "audio": 0, "end": 3730060, "filename": "/shaders/metal/fs_deferred_light.bin"}, {"start": 3730060, "audio": 0, "end": 3730829, "filename": "/shaders/metal/fs_shadowmaps_unpackdepth.bin"}, {"start": 3730829, "audio": 0, "end": 3732347, "filename": "/shaders/metal/fs_sky_color_banding_fix.bin"}, {"start": 3732347, "audio": 0, "end": 3734039, "filename": "/shaders/metal/cs_assao_generate_importance_map.bin"}, {"start": 3734039, "audio": 0, "end": 3734637, "filename": "/shaders/metal/fs_shadowmaps_packdepth_vsm_linear.bin"}, {"start": 3734637, "audio": 0, "end": 3735173, "filename": "/shaders/metal/vs_shadowmaps_color.bin"}, {"start": 3735173, "audio": 0, "end": 3736170, "filename": "/shaders/metal/fs_vt_mip.bin"}, {"start": 3736170, "audio": 0, "end": 3736863, "filename": "/shaders/metal/vs_shadowmaps_color_texture.bin"}, {"start": 3736863, "audio": 0, "end": 3737589, "filename": "/shaders/metal/fs_vectordisplay_fb.bin"}, {"start": 3737589, "audio": 0, "end": 3740553, "filename": "/shaders/metal/fs_hdr_lum.bin"}, {"start": 3740553, "audio": 0, "end": 3741212, "filename": "/shaders/metal/vs_sms_shadow_pd.bin"}, {"start": 3741212, "audio": 0, "end": 3753177, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_pcf_linear.bin"}, {"start": 3753177, "audio": 0, "end": 3753979, "filename": "/shaders/metal/fs_terrain_render.bin"}, {"start": 3753979, "audio": 0, "end": 3756308, "filename": "/shaders/metal/cs_update_instances.bin"}, {"start": 3756308, "audio": 0, "end": 3757302, "filename": "/shaders/metal/fs_hdr_skybox.bin"}, {"start": 3757302, "audio": 0, "end": 3758313, "filename": "/shaders/metal/vs_shadowvolume_svside.bin"}, {"start": 3758313, "audio": 0, "end": 3767528, "filename": "/shaders/metal/cs_assao_prepare_depths_and_normals.bin"}, {"start": 3767528, "audio": 0, "end": 3768221, "filename": "/shaders/metal/vs_update.bin"}, {"start": 3768221, "audio": 0, "end": 3769974, "filename": "/shaders/metal/fs_downsample.bin"}, {"start": 3769974, "audio": 0, "end": 3770504, "filename": "/shaders/metal/fs_update.bin"}, {"start": 3770504, "audio": 0, "end": 3771040, "filename": "/shaders/metal/vs_stencil_color.bin"}, {"start": 3771040, "audio": 0, "end": 3782539, "filename": "/shaders/metal/cs_assao_generate_q1.bin"}, {"start": 3782539, "audio": 0, "end": 3783519, "filename": "/shaders/metal/vs_assao_gbuffer.bin"}, {"start": 3783519, "audio": 0, "end": 3784286, "filename": "/shaders/metal/fs_bloom_combine.bin"}, {"start": 3784286, "audio": 0, "end": 3785005, "filename": "/shaders/metal/fs_terrain_render_normal.bin"}, {"start": 3785005, "audio": 0, "end": 3785821, "filename": "/shaders/metal/fs_oit_wb_separate_blit.bin"}, {"start": 3785821, "audio": 0, "end": 3787843, "filename": "/shaders/metal/fs_hdr_mesh.bin"}, {"start": 3787843, "audio": 0, "end": 3789424, "filename": "/shaders/metal/fs_rsm_lbuffer.bin"}, {"start": 3789424, "audio": 0, "end": 3792016, "filename": "/shaders/metal/fs_bump.bin"}, {"start": 3792016, "audio": 0, "end": 3792815, "filename": "/shaders/metal/vs_rsm_shadow.bin"}, {"start": 3792815, "audio": 0, "end": 3799213, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_hard_linear_omni.bin"}, {"start": 3799213, "audio": 0, "end": 3800500, "filename": "/shaders/metal/vs_picking_shaded.bin"}, {"start": 3800500, "audio": 0, "end": 3804118, "filename": "/shaders/metal/fs_hdr_tonemap.bin"}, {"start": 3804118, "audio": 0, "end": 3805776, "filename": "/shaders/metal/cs_assao_prepare_depths.bin"}, {"start": 3805776, "audio": 0, "end": 3806465, "filename": "/shaders/metal/cs_gdr_copy_z.bin"}, {"start": 3806465, "audio": 0, "end": 3820679, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_pcf_linear_omni.bin"}, {"start": 3820679, "audio": 0, "end": 3821356, "filename": "/shaders/metal/fs_rsm_gbuffer.bin"}, {"start": 3821356, "audio": 0, "end": 3821634, "filename": "/shaders/metal/fs_deferred_clear_uav.bin"}, {"start": 3821634, "audio": 0, "end": 3822808, "filename": "/shaders/metal/cs_assao_prepare_depths_half.bin"}, {"start": 3822808, "audio": 0, "end": 3824922, "filename": "/shaders/metal/cs_assao_postprocess_importance_map_b.bin"}, {"start": 3824922, "audio": 0, "end": 3825615, "filename": "/shaders/metal/vs_shadowvolume_color_texture.bin"}, {"start": 3825615, "audio": 0, "end": 3834650, "filename": "/shaders/metal/cs_assao_generate_q3base.bin"}, {"start": 3834650, "audio": 0, "end": 3837976, "filename": "/shaders/metal/cs_assao_prepare_depth_mip.bin"}, {"start": 3837976, "audio": 0, "end": 3838267, "filename": "/shaders/metal/fs_shadowvolume_svsideblank.bin"}, {"start": 3838267, "audio": 0, "end": 3840813, "filename": "/shaders/metal/fs_hdr_bright.bin"}, {"start": 3840813, "audio": 0, "end": 3843102, "filename": "/shaders/metal/fs_shadowmaps_hblur.bin"}, {"start": 3843102, "audio": 0, "end": 3849574, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_esm_linear_omni.bin"}, {"start": 3849574, "audio": 0, "end": 3849961, "filename": "/shaders/metal/fs_oit.bin"}, {"start": 3849961, "audio": 0, "end": 3854127, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_hard_linear.bin"}, {"start": 3854127, "audio": 0, "end": 3855645, "filename": "/shaders/metal/fs_vt_unlit.bin"}, {"start": 3855645, "audio": 0, "end": 3856338, "filename": "/shaders/metal/vs_hdr_skybox.bin"}, {"start": 3856338, "audio": 0, "end": 3858989, "filename": "/shaders/metal/fs_shadowmaps_vblur_vsm.bin"}, {"start": 3858989, "audio": 0, "end": 3860201, "filename": "/shaders/metal/vs_sms_mesh.bin"}, {"start": 3860201, "audio": 0, "end": 3861005, "filename": "/shaders/metal/cs_update.bin"}, {"start": 3861005, "audio": 0, "end": 3861698, "filename": "/shaders/metal/vs_shadowvolume_texture.bin"}, {"start": 3861698, "audio": 0, "end": 3862536, "filename": "/shaders/metal/vs_raymarching.bin"}, {"start": 3862536, "audio": 0, "end": 3863966, "filename": "/shaders/metal/fs_deferred_light_uav.bin"}, {"start": 3863966, "audio": 0, "end": 3864499, "filename": "/shaders/metal/fs_shadowvolume_texture.bin"}, {"start": 3864499, "audio": 0, "end": 3865192, "filename": "/shaders/metal/vs_hdr_lum.bin"}, {"start": 3865192, "audio": 0, "end": 3866064, "filename": "/shaders/metal/fs_wf_wireframe.bin"}, {"start": 3866064, "audio": 0, "end": 3866769, "filename": "/shaders/metal/fs_update_3d.bin"}, {"start": 3866769, "audio": 0, "end": 3869150, "filename": "/shaders/metal/vs_terrain_render.bin"}, {"start": 3869150, "audio": 0, "end": 3869686, "filename": "/shaders/metal/vs_shadowmaps_depth.bin"}, {"start": 3869686, "audio": 0, "end": 3870675, "filename": "/shaders/metal/vs_ibl_mesh.bin"}, {"start": 3870675, "audio": 0, "end": 3871208, "filename": "/shaders/metal/fs_stencil_texture.bin"}, {"start": 3871208, "audio": 0, "end": 3871876, "filename": "/shaders/metal/vs_shadowmaps_packdepth_linear.bin"}, {"start": 3871876, "audio": 0, "end": 3872569, "filename": "/shaders/metal/vs_deferred_combine.bin"}, {"start": 3872569, "audio": 0, "end": 3872955, "filename": "/shaders/metal/fs_cubes.bin"}, {"start": 3872955, "audio": 0, "end": 3879738, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_vsm_linear_omni.bin"}, {"start": 3879738, "audio": 0, "end": 3880142, "filename": "/shaders/metal/fs_shadowvolume_svfrontblank.bin"}, {"start": 3880142, "audio": 0, "end": 3880794, "filename": "/shaders/metal/fs_shadowmaps_packdepth_vsm.bin"}, {"start": 3880794, "audio": 0, "end": 3881887, "filename": "/shaders/metal/vs_terrain_height_texture.bin"}, {"start": 3881887, "audio": 0, "end": 3882580, "filename": "/shaders/metal/vs_hdr_lumavg.bin"}, {"start": 3882580, "audio": 0, "end": 3884148, "filename": "/shaders/metal/fs_deferred_light_ta.bin"}, {"start": 3884148, "audio": 0, "end": 3887391, "filename": "/shaders/metal/cs_assao_smart_blur_wide.bin"}, {"start": 3887391, "audio": 0, "end": 3893773, "filename": "/shaders/metal/fs_sms_mesh_pd.bin"}, {"start": 3893773, "audio": 0, "end": 3896913, "filename": "/shaders/metal/cs_assao_apply.bin"}, {"start": 3896913, "audio": 0, "end": 3898006, "filename": "/shaders/metal/vs_shadowvolume_texture_lighting.bin"}, {"start": 3898006, "audio": 0, "end": 3899092, "filename": "/shaders/metal/fs_picking_shaded.bin"}, {"start": 3899092, "audio": 0, "end": 3907426, "filename": "/shaders/metal/cs_init_instances.bin"}, {"start": 3907426, "audio": 0, "end": 3910098, "filename": "/shaders/metal/fs_shadowvolume_texture_lighting.bin"}, {"start": 3910098, "audio": 0, "end": 3916554, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_esm_omni.bin"}, {"start": 3916554, "audio": 0, "end": 3917247, "filename": "/shaders/metal/vs_shadowmaps_texture.bin"}, {"start": 3917247, "audio": 0, "end": 3917767, "filename": "/shaders/metal/fs_shadowmaps_packdepth_linear.bin"}, {"start": 3917767, "audio": 0, "end": 3924125, "filename": "/shaders/metal/fs_sms_mesh.bin"}, {"start": 3924125, "audio": 0, "end": 3938274, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_pcf_omni.bin"}, {"start": 3938274, "audio": 0, "end": 3939078, "filename": "/shaders/metal/vs_terrain.bin"}, {"start": 3939078, "audio": 0, "end": 3940956, "filename": "/shaders/metal/cs_terrain_init.bin"}, {"start": 3940956, "audio": 0, "end": 3942478, "filename": "/shaders/metal/fs_tree.bin"}, {"start": 3942478, "audio": 0, "end": 3943207, "filename": "/shaders/metal/fs_shadowmaps_unpackdepth_vsm.bin"}, {"start": 3943207, "audio": 0, "end": 3943900, "filename": "/shaders/metal/vs_stencil_texture.bin"}, {"start": 3943900, "audio": 0, "end": 3944657, "filename": "/shaders/metal/vs_vt_generic.bin"}, {"start": 3944657, "audio": 0, "end": 3949186, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_vsm.bin"}, {"start": 3949186, "audio": 0, "end": 3955950, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_vsm_omni.bin"}, {"start": 3955950, "audio": 0, "end": 3956241, "filename": "/shaders/metal/fs_shadowmaps_color_black.bin"}, {"start": 3956241, "audio": 0, "end": 3964669, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_hard_csm.bin"}, {"start": 3964669, "audio": 0, "end": 3974945, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_vsm_csm.bin"}, {"start": 3974945, "audio": 0, "end": 3975876, "filename": "/shaders/metal/cs_terrain_update_indirect.bin"}, {"start": 3975876, "audio": 0, "end": 3976262, "filename": "/shaders/metal/fs_instancing.bin"}, {"start": 3976262, "audio": 0, "end": 3977342, "filename": "/shaders/metal/vs_particle.bin"}, {"start": 3977342, "audio": 0, "end": 3977631, "filename": "/shaders/metal/cs_assao_load_counter_clear.bin"}, {"start": 3977631, "audio": 0, "end": 3980007, "filename": "/shaders/metal/fs_ibl_skybox.bin"}, {"start": 3980007, "audio": 0, "end": 3980501, "filename": "/shaders/metal/fs_terrain.bin"}, {"start": 3980501, "audio": 0, "end": 3981194, "filename": "/shaders/metal/vs_deferred_debug.bin"}, {"start": 3981194, "audio": 0, "end": 4028174, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_pcf_csm.bin"}, {"start": 4028174, "audio": 0, "end": 4029142, "filename": "/shaders/metal/fs_shadowmaps_color_texture.bin"}, {"start": 4029142, "audio": 0, "end": 4075914, "filename": "/shaders/metal/fs_shadowmaps_color_lighting_pcf_linear_csm.bin"}, {"start": 4075914, "audio": 0, "end": 4077007, "filename": "/shaders/metal/vs_stencil_texture_lighting.bin"}, {"start": 4077007, "audio": 0, "end": 4077669, "filename": "/shaders/dx9/vs_wf_mesh.bin"}, {"start": 4077669, "audio": 0, "end": 4078285, "filename": "/shaders/dx9/fs_hdr_blur.bin"}, {"start": 4078285, "audio": 0, "end": 4078948, "filename": "/shaders/dx9/vs_hdr_blur.bin"}, {"start": 4078948, "audio": 0, "end": 4079229, "filename": "/shaders/dx9/vs_shadowvolume_svfront.bin"}, {"start": 4079229, "audio": 0, "end": 4082955, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_hard_omni.bin"}, {"start": 4082955, "audio": 0, "end": 4083308, "filename": "/shaders/dx9/vs_vectordisplay_fb.bin"}, {"start": 4083308, "audio": 0, "end": 4085282, "filename": "/shaders/dx9/fs_stencil_color_lighting.bin"}, {"start": 4085282, "audio": 0, "end": 4087449, "filename": "/shaders/dx9/fs_stencil_texture_lighting.bin"}, {"start": 4087449, "audio": 0, "end": 4088096, "filename": "/shaders/dx9/fs_sky.bin"}, {"start": 4088096, "audio": 0, "end": 4088553, "filename": "/shaders/dx9/fs_oit_wb.bin"}, {"start": 4088553, "audio": 0, "end": 4088746, "filename": "/shaders/dx9/fs_albedo_output.bin"}, {"start": 4088746, "audio": 0, "end": 4089063, "filename": "/shaders/dx9/vs_shadowmaps_unpackdepth.bin"}, {"start": 4089063, "audio": 0, "end": 4090576, "filename": "/shaders/dx9/vs_shadowmaps_color_lighting_linear_csm.bin"}, {"start": 4090576, "audio": 0, "end": 4091478, "filename": "/shaders/dx9/vs_rsm_lbuffer.bin"}, {"start": 4091478, "audio": 0, "end": 4091937, "filename": "/shaders/dx9/vs_callback.bin"}, {"start": 4091937, "audio": 0, "end": 4092254, "filename": "/shaders/dx9/vs_shadowmaps_packdepth.bin"}, {"start": 4092254, "audio": 0, "end": 4092458, "filename": "/shaders/dx9/fs_rsm_shadow.bin"}, {"start": 4092458, "audio": 0, "end": 4092605, "filename": "/shaders/dx9/fs_sms_shadow.bin"}, {"start": 4092605, "audio": 0, "end": 4093143, "filename": "/shaders/dx9/vs_wf_wireframe.bin"}, {"start": 4093143, "audio": 0, "end": 4093322, "filename": "/shaders/dx9/fs_shadowvolume_svfronttex1.bin"}, {"start": 4093322, "audio": 0, "end": 4093861, "filename": "/shaders/dx9/vs_stencil_color_lighting.bin"}, {"start": 4093861, "audio": 0, "end": 4094290, "filename": "/shaders/dx9/fs_oit_wb_separate.bin"}, {"start": 4094290, "audio": 0, "end": 4094607, "filename": "/shaders/dx9/vs_rsm_combine.bin"}, {"start": 4094607, "audio": 0, "end": 4094955, "filename": "/shaders/dx9/fs_sms_shadow_pd.bin"}, {"start": 4094955, "audio": 0, "end": 4099372, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_hard_linear_csm.bin"}, {"start": 4099372, "audio": 0, "end": 4100832, "filename": "/shaders/dx9/vs_shadowmaps_color_lighting_linear_omni.bin"}, {"start": 4100832, "audio": 0, "end": 4100963, "filename": "/shaders/dx9/fs_deferred_debug_line.bin"}, {"start": 4100963, "audio": 0, "end": 4101758, "filename": "/shaders/dx9/fs_upsample.bin"}, {"start": 4101758, "audio": 0, "end": 4102018, "filename": "/shaders/dx9/fs_update_cmp.bin"}, {"start": 4102018, "audio": 0, "end": 4103168, "filename": "/shaders/dx9/fs_shadowmaps_hblur_vsm.bin"}, {"start": 4103168, "audio": 0, "end": 4103738, "filename": "/shaders/dx9/fs_shadowvolume_color_texture.bin"}, {"start": 4103738, "audio": 0, "end": 4104061, "filename": "/shaders/dx9/fs_vectordisplay_blit.bin"}, {"start": 4104061, "audio": 0, "end": 4104533, "filename": "/shaders/dx9/vs_instancing.bin"}, {"start": 4104533, "audio": 0, "end": 4109358, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_vsm_linear_csm.bin"}, {"start": 4109358, "audio": 0, "end": 4109909, "filename": "/shaders/dx9/fs_callback.bin"}, {"start": 4109909, "audio": 0, "end": 4110336, "filename": "/shaders/dx9/fs_oit_wb_blit.bin"}, {"start": 4110336, "audio": 0, "end": 4111147, "filename": "/shaders/dx9/fs_vectordisplay_blur.bin"}, {"start": 4111147, "audio": 0, "end": 4112347, "filename": "/shaders/dx9/fs_mesh.bin"}, {"start": 4112347, "audio": 0, "end": 4112569, "filename": "/shaders/dx9/fs_picking_id.bin"}, {"start": 4112569, "audio": 0, "end": 4112882, "filename": "/shaders/dx9/vs_deferred_light.bin"}, {"start": 4112882, "audio": 0, "end": 4113896, "filename": "/shaders/dx9/fs_wf_mesh.bin"}, {"start": 4113896, "audio": 0, "end": 4114395, "filename": "/shaders/dx9/vs_sky_landscape.bin"}, {"start": 4114395, "audio": 0, "end": 4114620, "filename": "/shaders/dx9/fs_shadowvolume_svbackcolor.bin"}, {"start": 4114620, "audio": 0, "end": 4117047, "filename": "/shaders/dx9/fs_rsm_combine.bin"}, {"start": 4117047, "audio": 0, "end": 4117449, "filename": "/shaders/dx9/fs_particle.bin"}, {"start": 4117449, "audio": 0, "end": 4118019, "filename": "/shaders/dx9/fs_stencil_color_texture.bin"}, {"start": 4118019, "audio": 0, "end": 4118646, "filename": "/shaders/dx9/vs_tree.bin"}, {"start": 4118646, "audio": 0, "end": 4119221, "filename": "/shaders/dx9/vs_hdr_mesh.bin"}, {"start": 4119221, "audio": 0, "end": 4119973, "filename": "/shaders/dx9/vs_shadowmaps_vblur.bin"}, {"start": 4119973, "audio": 0, "end": 4120585, "filename": "/shaders/dx9/fs_deferred_combine.bin"}, {"start": 4120585, "audio": 0, "end": 4125090, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_esm_csm.bin"}, {"start": 4125090, "audio": 0, "end": 4130750, "filename": "/shaders/dx9/fs_pom.bin"}, {"start": 4130750, "audio": 0, "end": 4131301, "filename": "/shaders/dx9/vs_oit.bin"}, {"start": 4131301, "audio": 0, "end": 4131448, "filename": "/shaders/dx9/fs_shadowvolume_svbackblank.bin"}, {"start": 4131448, "audio": 0, "end": 4132415, "filename": "/shaders/dx9/vs_bump.bin"}, {"start": 4132415, "audio": 0, "end": 4134436, "filename": "/shaders/dx9/fs_ibl_mesh.bin"}, {"start": 4134436, "audio": 0, "end": 4134753, "filename": "/shaders/dx9/vs_fullscreen.bin"}, {"start": 4134753, "audio": 0, "end": 4135443, "filename": "/shaders/dx9/fs_deferred_geom.bin"}, {"start": 4135443, "audio": 0, "end": 4136526, "filename": "/shaders/dx9/vs_deferred_geom.bin"}, {"start": 4136526, "audio": 0, "end": 4138434, "filename": "/shaders/dx9/fs_shadowvolume_color_lighting.bin"}, {"start": 4138434, "audio": 0, "end": 4142903, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_esm_linear_csm.bin"}, {"start": 4142903, "audio": 0, "end": 4143703, "filename": "/shaders/dx9/vs_shadowmaps_color_lighting.bin"}, {"start": 4143703, "audio": 0, "end": 4146423, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_esm_linear.bin"}, {"start": 4146423, "audio": 0, "end": 4149147, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_esm.bin"}, {"start": 4149147, "audio": 0, "end": 4151831, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_hard.bin"}, {"start": 4151831, "audio": 0, "end": 4152406, "filename": "/shaders/dx9/vs_shadowmaps_texture_lighting.bin"}, {"start": 4152406, "audio": 0, "end": 4152661, "filename": "/shaders/dx9/fs_shadowvolume_svside.bin"}, {"start": 4152661, "audio": 0, "end": 4152942, "filename": "/shaders/dx9/vs_sms_shadow.bin"}, {"start": 4152942, "audio": 0, "end": 4153167, "filename": "/shaders/dx9/fs_shadowvolume_svsidecolor.bin"}, {"start": 4153167, "audio": 0, "end": 4154596, "filename": "/shaders/dx9/fs_sky_landscape.bin"}, {"start": 4154596, "audio": 0, "end": 4155621, "filename": "/shaders/dx9/vs_pom.bin"}, {"start": 4155621, "audio": 0, "end": 4155938, "filename": "/shaders/dx9/vs_cubes.bin"}, {"start": 4155938, "audio": 0, "end": 4156433, "filename": "/shaders/dx9/vs_rsm_gbuffer.bin"}, {"start": 4156433, "audio": 0, "end": 4156649, "filename": "/shaders/dx9/fs_shadowmaps_texture.bin"}, {"start": 4156649, "audio": 0, "end": 4157629, "filename": "/shaders/dx9/vs_mesh.bin"}, {"start": 4157629, "audio": 0, "end": 4157841, "filename": "/shaders/dx9/fs_deferred_debug.bin"}, {"start": 4157841, "audio": 0, "end": 4158158, "filename": "/shaders/dx9/vs_oit_blit.bin"}, {"start": 4158158, "audio": 0, "end": 4158759, "filename": "/shaders/dx9/vs_ibl_skybox.bin"}, {"start": 4158759, "audio": 0, "end": 4166344, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_pcf.bin"}, {"start": 4166344, "audio": 0, "end": 4168458, "filename": "/shaders/dx9/vs_sky.bin"}, {"start": 4168458, "audio": 0, "end": 4170249, "filename": "/shaders/dx9/fs_hdr_lumavg.bin"}, {"start": 4170249, "audio": 0, "end": 4171698, "filename": "/shaders/dx9/vs_shadowmaps_color_lighting_csm.bin"}, {"start": 4171698, "audio": 0, "end": 4219134, "filename": "/shaders/dx9/fs_raymarching.bin"}, {"start": 4219134, "audio": 0, "end": 4219447, "filename": "/shaders/dx9/vs_deferred_debug_line.bin"}, {"start": 4219447, "audio": 0, "end": 4219626, "filename": "/shaders/dx9/fs_shadowvolume_svbacktex1.bin"}, {"start": 4219626, "audio": 0, "end": 4220277, "filename": "/shaders/dx9/vs_hdr_tonemap.bin"}, {"start": 4220277, "audio": 0, "end": 4220594, "filename": "/shaders/dx9/vs_stencil_color_texture.bin"}, {"start": 4220594, "audio": 0, "end": 4221410, "filename": "/shaders/dx9/vs_shadowmaps_color_lighting_linear.bin"}, {"start": 4221410, "audio": 0, "end": 4222347, "filename": "/shaders/dx9/vs_bump_instanced.bin"}, {"start": 4222347, "audio": 0, "end": 4222929, "filename": "/shaders/dx9/vs_albedo_output.bin"}, {"start": 4222929, "audio": 0, "end": 4223281, "filename": "/shaders/dx9/fs_shadowvolume_svsidetex.bin"}, {"start": 4223281, "audio": 0, "end": 4223460, "filename": "/shaders/dx9/fs_shadowvolume_svbacktex2.bin"}, {"start": 4223460, "audio": 0, "end": 4223685, "filename": "/shaders/dx9/fs_shadowvolume_svfrontcolor.bin"}, {"start": 4223685, "audio": 0, "end": 4226473, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_vsm_linear.bin"}, {"start": 4226473, "audio": 0, "end": 4227012, "filename": "/shaders/dx9/vs_shadowvolume_color_lighting.bin"}, {"start": 4227012, "audio": 0, "end": 4227159, "filename": "/shaders/dx9/fs_stencil_color_black.bin"}, {"start": 4227159, "audio": 0, "end": 4227426, "filename": "/shaders/dx9/fs_shadowmaps_packdepth.bin"}, {"start": 4227426, "audio": 0, "end": 4228822, "filename": "/shaders/dx9/vs_shadowmaps_color_lighting_omni.bin"}, {"start": 4228822, "audio": 0, "end": 4229257, "filename": "/shaders/dx9/vs_shadowvolume_svback.bin"}, {"start": 4229257, "audio": 0, "end": 4230009, "filename": "/shaders/dx9/vs_shadowmaps_hblur.bin"}, {"start": 4230009, "audio": 0, "end": 4230967, "filename": "/shaders/dx9/fs_shadowmaps_vblur.bin"}, {"start": 4230967, "audio": 0, "end": 4231146, "filename": "/shaders/dx9/fs_shadowvolume_svfronttex2.bin"}, {"start": 4231146, "audio": 0, "end": 4231463, "filename": "/shaders/dx9/vs_hdr_bright.bin"}, {"start": 4231463, "audio": 0, "end": 4232545, "filename": "/shaders/dx9/fs_deferred_light.bin"}, {"start": 4232545, "audio": 0, "end": 4232923, "filename": "/shaders/dx9/fs_shadowmaps_unpackdepth.bin"}, {"start": 4232923, "audio": 0, "end": 4234206, "filename": "/shaders/dx9/fs_sky_color_banding_fix.bin"}, {"start": 4234206, "audio": 0, "end": 4234465, "filename": "/shaders/dx9/fs_shadowmaps_packdepth_vsm_linear.bin"}, {"start": 4234465, "audio": 0, "end": 4234746, "filename": "/shaders/dx9/vs_shadowmaps_color.bin"}, {"start": 4234746, "audio": 0, "end": 4235409, "filename": "/shaders/dx9/fs_vt_mip.bin"}, {"start": 4235409, "audio": 0, "end": 4235726, "filename": "/shaders/dx9/vs_shadowmaps_color_texture.bin"}, {"start": 4235726, "audio": 0, "end": 4236061, "filename": "/shaders/dx9/fs_vectordisplay_fb.bin"}, {"start": 4236061, "audio": 0, "end": 4237528, "filename": "/shaders/dx9/fs_hdr_lum.bin"}, {"start": 4237528, "audio": 0, "end": 4237845, "filename": "/shaders/dx9/vs_sms_shadow_pd.bin"}, {"start": 4237845, "audio": 0, "end": 4245106, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_pcf_linear.bin"}, {"start": 4245106, "audio": 0, "end": 4245629, "filename": "/shaders/dx9/fs_hdr_skybox.bin"}, {"start": 4245629, "audio": 0, "end": 4246172, "filename": "/shaders/dx9/vs_shadowvolume_svside.bin"}, {"start": 4246172, "audio": 0, "end": 4246489, "filename": "/shaders/dx9/vs_update.bin"}, {"start": 4246489, "audio": 0, "end": 4247458, "filename": "/shaders/dx9/fs_downsample.bin"}, {"start": 4247458, "audio": 0, "end": 4247673, "filename": "/shaders/dx9/fs_update.bin"}, {"start": 4247673, "audio": 0, "end": 4247954, "filename": "/shaders/dx9/vs_stencil_color.bin"}, {"start": 4247954, "audio": 0, "end": 4248394, "filename": "/shaders/dx9/fs_bloom_combine.bin"}, {"start": 4248394, "audio": 0, "end": 4248821, "filename": "/shaders/dx9/fs_oit_wb_separate_blit.bin"}, {"start": 4248821, "audio": 0, "end": 4250196, "filename": "/shaders/dx9/fs_hdr_mesh.bin"}, {"start": 4250196, "audio": 0, "end": 4251093, "filename": "/shaders/dx9/fs_rsm_lbuffer.bin"}, {"start": 4251093, "audio": 0, "end": 4253329, "filename": "/shaders/dx9/fs_bump.bin"}, {"start": 4253329, "audio": 0, "end": 4253828, "filename": "/shaders/dx9/vs_rsm_shadow.bin"}, {"start": 4253828, "audio": 0, "end": 4257570, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_hard_linear_omni.bin"}, {"start": 4257570, "audio": 0, "end": 4258242, "filename": "/shaders/dx9/vs_picking_shaded.bin"}, {"start": 4258242, "audio": 0, "end": 4259913, "filename": "/shaders/dx9/fs_hdr_tonemap.bin"}, {"start": 4259913, "audio": 0, "end": 4267872, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_pcf_linear_omni.bin"}, {"start": 4267872, "audio": 0, "end": 4268104, "filename": "/shaders/dx9/fs_rsm_gbuffer.bin"}, {"start": 4268104, "audio": 0, "end": 4268421, "filename": "/shaders/dx9/vs_shadowvolume_color_texture.bin"}, {"start": 4268421, "audio": 0, "end": 4268568, "filename": "/shaders/dx9/fs_shadowvolume_svsideblank.bin"}, {"start": 4268568, "audio": 0, "end": 4270226, "filename": "/shaders/dx9/fs_hdr_bright.bin"}, {"start": 4270226, "audio": 0, "end": 4271184, "filename": "/shaders/dx9/fs_shadowmaps_hblur.bin"}, {"start": 4271184, "audio": 0, "end": 4274954, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_esm_linear_omni.bin"}, {"start": 4274954, "audio": 0, "end": 4275135, "filename": "/shaders/dx9/fs_oit.bin"}, {"start": 4275135, "audio": 0, "end": 4277815, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_hard_linear.bin"}, {"start": 4277815, "audio": 0, "end": 4278757, "filename": "/shaders/dx9/fs_vt_unlit.bin"}, {"start": 4278757, "audio": 0, "end": 4279074, "filename": "/shaders/dx9/vs_hdr_skybox.bin"}, {"start": 4279074, "audio": 0, "end": 4280224, "filename": "/shaders/dx9/fs_shadowmaps_vblur_vsm.bin"}, {"start": 4280224, "audio": 0, "end": 4280960, "filename": "/shaders/dx9/vs_sms_mesh.bin"}, {"start": 4280960, "audio": 0, "end": 4281277, "filename": "/shaders/dx9/vs_shadowvolume_texture.bin"}, {"start": 4281277, "audio": 0, "end": 4281630, "filename": "/shaders/dx9/vs_raymarching.bin"}, {"start": 4281630, "audio": 0, "end": 4281846, "filename": "/shaders/dx9/fs_shadowvolume_texture.bin"}, {"start": 4281846, "audio": 0, "end": 4282163, "filename": "/shaders/dx9/vs_hdr_lum.bin"}, {"start": 4282163, "audio": 0, "end": 4282681, "filename": "/shaders/dx9/fs_wf_wireframe.bin"}, {"start": 4282681, "audio": 0, "end": 4283106, "filename": "/shaders/dx9/fs_update_3d.bin"}, {"start": 4283106, "audio": 0, "end": 4283387, "filename": "/shaders/dx9/vs_shadowmaps_depth.bin"}, {"start": 4283387, "audio": 0, "end": 4284013, "filename": "/shaders/dx9/vs_ibl_mesh.bin"}, {"start": 4284013, "audio": 0, "end": 4284229, "filename": "/shaders/dx9/fs_stencil_texture.bin"}, {"start": 4284229, "audio": 0, "end": 4284578, "filename": "/shaders/dx9/vs_shadowmaps_packdepth_linear.bin"}, {"start": 4284578, "audio": 0, "end": 4284891, "filename": "/shaders/dx9/vs_deferred_combine.bin"}, {"start": 4284891, "audio": 0, "end": 4285026, "filename": "/shaders/dx9/fs_cubes.bin"}, {"start": 4285026, "audio": 0, "end": 4288896, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_vsm_linear_omni.bin"}, {"start": 4288896, "audio": 0, "end": 4289043, "filename": "/shaders/dx9/fs_shadowvolume_svfrontblank.bin"}, {"start": 4289043, "audio": 0, "end": 4289374, "filename": "/shaders/dx9/fs_shadowmaps_packdepth_vsm.bin"}, {"start": 4289374, "audio": 0, "end": 4289885, "filename": "/shaders/dx9/vs_terrain_height_texture.bin"}, {"start": 4289885, "audio": 0, "end": 4290202, "filename": "/shaders/dx9/vs_hdr_lumavg.bin"}, {"start": 4290202, "audio": 0, "end": 4293500, "filename": "/shaders/dx9/fs_sms_mesh_pd.bin"}, {"start": 4293500, "audio": 0, "end": 4294075, "filename": "/shaders/dx9/vs_shadowvolume_texture_lighting.bin"}, {"start": 4294075, "audio": 0, "end": 4294738, "filename": "/shaders/dx9/fs_picking_shaded.bin"}, {"start": 4294738, "audio": 0, "end": 4296797, "filename": "/shaders/dx9/fs_shadowvolume_texture_lighting.bin"}, {"start": 4296797, "audio": 0, "end": 4300571, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_esm_omni.bin"}, {"start": 4300571, "audio": 0, "end": 4300888, "filename": "/shaders/dx9/vs_shadowmaps_texture.bin"}, {"start": 4300888, "audio": 0, "end": 4301107, "filename": "/shaders/dx9/fs_shadowmaps_packdepth_linear.bin"}, {"start": 4301107, "audio": 0, "end": 4303569, "filename": "/shaders/dx9/fs_sms_mesh.bin"}, {"start": 4303569, "audio": 0, "end": 4312232, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_pcf_omni.bin"}, {"start": 4312232, "audio": 0, "end": 4312573, "filename": "/shaders/dx9/vs_terrain.bin"}, {"start": 4312573, "audio": 0, "end": 4313589, "filename": "/shaders/dx9/fs_tree.bin"}, {"start": 4313589, "audio": 0, "end": 4313971, "filename": "/shaders/dx9/fs_shadowmaps_unpackdepth_vsm.bin"}, {"start": 4313971, "audio": 0, "end": 4314288, "filename": "/shaders/dx9/vs_stencil_texture.bin"}, {"start": 4314288, "audio": 0, "end": 4314726, "filename": "/shaders/dx9/vs_vt_generic.bin"}, {"start": 4314726, "audio": 0, "end": 4317530, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_vsm.bin"}, {"start": 4317530, "audio": 0, "end": 4321416, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_vsm_omni.bin"}, {"start": 4321416, "audio": 0, "end": 4321563, "filename": "/shaders/dx9/fs_shadowmaps_color_black.bin"}, {"start": 4321563, "audio": 0, "end": 4325936, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_hard_csm.bin"}, {"start": 4325936, "audio": 0, "end": 4330825, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_vsm_csm.bin"}, {"start": 4330825, "audio": 0, "end": 4330960, "filename": "/shaders/dx9/fs_instancing.bin"}, {"start": 4330960, "audio": 0, "end": 4331640, "filename": "/shaders/dx9/vs_particle.bin"}, {"start": 4331640, "audio": 0, "end": 4332657, "filename": "/shaders/dx9/fs_ibl_skybox.bin"}, {"start": 4332657, "audio": 0, "end": 4332852, "filename": "/shaders/dx9/fs_terrain.bin"}, {"start": 4332852, "audio": 0, "end": 4333165, "filename": "/shaders/dx9/vs_deferred_debug.bin"}, {"start": 4333165, "audio": 0, "end": 4357655, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_pcf_csm.bin"}, {"start": 4357655, "audio": 0, "end": 4358225, "filename": "/shaders/dx9/fs_shadowmaps_color_texture.bin"}, {"start": 4358225, "audio": 0, "end": 4380535, "filename": "/shaders/dx9/fs_shadowmaps_color_lighting_pcf_linear_csm.bin"}, {"start": 4380535, "audio": 0, "end": 4381110, "filename": "/shaders/dx9/vs_stencil_texture_lighting.bin"}, {"start": 4381110, "audio": 0, "end": 4381859, "filename": "/shaders/essl/vs_wf_mesh.bin"}, {"start": 4381859, "audio": 0, "end": 4382870, "filename": "/shaders/essl/fs_hdr_blur.bin"}, {"start": 4382870, "audio": 0, "end": 4384359, "filename": "/shaders/essl/vs_hdr_blur.bin"}, {"start": 4384359, "audio": 0, "end": 4384605, "filename": "/shaders/essl/vs_shadowvolume_svfront.bin"}, {"start": 4384605, "audio": 0, "end": 4392017, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_hard_omni.bin"}, {"start": 4392017, "audio": 0, "end": 4392441, "filename": "/shaders/essl/vs_vectordisplay_fb.bin"}, {"start": 4392441, "audio": 0, "end": 4394685, "filename": "/shaders/essl/fs_stencil_color_lighting.bin"}, {"start": 4394685, "audio": 0, "end": 4397251, "filename": "/shaders/essl/fs_stencil_texture_lighting.bin"}, {"start": 4397251, "audio": 0, "end": 4397982, "filename": "/shaders/essl/fs_sky.bin"}, {"start": 4397982, "audio": 0, "end": 4398357, "filename": "/shaders/essl/fs_oit_wb.bin"}, {"start": 4398357, "audio": 0, "end": 4398492, "filename": "/shaders/essl/fs_albedo_output.bin"}, {"start": 4398492, "audio": 0, "end": 4398833, "filename": "/shaders/essl/vs_shadowmaps_unpackdepth.bin"}, {"start": 4398833, "audio": 0, "end": 4400579, "filename": "/shaders/essl/vs_shadowmaps_color_lighting_linear_csm.bin"}, {"start": 4400579, "audio": 0, "end": 4401779, "filename": "/shaders/essl/vs_rsm_lbuffer.bin"}, {"start": 4401779, "audio": 0, "end": 4402289, "filename": "/shaders/essl/vs_callback.bin"}, {"start": 4402289, "audio": 0, "end": 4402594, "filename": "/shaders/essl/vs_shadowmaps_packdepth.bin"}, {"start": 4402594, "audio": 0, "end": 4402771, "filename": "/shaders/essl/fs_rsm_shadow.bin"}, {"start": 4402771, "audio": 0, "end": 4402940, "filename": "/shaders/essl/fs_sms_shadow.bin"}, {"start": 4402940, "audio": 0, "end": 4403501, "filename": "/shaders/essl/vs_wf_wireframe.bin"}, {"start": 4403501, "audio": 0, "end": 4403943, "filename": "/shaders/essl/fs_shadowvolume_svfronttex1.bin"}, {"start": 4403943, "audio": 0, "end": 4404572, "filename": "/shaders/essl/vs_stencil_color_lighting.bin"}, {"start": 4404572, "audio": 0, "end": 4405015, "filename": "/shaders/essl/fs_oit_wb_separate.bin"}, {"start": 4405015, "audio": 0, "end": 4405356, "filename": "/shaders/essl/vs_rsm_combine.bin"}, {"start": 4405356, "audio": 0, "end": 4405758, "filename": "/shaders/essl/fs_sms_shadow_pd.bin"}, {"start": 4405758, "audio": 0, "end": 4415558, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_hard_linear_csm.bin"}, {"start": 4415558, "audio": 0, "end": 4417230, "filename": "/shaders/essl/vs_shadowmaps_color_lighting_linear_omni.bin"}, {"start": 4417230, "audio": 0, "end": 4417319, "filename": "/shaders/essl/fs_deferred_debug_line.bin"}, {"start": 4417319, "audio": 0, "end": 4418916, "filename": "/shaders/essl/fs_upsample.bin"}, {"start": 4418916, "audio": 0, "end": 4419150, "filename": "/shaders/essl/fs_update_cmp.bin"}, {"start": 4419150, "audio": 0, "end": 4421898, "filename": "/shaders/essl/fs_shadowmaps_hblur_vsm.bin"}, {"start": 4421898, "audio": 0, "end": 4422589, "filename": "/shaders/essl/fs_shadowvolume_color_texture.bin"}, {"start": 4422589, "audio": 0, "end": 4423007, "filename": "/shaders/essl/fs_vectordisplay_blit.bin"}, {"start": 4423007, "audio": 0, "end": 4423613, "filename": "/shaders/essl/vs_instancing.bin"}, {"start": 4423613, "audio": 0, "end": 4435987, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_vsm_linear_csm.bin"}, {"start": 4435987, "audio": 0, "end": 4436486, "filename": "/shaders/essl/fs_callback.bin"}, {"start": 4436486, "audio": 0, "end": 4436901, "filename": "/shaders/essl/fs_oit_wb_blit.bin"}, {"start": 4436901, "audio": 0, "end": 4438917, "filename": "/shaders/essl/fs_vectordisplay_blur.bin"}, {"start": 4438917, "audio": 0, "end": 4440340, "filename": "/shaders/essl/fs_mesh.bin"}, {"start": 4440340, "audio": 0, "end": 4440468, "filename": "/shaders/essl/fs_picking_id.bin"}, {"start": 4440468, "audio": 0, "end": 4440805, "filename": "/shaders/essl/vs_deferred_light.bin"}, {"start": 4440805, "audio": 0, "end": 4442330, "filename": "/shaders/essl/fs_wf_mesh.bin"}, {"start": 4442330, "audio": 0, "end": 4442903, "filename": "/shaders/essl/vs_sky_landscape.bin"}, {"start": 4442903, "audio": 0, "end": 4443041, "filename": "/shaders/essl/fs_shadowvolume_svbackcolor.bin"}, {"start": 4443041, "audio": 0, "end": 4451015, "filename": "/shaders/essl/fs_rsm_combine.bin"}, {"start": 4451015, "audio": 0, "end": 4451391, "filename": "/shaders/essl/fs_particle.bin"}, {"start": 4451391, "audio": 0, "end": 4452082, "filename": "/shaders/essl/fs_stencil_color_texture.bin"}, {"start": 4452082, "audio": 0, "end": 4452873, "filename": "/shaders/essl/vs_tree.bin"}, {"start": 4452873, "audio": 0, "end": 4453551, "filename": "/shaders/essl/vs_hdr_mesh.bin"}, {"start": 4453551, "audio": 0, "end": 4455039, "filename": "/shaders/essl/vs_shadowmaps_vblur.bin"}, {"start": 4455039, "audio": 0, "end": 4455810, "filename": "/shaders/essl/fs_deferred_combine.bin"}, {"start": 4455810, "audio": 0, "end": 4466018, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_esm_csm.bin"}, {"start": 4466018, "audio": 0, "end": 4468891, "filename": "/shaders/essl/fs_pom.bin"}, {"start": 4468891, "audio": 0, "end": 4469499, "filename": "/shaders/essl/vs_oit.bin"}, {"start": 4469499, "audio": 0, "end": 4469668, "filename": "/shaders/essl/fs_shadowvolume_svbackblank.bin"}, {"start": 4469668, "audio": 0, "end": 4471142, "filename": "/shaders/essl/vs_bump.bin"}, {"start": 4471142, "audio": 0, "end": 4474713, "filename": "/shaders/essl/fs_ibl_mesh.bin"}, {"start": 4474713, "audio": 0, "end": 4475054, "filename": "/shaders/essl/vs_fullscreen.bin"}, {"start": 4475054, "audio": 0, "end": 4476107, "filename": "/shaders/essl/fs_deferred_geom.bin"}, {"start": 4476107, "audio": 0, "end": 4477850, "filename": "/shaders/essl/vs_deferred_geom.bin"}, {"start": 4477850, "audio": 0, "end": 4480181, "filename": "/shaders/essl/fs_shadowvolume_color_lighting.bin"}, {"start": 4480181, "audio": 0, "end": 4490609, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_esm_linear_csm.bin"}, {"start": 4490609, "audio": 0, "end": 4491571, "filename": "/shaders/essl/vs_shadowmaps_color_lighting.bin"}, {"start": 4491571, "audio": 0, "end": 4495826, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_esm_linear.bin"}, {"start": 4495826, "audio": 0, "end": 4500037, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_esm.bin"}, {"start": 4500037, "audio": 0, "end": 4504120, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_hard.bin"}, {"start": 4504120, "audio": 0, "end": 4504844, "filename": "/shaders/essl/vs_shadowmaps_texture_lighting.bin"}, {"start": 4504844, "audio": 0, "end": 4505316, "filename": "/shaders/essl/fs_shadowvolume_svside.bin"}, {"start": 4505316, "audio": 0, "end": 4505562, "filename": "/shaders/essl/vs_sms_shadow.bin"}, {"start": 4505562, "audio": 0, "end": 4505700, "filename": "/shaders/essl/fs_shadowvolume_svsidecolor.bin"}, {"start": 4505700, "audio": 0, "end": 4506983, "filename": "/shaders/essl/fs_sky_landscape.bin"}, {"start": 4506983, "audio": 0, "end": 4508477, "filename": "/shaders/essl/vs_pom.bin"}, {"start": 4508477, "audio": 0, "end": 4508806, "filename": "/shaders/essl/vs_cubes.bin"}, {"start": 4508806, "audio": 0, "end": 4509316, "filename": "/shaders/essl/vs_rsm_gbuffer.bin"}, {"start": 4509316, "audio": 0, "end": 4509531, "filename": "/shaders/essl/fs_shadowmaps_texture.bin"}, {"start": 4509531, "audio": 0, "end": 4511024, "filename": "/shaders/essl/vs_mesh.bin"}, {"start": 4511024, "audio": 0, "end": 4511235, "filename": "/shaders/essl/fs_deferred_debug.bin"}, {"start": 4511235, "audio": 0, "end": 4511576, "filename": "/shaders/essl/vs_oit_blit.bin"}, {"start": 4511576, "audio": 0, "end": 4512352, "filename": "/shaders/essl/vs_ibl_skybox.bin"}, {"start": 4512352, "audio": 0, "end": 4528026, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_pcf.bin"}, {"start": 4528026, "audio": 0, "end": 4531434, "filename": "/shaders/essl/vs_sky.bin"}, {"start": 4531434, "audio": 0, "end": 4534720, "filename": "/shaders/essl/fs_hdr_lumavg.bin"}, {"start": 4534720, "audio": 0, "end": 4536302, "filename": "/shaders/essl/vs_shadowmaps_color_lighting_csm.bin"}, {"start": 4536302, "audio": 0, "end": 4548922, "filename": "/shaders/essl/fs_raymarching.bin"}, {"start": 4548922, "audio": 0, "end": 4549247, "filename": "/shaders/essl/vs_deferred_debug_line.bin"}, {"start": 4549247, "audio": 0, "end": 4549692, "filename": "/shaders/essl/fs_shadowvolume_svbacktex1.bin"}, {"start": 4549692, "audio": 0, "end": 4551099, "filename": "/shaders/essl/vs_hdr_tonemap.bin"}, {"start": 4551099, "audio": 0, "end": 4551440, "filename": "/shaders/essl/vs_stencil_color_texture.bin"}, {"start": 4551440, "audio": 0, "end": 4552447, "filename": "/shaders/essl/vs_shadowmaps_color_lighting_linear.bin"}, {"start": 4552447, "audio": 0, "end": 4554248, "filename": "/shaders/essl/vs_bump_instanced.bin"}, {"start": 4554248, "audio": 0, "end": 4554703, "filename": "/shaders/essl/vs_albedo_output.bin"}, {"start": 4554703, "audio": 0, "end": 4555277, "filename": "/shaders/essl/fs_shadowvolume_svsidetex.bin"}, {"start": 4555277, "audio": 0, "end": 4555722, "filename": "/shaders/essl/fs_shadowvolume_svbacktex2.bin"}, {"start": 4555722, "audio": 0, "end": 4555860, "filename": "/shaders/essl/fs_shadowvolume_svfrontcolor.bin"}, {"start": 4555860, "audio": 0, "end": 4560541, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_vsm_linear.bin"}, {"start": 4560541, "audio": 0, "end": 4561170, "filename": "/shaders/essl/vs_shadowvolume_color_lighting.bin"}, {"start": 4561170, "audio": 0, "end": 4562763, "filename": "/shaders/essl/cs_indirect.bin"}, {"start": 4562763, "audio": 0, "end": 4562843, "filename": "/shaders/essl/fs_stencil_color_black.bin"}, {"start": 4562843, "audio": 0, "end": 4563147, "filename": "/shaders/essl/fs_shadowmaps_packdepth.bin"}, {"start": 4563147, "audio": 0, "end": 4564655, "filename": "/shaders/essl/vs_shadowmaps_color_lighting_omni.bin"}, {"start": 4564655, "audio": 0, "end": 4565103, "filename": "/shaders/essl/vs_shadowvolume_svback.bin"}, {"start": 4565103, "audio": 0, "end": 4566591, "filename": "/shaders/essl/vs_shadowmaps_hblur.bin"}, {"start": 4566591, "audio": 0, "end": 4568303, "filename": "/shaders/essl/fs_shadowmaps_vblur.bin"}, {"start": 4568303, "audio": 0, "end": 4568745, "filename": "/shaders/essl/fs_shadowvolume_svfronttex2.bin"}, {"start": 4568745, "audio": 0, "end": 4569086, "filename": "/shaders/essl/vs_hdr_bright.bin"}, {"start": 4569086, "audio": 0, "end": 4570944, "filename": "/shaders/essl/fs_deferred_light.bin"}, {"start": 4570944, "audio": 0, "end": 4571365, "filename": "/shaders/essl/fs_shadowmaps_unpackdepth.bin"}, {"start": 4571365, "audio": 0, "end": 4572508, "filename": "/shaders/essl/fs_sky_color_banding_fix.bin"}, {"start": 4572508, "audio": 0, "end": 4572920, "filename": "/shaders/essl/fs_shadowmaps_packdepth_vsm_linear.bin"}, {"start": 4572920, "audio": 0, "end": 4573166, "filename": "/shaders/essl/vs_shadowmaps_color.bin"}, {"start": 4573166, "audio": 0, "end": 4573986, "filename": "/shaders/essl/fs_vt_mip.bin"}, {"start": 4573986, "audio": 0, "end": 4574327, "filename": "/shaders/essl/vs_shadowmaps_color_texture.bin"}, {"start": 4574327, "audio": 0, "end": 4574729, "filename": "/shaders/essl/fs_vectordisplay_fb.bin"}, {"start": 4574729, "audio": 0, "end": 4577092, "filename": "/shaders/essl/fs_hdr_lum.bin"}, {"start": 4577092, "audio": 0, "end": 4577397, "filename": "/shaders/essl/vs_sms_shadow_pd.bin"}, {"start": 4577397, "audio": 0, "end": 4593122, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_pcf_linear.bin"}, {"start": 4593122, "audio": 0, "end": 4596181, "filename": "/shaders/essl/cs_update_instances.bin"}, {"start": 4596181, "audio": 0, "end": 4596885, "filename": "/shaders/essl/fs_hdr_skybox.bin"}, {"start": 4596885, "audio": 0, "end": 4597517, "filename": "/shaders/essl/vs_shadowvolume_svside.bin"}, {"start": 4597517, "audio": 0, "end": 4597858, "filename": "/shaders/essl/vs_update.bin"}, {"start": 4597858, "audio": 0, "end": 4599857, "filename": "/shaders/essl/fs_downsample.bin"}, {"start": 4599857, "audio": 0, "end": 4600078, "filename": "/shaders/essl/fs_update.bin"}, {"start": 4600078, "audio": 0, "end": 4600324, "filename": "/shaders/essl/vs_stencil_color.bin"}, {"start": 4600324, "audio": 0, "end": 4600706, "filename": "/shaders/essl/fs_bloom_combine.bin"}, {"start": 4600706, "audio": 0, "end": 4601121, "filename": "/shaders/essl/fs_oit_wb_separate_blit.bin"}, {"start": 4601121, "audio": 0, "end": 4602922, "filename": "/shaders/essl/fs_hdr_mesh.bin"}, {"start": 4602922, "audio": 0, "end": 4604235, "filename": "/shaders/essl/fs_rsm_lbuffer.bin"}, {"start": 4604235, "audio": 0, "end": 4608986, "filename": "/shaders/essl/fs_bump.bin"}, {"start": 4608986, "audio": 0, "end": 4609506, "filename": "/shaders/essl/vs_rsm_shadow.bin"}, {"start": 4609506, "audio": 0, "end": 4616952, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_hard_linear_omni.bin"}, {"start": 4616952, "audio": 0, "end": 4617749, "filename": "/shaders/essl/vs_picking_shaded.bin"}, {"start": 4617749, "audio": 0, "end": 4620459, "filename": "/shaders/essl/fs_hdr_tonemap.bin"}, {"start": 4620459, "audio": 0, "end": 4639714, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_pcf_linear_omni.bin"}, {"start": 4639714, "audio": 0, "end": 4639906, "filename": "/shaders/essl/fs_rsm_gbuffer.bin"}, {"start": 4639906, "audio": 0, "end": 4640247, "filename": "/shaders/essl/vs_shadowvolume_color_texture.bin"}, {"start": 4640247, "audio": 0, "end": 4640327, "filename": "/shaders/essl/fs_shadowvolume_svsideblank.bin"}, {"start": 4640327, "audio": 0, "end": 4642762, "filename": "/shaders/essl/fs_hdr_bright.bin"}, {"start": 4642762, "audio": 0, "end": 4644474, "filename": "/shaders/essl/fs_shadowmaps_hblur.bin"}, {"start": 4644474, "audio": 0, "end": 4652059, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_esm_linear_omni.bin"}, {"start": 4652059, "audio": 0, "end": 4652164, "filename": "/shaders/essl/fs_oit.bin"}, {"start": 4652164, "audio": 0, "end": 4656279, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_hard_linear.bin"}, {"start": 4656279, "audio": 0, "end": 4657466, "filename": "/shaders/essl/fs_vt_unlit.bin"}, {"start": 4657466, "audio": 0, "end": 4657807, "filename": "/shaders/essl/vs_hdr_skybox.bin"}, {"start": 4657807, "audio": 0, "end": 4660555, "filename": "/shaders/essl/fs_shadowmaps_vblur_vsm.bin"}, {"start": 4660555, "audio": 0, "end": 4661465, "filename": "/shaders/essl/vs_sms_mesh.bin"}, {"start": 4661465, "audio": 0, "end": 4663185, "filename": "/shaders/essl/cs_update.bin"}, {"start": 4663185, "audio": 0, "end": 4663526, "filename": "/shaders/essl/vs_shadowvolume_texture.bin"}, {"start": 4663526, "audio": 0, "end": 4663950, "filename": "/shaders/essl/vs_raymarching.bin"}, {"start": 4663950, "audio": 0, "end": 4664165, "filename": "/shaders/essl/fs_shadowvolume_texture.bin"}, {"start": 4664165, "audio": 0, "end": 4664506, "filename": "/shaders/essl/vs_hdr_lum.bin"}, {"start": 4664506, "audio": 0, "end": 4665269, "filename": "/shaders/essl/fs_wf_wireframe.bin"}, {"start": 4665269, "audio": 0, "end": 4665792, "filename": "/shaders/essl/fs_update_3d.bin"}, {"start": 4665792, "audio": 0, "end": 4666038, "filename": "/shaders/essl/vs_shadowmaps_depth.bin"}, {"start": 4666038, "audio": 0, "end": 4666713, "filename": "/shaders/essl/vs_ibl_mesh.bin"}, {"start": 4666713, "audio": 0, "end": 4666928, "filename": "/shaders/essl/fs_stencil_texture.bin"}, {"start": 4666928, "audio": 0, "end": 4667246, "filename": "/shaders/essl/vs_shadowmaps_packdepth_linear.bin"}, {"start": 4667246, "audio": 0, "end": 4667583, "filename": "/shaders/essl/vs_deferred_combine.bin"}, {"start": 4667583, "audio": 0, "end": 4667676, "filename": "/shaders/essl/fs_cubes.bin"}, {"start": 4667676, "audio": 0, "end": 4675689, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_vsm_linear_omni.bin"}, {"start": 4675689, "audio": 0, "end": 4675866, "filename": "/shaders/essl/fs_shadowvolume_svfrontblank.bin"}, {"start": 4675866, "audio": 0, "end": 4676367, "filename": "/shaders/essl/fs_shadowmaps_packdepth_vsm.bin"}, {"start": 4676367, "audio": 0, "end": 4676909, "filename": "/shaders/essl/vs_terrain_height_texture.bin"}, {"start": 4676909, "audio": 0, "end": 4677250, "filename": "/shaders/essl/vs_hdr_lumavg.bin"}, {"start": 4677250, "audio": 0, "end": 4685842, "filename": "/shaders/essl/fs_sms_mesh_pd.bin"}, {"start": 4685842, "audio": 0, "end": 4686566, "filename": "/shaders/essl/vs_shadowvolume_texture_lighting.bin"}, {"start": 4686566, "audio": 0, "end": 4687444, "filename": "/shaders/essl/fs_picking_shaded.bin"}, {"start": 4687444, "audio": 0, "end": 4691195, "filename": "/shaders/essl/cs_init_instances.bin"}, {"start": 4691195, "audio": 0, "end": 4693757, "filename": "/shaders/essl/fs_shadowvolume_texture_lighting.bin"}, {"start": 4693757, "audio": 0, "end": 4701296, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_esm_omni.bin"}, {"start": 4701296, "audio": 0, "end": 4701637, "filename": "/shaders/essl/vs_shadowmaps_texture.bin"}, {"start": 4701637, "audio": 0, "end": 4701893, "filename": "/shaders/essl/fs_shadowmaps_packdepth_linear.bin"}, {"start": 4701893, "audio": 0, "end": 4710296, "filename": "/shaders/essl/fs_sms_mesh.bin"}, {"start": 4710296, "audio": 0, "end": 4729496, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_pcf_omni.bin"}, {"start": 4729496, "audio": 0, "end": 4729895, "filename": "/shaders/essl/vs_terrain.bin"}, {"start": 4729895, "audio": 0, "end": 4731211, "filename": "/shaders/essl/fs_tree.bin"}, {"start": 4731211, "audio": 0, "end": 4731609, "filename": "/shaders/essl/fs_shadowmaps_unpackdepth_vsm.bin"}, {"start": 4731609, "audio": 0, "end": 4731950, "filename": "/shaders/essl/vs_stencil_texture.bin"}, {"start": 4731950, "audio": 0, "end": 4732405, "filename": "/shaders/essl/vs_vt_generic.bin"}, {"start": 4732405, "audio": 0, "end": 4737042, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_vsm.bin"}, {"start": 4737042, "audio": 0, "end": 4745009, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_vsm_omni.bin"}, {"start": 4745009, "audio": 0, "end": 4745089, "filename": "/shaders/essl/fs_shadowmaps_color_black.bin"}, {"start": 4745089, "audio": 0, "end": 4754753, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_hard_csm.bin"}, {"start": 4754753, "audio": 0, "end": 4766907, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_vsm_csm.bin"}, {"start": 4766907, "audio": 0, "end": 4767000, "filename": "/shaders/essl/fs_instancing.bin"}, {"start": 4767000, "audio": 0, "end": 4767889, "filename": "/shaders/essl/vs_particle.bin"}, {"start": 4767889, "audio": 0, "end": 4769748, "filename": "/shaders/essl/fs_ibl_skybox.bin"}, {"start": 4769748, "audio": 0, "end": 4769987, "filename": "/shaders/essl/fs_terrain.bin"}, {"start": 4769987, "audio": 0, "end": 4770324, "filename": "/shaders/essl/vs_deferred_debug.bin"}, {"start": 4770324, "audio": 0, "end": 4833542, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_pcf_csm.bin"}, {"start": 4833542, "audio": 0, "end": 4834233, "filename": "/shaders/essl/fs_shadowmaps_color_texture.bin"}, {"start": 4834233, "audio": 0, "end": 4897897, "filename": "/shaders/essl/fs_shadowmaps_color_lighting_pcf_linear_csm.bin"}, {"start": 4897897, "audio": 0, "end": 4898621, "filename": "/shaders/essl/vs_stencil_texture_lighting.bin"}, {"start": 4898621, "audio": 0, "end": 4900832, "filename": "/shaders/spirv/vs_wf_mesh.bin"}, {"start": 4900832, "audio": 0, "end": 4904283, "filename": "/shaders/spirv/cs_assao_non_smart_blur.bin"}, {"start": 4904283, "audio": 0, "end": 4906302, "filename": "/shaders/spirv/fs_hdr_blur.bin"}, {"start": 4906302, "audio": 0, "end": 4909008, "filename": "/shaders/spirv/vs_hdr_blur.bin"}, {"start": 4909008, "audio": 0, "end": 4909942, "filename": "/shaders/spirv/vs_shadowvolume_svfront.bin"}, {"start": 4909942, "audio": 0, "end": 4918776, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_hard_omni.bin"}, {"start": 4918776, "audio": 0, "end": 4920094, "filename": "/shaders/spirv/vs_vectordisplay_fb.bin"}, {"start": 4920094, "audio": 0, "end": 4924007, "filename": "/shaders/spirv/fs_stencil_color_lighting.bin"}, {"start": 4924007, "audio": 0, "end": 4928541, "filename": "/shaders/spirv/fs_stencil_texture_lighting.bin"}, {"start": 4928541, "audio": 0, "end": 4930275, "filename": "/shaders/spirv/fs_sky.bin"}, {"start": 4930275, "audio": 0, "end": 4931887, "filename": "/shaders/spirv/cs_terrain_update_draw.bin"}, {"start": 4931887, "audio": 0, "end": 4933123, "filename": "/shaders/spirv/fs_oit_wb.bin"}, {"start": 4933123, "audio": 0, "end": 4934128, "filename": "/shaders/spirv/fs_assao_gbuffer.bin"}, {"start": 4934128, "audio": 0, "end": 4935200, "filename": "/shaders/spirv/fs_albedo_output.bin"}, {"start": 4935200, "audio": 0, "end": 4936344, "filename": "/shaders/spirv/vs_shadowmaps_unpackdepth.bin"}, {"start": 4936344, "audio": 0, "end": 4940276, "filename": "/shaders/spirv/vs_shadowmaps_color_lighting_linear_csm.bin"}, {"start": 4940276, "audio": 0, "end": 4943035, "filename": "/shaders/spirv/vs_rsm_lbuffer.bin"}, {"start": 4943035, "audio": 0, "end": 4944597, "filename": "/shaders/spirv/vs_callback.bin"}, {"start": 4944597, "audio": 0, "end": 4945619, "filename": "/shaders/spirv/vs_shadowmaps_packdepth.bin"}, {"start": 4945619, "audio": 0, "end": 4946544, "filename": "/shaders/spirv/fs_rsm_shadow.bin"}, {"start": 4946544, "audio": 0, "end": 4946906, "filename": "/shaders/spirv/fs_sms_shadow.bin"}, {"start": 4946906, "audio": 0, "end": 4953913, "filename": "/shaders/spirv/cs_gdr_stream_compaction.bin"}, {"start": 4953913, "audio": 0, "end": 4957752, "filename": "/shaders/spirv/cs_assao_smart_blur.bin"}, {"start": 4957752, "audio": 0, "end": 4959529, "filename": "/shaders/spirv/vs_wf_wireframe.bin"}, {"start": 4959529, "audio": 0, "end": 4960595, "filename": "/shaders/spirv/fs_shadowvolume_svfronttex1.bin"}, {"start": 4960595, "audio": 0, "end": 4962463, "filename": "/shaders/spirv/vs_stencil_color_lighting.bin"}, {"start": 4962463, "audio": 0, "end": 4963555, "filename": "/shaders/spirv/fs_oit_wb_separate.bin"}, {"start": 4963555, "audio": 0, "end": 4964699, "filename": "/shaders/spirv/vs_rsm_combine.bin"}, {"start": 4964699, "audio": 0, "end": 4965846, "filename": "/shaders/spirv/fs_sms_shadow_pd.bin"}, {"start": 4965846, "audio": 0, "end": 4976799, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_hard_linear_csm.bin"}, {"start": 4976799, "audio": 0, "end": 4980542, "filename": "/shaders/spirv/vs_shadowmaps_color_lighting_linear_omni.bin"}, {"start": 4980542, "audio": 0, "end": 4980948, "filename": "/shaders/spirv/fs_deferred_debug_line.bin"}, {"start": 4980948, "audio": 0, "end": 4983518, "filename": "/shaders/spirv/fs_upsample.bin"}, {"start": 4983518, "audio": 0, "end": 4984389, "filename": "/shaders/spirv/fs_update_cmp.bin"}, {"start": 4984389, "audio": 0, "end": 4987950, "filename": "/shaders/spirv/fs_shadowmaps_hblur_vsm.bin"}, {"start": 4987950, "audio": 0, "end": 4989547, "filename": "/shaders/spirv/fs_shadowvolume_color_texture.bin"}, {"start": 4989547, "audio": 0, "end": 4991682, "filename": "/shaders/spirv/cs_assao_non_smart_half_apply.bin"}, {"start": 4991682, "audio": 0, "end": 5001088, "filename": "/shaders/spirv/cs_assao_prepare_depths_and_normals_half.bin"}, {"start": 5001088, "audio": 0, "end": 5002450, "filename": "/shaders/spirv/fs_vectordisplay_blit.bin"}, {"start": 5002450, "audio": 0, "end": 5004047, "filename": "/shaders/spirv/vs_instancing.bin"}, {"start": 5004047, "audio": 0, "end": 5017040, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_vsm_linear_csm.bin"}, {"start": 5017040, "audio": 0, "end": 5017966, "filename": "/shaders/spirv/fs_callback.bin"}, {"start": 5017966, "audio": 0, "end": 5019244, "filename": "/shaders/spirv/fs_oit_wb_blit.bin"}, {"start": 5019244, "audio": 0, "end": 5023106, "filename": "/shaders/spirv/fs_vectordisplay_blur.bin"}, {"start": 5023106, "audio": 0, "end": 5040009, "filename": "/shaders/spirv/cs_assao_generate_q2.bin"}, {"start": 5040009, "audio": 0, "end": 5042764, "filename": "/shaders/spirv/fs_mesh.bin"}, {"start": 5042764, "audio": 0, "end": 5043685, "filename": "/shaders/spirv/fs_picking_id.bin"}, {"start": 5043685, "audio": 0, "end": 5044829, "filename": "/shaders/spirv/vs_deferred_light.bin"}, {"start": 5044829, "audio": 0, "end": 5048630, "filename": "/shaders/spirv/fs_wf_mesh.bin"}, {"start": 5048630, "audio": 0, "end": 5050446, "filename": "/shaders/spirv/vs_sky_landscape.bin"}, {"start": 5050446, "audio": 0, "end": 5052565, "filename": "/shaders/spirv/cs_gdr_downscale_hi_z.bin"}, {"start": 5052565, "audio": 0, "end": 5053225, "filename": "/shaders/spirv/fs_shadowvolume_svbackcolor.bin"}, {"start": 5053225, "audio": 0, "end": 5062339, "filename": "/shaders/spirv/fs_rsm_combine.bin"}, {"start": 5062339, "audio": 0, "end": 5063692, "filename": "/shaders/spirv/fs_particle.bin"}, {"start": 5063692, "audio": 0, "end": 5065289, "filename": "/shaders/spirv/fs_stencil_color_texture.bin"}, {"start": 5065289, "audio": 0, "end": 5066866, "filename": "/shaders/spirv/vs_gdr_instanced_indirect_rendering.bin"}, {"start": 5066866, "audio": 0, "end": 5085398, "filename": "/shaders/spirv/cs_assao_generate_q3.bin"}, {"start": 5085398, "audio": 0, "end": 5087542, "filename": "/shaders/spirv/vs_tree.bin"}, {"start": 5087542, "audio": 0, "end": 5099788, "filename": "/shaders/spirv/cs_terrain_lod.bin"}, {"start": 5099788, "audio": 0, "end": 5101658, "filename": "/shaders/spirv/vs_hdr_mesh.bin"}, {"start": 5101658, "audio": 0, "end": 5104257, "filename": "/shaders/spirv/vs_shadowmaps_vblur.bin"}, {"start": 5104257, "audio": 0, "end": 5107359, "filename": "/shaders/spirv/fs_cubes.bin.h"}, {"start": 5107359, "audio": 0, "end": 5109022, "filename": "/shaders/spirv/fs_deferred_combine.bin"}, {"start": 5109022, "audio": 0, "end": 5120439, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_esm_csm.bin"}, {"start": 5120439, "audio": 0, "end": 5125050, "filename": "/shaders/spirv/fs_pom.bin"}, {"start": 5125050, "audio": 0, "end": 5126674, "filename": "/shaders/spirv/vs_oit.bin"}, {"start": 5126674, "audio": 0, "end": 5127926, "filename": "/shaders/spirv/fs_gdr_instanced_indirect_rendering.bin"}, {"start": 5127926, "audio": 0, "end": 5128288, "filename": "/shaders/spirv/fs_shadowvolume_svbackblank.bin"}, {"start": 5128288, "audio": 0, "end": 5131310, "filename": "/shaders/spirv/vs_bump.bin"}, {"start": 5131310, "audio": 0, "end": 5134010, "filename": "/shaders/spirv/fs_assao_deferred_combine.bin"}, {"start": 5134010, "audio": 0, "end": 5139942, "filename": "/shaders/spirv/fs_ibl_mesh.bin"}, {"start": 5139942, "audio": 0, "end": 5141086, "filename": "/shaders/spirv/vs_fullscreen.bin"}, {"start": 5141086, "audio": 0, "end": 5143639, "filename": "/shaders/spirv/fs_deferred_geom.bin"}, {"start": 5143639, "audio": 0, "end": 5146981, "filename": "/shaders/spirv/vs_deferred_geom.bin"}, {"start": 5146981, "audio": 0, "end": 5149468, "filename": "/shaders/spirv/cs_assao_non_smart_apply.bin"}, {"start": 5149468, "audio": 0, "end": 5154291, "filename": "/shaders/spirv/fs_shadowvolume_color_lighting.bin"}, {"start": 5154291, "audio": 0, "end": 5165932, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_esm_linear_csm.bin"}, {"start": 5165932, "audio": 0, "end": 5168323, "filename": "/shaders/spirv/vs_shadowmaps_color_lighting.bin"}, {"start": 5168323, "audio": 0, "end": 5174943, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_esm_linear.bin"}, {"start": 5174943, "audio": 0, "end": 5181507, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_esm.bin"}, {"start": 5181507, "audio": 0, "end": 5187887, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_hard.bin"}, {"start": 5187887, "audio": 0, "end": 5189875, "filename": "/shaders/spirv/vs_shadowmaps_texture_lighting.bin"}, {"start": 5189875, "audio": 0, "end": 5191037, "filename": "/shaders/spirv/fs_shadowvolume_svside.bin"}, {"start": 5191037, "audio": 0, "end": 5191971, "filename": "/shaders/spirv/vs_sms_shadow.bin"}, {"start": 5191971, "audio": 0, "end": 5192695, "filename": "/shaders/spirv/fs_shadowvolume_svsidecolor.bin"}, {"start": 5192695, "audio": 0, "end": 5196067, "filename": "/shaders/spirv/fs_sky_landscape.bin"}, {"start": 5196067, "audio": 0, "end": 5199159, "filename": "/shaders/spirv/vs_pom.bin"}, {"start": 5199159, "audio": 0, "end": 5200275, "filename": "/shaders/spirv/vs_cubes.bin"}, {"start": 5200275, "audio": 0, "end": 5201953, "filename": "/shaders/spirv/vs_rsm_gbuffer.bin"}, {"start": 5201953, "audio": 0, "end": 5202704, "filename": "/shaders/spirv/fs_shadowmaps_texture.bin"}, {"start": 5202704, "audio": 0, "end": 5205471, "filename": "/shaders/spirv/vs_mesh.bin"}, {"start": 5205471, "audio": 0, "end": 5206222, "filename": "/shaders/spirv/fs_deferred_debug.bin"}, {"start": 5206222, "audio": 0, "end": 5207366, "filename": "/shaders/spirv/vs_oit_blit.bin"}, {"start": 5207366, "audio": 0, "end": 5209486, "filename": "/shaders/spirv/vs_ibl_skybox.bin"}, {"start": 5209486, "audio": 0, "end": 5226150, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_pcf.bin"}, {"start": 5226150, "audio": 0, "end": 5230857, "filename": "/shaders/spirv/vs_sky.bin"}, {"start": 5230857, "audio": 0, "end": 5236687, "filename": "/shaders/spirv/fs_hdr_lumavg.bin"}, {"start": 5236687, "audio": 0, "end": 5240347, "filename": "/shaders/spirv/vs_shadowmaps_color_lighting_csm.bin"}, {"start": 5240347, "audio": 0, "end": 5250458, "filename": "/shaders/spirv/fs_raymarching.bin"}, {"start": 5250458, "audio": 0, "end": 5251566, "filename": "/shaders/spirv/vs_deferred_debug_line.bin"}, {"start": 5251566, "audio": 0, "end": 5252648, "filename": "/shaders/spirv/fs_shadowvolume_svbacktex1.bin"}, {"start": 5252648, "audio": 0, "end": 5255110, "filename": "/shaders/spirv/vs_hdr_tonemap.bin"}, {"start": 5255110, "audio": 0, "end": 5256254, "filename": "/shaders/spirv/vs_stencil_color_texture.bin"}, {"start": 5256254, "audio": 0, "end": 5258725, "filename": "/shaders/spirv/vs_shadowmaps_color_lighting_linear.bin"}, {"start": 5258725, "audio": 0, "end": 5260074, "filename": "/shaders/spirv/vs_gdr_render_occlusion.bin"}, {"start": 5260074, "audio": 0, "end": 5261202, "filename": "/shaders/spirv/vs_assao.bin"}, {"start": 5261202, "audio": 0, "end": 5264438, "filename": "/shaders/spirv/vs_bump_instanced.bin"}, {"start": 5264438, "audio": 0, "end": 5266579, "filename": "/shaders/spirv/vs_albedo_output.bin"}, {"start": 5266579, "audio": 0, "end": 5268154, "filename": "/shaders/spirv/fs_shadowvolume_svsidetex.bin"}, {"start": 5268154, "audio": 0, "end": 5269236, "filename": "/shaders/spirv/fs_shadowvolume_svbacktex2.bin"}, {"start": 5269236, "audio": 0, "end": 5269896, "filename": "/shaders/spirv/fs_shadowvolume_svfrontcolor.bin"}, {"start": 5269896, "audio": 0, "end": 5276824, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_vsm_linear.bin"}, {"start": 5276824, "audio": 0, "end": 5278750, "filename": "/shaders/spirv/vs_shadowvolume_color_lighting.bin"}, {"start": 5278750, "audio": 0, "end": 5281464, "filename": "/shaders/spirv/cs_assao_postprocess_importance_map_a.bin"}, {"start": 5281464, "audio": 0, "end": 5282678, "filename": "/shaders/spirv/cs_indirect.bin"}, {"start": 5282678, "audio": 0, "end": 5283040, "filename": "/shaders/spirv/fs_stencil_color_black.bin"}, {"start": 5283040, "audio": 0, "end": 5283834, "filename": "/shaders/spirv/fs_shadowmaps_packdepth.bin"}, {"start": 5283834, "audio": 0, "end": 5287305, "filename": "/shaders/spirv/vs_shadowmaps_color_lighting_omni.bin"}, {"start": 5287305, "audio": 0, "end": 5293086, "filename": "/shaders/spirv/cs_gdr_occlude_props.bin"}, {"start": 5293086, "audio": 0, "end": 5294398, "filename": "/shaders/spirv/vs_shadowvolume_svback.bin"}, {"start": 5294398, "audio": 0, "end": 5296997, "filename": "/shaders/spirv/vs_shadowmaps_hblur.bin"}, {"start": 5296997, "audio": 0, "end": 5299530, "filename": "/shaders/spirv/fs_shadowmaps_vblur.bin"}, {"start": 5299530, "audio": 0, "end": 5310065, "filename": "/shaders/spirv/cs_assao_generate_q0.bin"}, {"start": 5310065, "audio": 0, "end": 5311131, "filename": "/shaders/spirv/fs_shadowvolume_svfronttex2.bin"}, {"start": 5311131, "audio": 0, "end": 5312275, "filename": "/shaders/spirv/vs_hdr_bright.bin"}, {"start": 5312275, "audio": 0, "end": 5315089, "filename": "/shaders/spirv/fs_deferred_light.bin"}, {"start": 5315089, "audio": 0, "end": 5316430, "filename": "/shaders/spirv/fs_shadowmaps_unpackdepth.bin"}, {"start": 5316430, "audio": 0, "end": 5319112, "filename": "/shaders/spirv/fs_sky_color_banding_fix.bin"}, {"start": 5319112, "audio": 0, "end": 5327244, "filename": "/shaders/spirv/vs_cubes.bin.h"}, {"start": 5327244, "audio": 0, "end": 5330194, "filename": "/shaders/spirv/cs_assao_generate_importance_map.bin"}, {"start": 5330194, "audio": 0, "end": 5331068, "filename": "/shaders/spirv/fs_shadowmaps_packdepth_vsm_linear.bin"}, {"start": 5331068, "audio": 0, "end": 5332002, "filename": "/shaders/spirv/vs_shadowmaps_color.bin"}, {"start": 5332002, "audio": 0, "end": 5333692, "filename": "/shaders/spirv/fs_vt_mip.bin"}, {"start": 5333692, "audio": 0, "end": 5334836, "filename": "/shaders/spirv/vs_shadowmaps_color_texture.bin"}, {"start": 5334836, "audio": 0, "end": 5336054, "filename": "/shaders/spirv/fs_vectordisplay_fb.bin"}, {"start": 5336054, "audio": 0, "end": 5340244, "filename": "/shaders/spirv/fs_hdr_lum.bin"}, {"start": 5340244, "audio": 0, "end": 5341266, "filename": "/shaders/spirv/vs_sms_shadow_pd.bin"}, {"start": 5341266, "audio": 0, "end": 5358086, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_pcf_linear.bin"}, {"start": 5358086, "audio": 0, "end": 5359511, "filename": "/shaders/spirv/fs_terrain_render.bin"}, {"start": 5359511, "audio": 0, "end": 5363278, "filename": "/shaders/spirv/cs_update_instances.bin"}, {"start": 5363278, "audio": 0, "end": 5365008, "filename": "/shaders/spirv/fs_hdr_skybox.bin"}, {"start": 5365008, "audio": 0, "end": 5366670, "filename": "/shaders/spirv/vs_shadowvolume_svside.bin"}, {"start": 5366670, "audio": 0, "end": 5380892, "filename": "/shaders/spirv/cs_assao_prepare_depths_and_normals.bin"}, {"start": 5380892, "audio": 0, "end": 5382004, "filename": "/shaders/spirv/vs_update.bin"}, {"start": 5382004, "audio": 0, "end": 5385252, "filename": "/shaders/spirv/fs_downsample.bin"}, {"start": 5385252, "audio": 0, "end": 5386002, "filename": "/shaders/spirv/fs_update.bin"}, {"start": 5386002, "audio": 0, "end": 5386936, "filename": "/shaders/spirv/vs_stencil_color.bin"}, {"start": 5386936, "audio": 0, "end": 5400919, "filename": "/shaders/spirv/cs_assao_generate_q1.bin"}, {"start": 5400919, "audio": 0, "end": 5402859, "filename": "/shaders/spirv/vs_assao_gbuffer.bin"}, {"start": 5402859, "audio": 0, "end": 5404198, "filename": "/shaders/spirv/fs_bloom_combine.bin"}, {"start": 5404198, "audio": 0, "end": 5405603, "filename": "/shaders/spirv/fs_terrain_render_normal.bin"}, {"start": 5405603, "audio": 0, "end": 5406881, "filename": "/shaders/spirv/fs_oit_wb_separate_blit.bin"}, {"start": 5406881, "audio": 0, "end": 5410047, "filename": "/shaders/spirv/fs_hdr_mesh.bin"}, {"start": 5410047, "audio": 0, "end": 5412675, "filename": "/shaders/spirv/fs_rsm_lbuffer.bin"}, {"start": 5412675, "audio": 0, "end": 5417606, "filename": "/shaders/spirv/fs_bump.bin"}, {"start": 5417606, "audio": 0, "end": 5419144, "filename": "/shaders/spirv/vs_rsm_shadow.bin"}, {"start": 5419144, "audio": 0, "end": 5428034, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_hard_linear_omni.bin"}, {"start": 5428034, "audio": 0, "end": 5430177, "filename": "/shaders/spirv/vs_picking_shaded.bin"}, {"start": 5430177, "audio": 0, "end": 5434987, "filename": "/shaders/spirv/fs_hdr_tonemap.bin"}, {"start": 5434987, "audio": 0, "end": 5438116, "filename": "/shaders/spirv/cs_assao_prepare_depths.bin"}, {"start": 5438116, "audio": 0, "end": 5439477, "filename": "/shaders/spirv/cs_gdr_copy_z.bin"}, {"start": 5439477, "audio": 0, "end": 5458787, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_pcf_linear_omni.bin"}, {"start": 5458787, "audio": 0, "end": 5459622, "filename": "/shaders/spirv/fs_rsm_gbuffer.bin"}, {"start": 5459622, "audio": 0, "end": 5460322, "filename": "/shaders/spirv/fs_deferred_clear_uav.bin"}, {"start": 5460322, "audio": 0, "end": 5462555, "filename": "/shaders/spirv/cs_assao_prepare_depths_half.bin"}, {"start": 5462555, "audio": 0, "end": 5465901, "filename": "/shaders/spirv/cs_assao_postprocess_importance_map_b.bin"}, {"start": 5465901, "audio": 0, "end": 5467045, "filename": "/shaders/spirv/vs_shadowvolume_color_texture.bin"}, {"start": 5467045, "audio": 0, "end": 5477492, "filename": "/shaders/spirv/cs_assao_generate_q3base.bin"}, {"start": 5477492, "audio": 0, "end": 5482846, "filename": "/shaders/spirv/cs_assao_prepare_depth_mip.bin"}, {"start": 5482846, "audio": 0, "end": 5483272, "filename": "/shaders/spirv/fs_shadowvolume_svsideblank.bin"}, {"start": 5483272, "audio": 0, "end": 5488361, "filename": "/shaders/spirv/fs_hdr_bright.bin"}, {"start": 5488361, "audio": 0, "end": 5490894, "filename": "/shaders/spirv/fs_shadowmaps_hblur.bin"}, {"start": 5490894, "audio": 0, "end": 5499968, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_esm_linear_omni.bin"}, {"start": 5499968, "audio": 0, "end": 5500608, "filename": "/shaders/spirv/fs_oit.bin"}, {"start": 5500608, "audio": 0, "end": 5507044, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_hard_linear.bin"}, {"start": 5507044, "audio": 0, "end": 5509697, "filename": "/shaders/spirv/fs_vt_unlit.bin"}, {"start": 5509697, "audio": 0, "end": 5510841, "filename": "/shaders/spirv/vs_hdr_skybox.bin"}, {"start": 5510841, "audio": 0, "end": 5514402, "filename": "/shaders/spirv/fs_shadowmaps_vblur_vsm.bin"}, {"start": 5514402, "audio": 0, "end": 5516641, "filename": "/shaders/spirv/vs_sms_mesh.bin"}, {"start": 5516641, "audio": 0, "end": 5518329, "filename": "/shaders/spirv/cs_update.bin"}, {"start": 5518329, "audio": 0, "end": 5519473, "filename": "/shaders/spirv/vs_shadowvolume_texture.bin"}, {"start": 5519473, "audio": 0, "end": 5520799, "filename": "/shaders/spirv/vs_raymarching.bin"}, {"start": 5520799, "audio": 0, "end": 5523903, "filename": "/shaders/spirv/fs_deferred_light_uav.bin"}, {"start": 5523903, "audio": 0, "end": 5524654, "filename": "/shaders/spirv/fs_shadowvolume_texture.bin"}, {"start": 5524654, "audio": 0, "end": 5525798, "filename": "/shaders/spirv/vs_hdr_lum.bin"}, {"start": 5525798, "audio": 0, "end": 5527443, "filename": "/shaders/spirv/fs_wf_wireframe.bin"}, {"start": 5527443, "audio": 0, "end": 5528779, "filename": "/shaders/spirv/fs_update_3d.bin"}, {"start": 5528779, "audio": 0, "end": 5532796, "filename": "/shaders/spirv/vs_terrain_render.bin"}, {"start": 5532796, "audio": 0, "end": 5533730, "filename": "/shaders/spirv/vs_shadowmaps_depth.bin"}, {"start": 5533730, "audio": 0, "end": 5535803, "filename": "/shaders/spirv/vs_ibl_mesh.bin"}, {"start": 5535803, "audio": 0, "end": 5536554, "filename": "/shaders/spirv/fs_stencil_texture.bin"}, {"start": 5536554, "audio": 0, "end": 5537664, "filename": "/shaders/spirv/vs_shadowmaps_packdepth_linear.bin"}, {"start": 5537664, "audio": 0, "end": 5538808, "filename": "/shaders/spirv/vs_deferred_combine.bin"}, {"start": 5538808, "audio": 0, "end": 5539214, "filename": "/shaders/spirv/fs_cubes.bin"}, {"start": 5539214, "audio": 0, "end": 5548596, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_vsm_linear_omni.bin"}, {"start": 5548596, "audio": 0, "end": 5549058, "filename": "/shaders/spirv/fs_shadowvolume_svfrontblank.bin"}, {"start": 5549058, "audio": 0, "end": 5550052, "filename": "/shaders/spirv/fs_shadowmaps_packdepth_vsm.bin"}, {"start": 5550052, "audio": 0, "end": 5551726, "filename": "/shaders/spirv/vs_terrain_height_texture.bin"}, {"start": 5551726, "audio": 0, "end": 5552870, "filename": "/shaders/spirv/vs_hdr_lumavg.bin"}, {"start": 5552870, "audio": 0, "end": 5555812, "filename": "/shaders/spirv/fs_deferred_light_ta.bin"}, {"start": 5555812, "audio": 0, "end": 5560803, "filename": "/shaders/spirv/cs_assao_smart_blur_wide.bin"}, {"start": 5560803, "audio": 0, "end": 5569840, "filename": "/shaders/spirv/fs_sms_mesh_pd.bin"}, {"start": 5569840, "audio": 0, "end": 5574591, "filename": "/shaders/spirv/cs_assao_apply.bin"}, {"start": 5574591, "audio": 0, "end": 5576579, "filename": "/shaders/spirv/vs_shadowvolume_texture_lighting.bin"}, {"start": 5576579, "audio": 0, "end": 5578105, "filename": "/shaders/spirv/fs_picking_shaded.bin"}, {"start": 5578105, "audio": 0, "end": 5588652, "filename": "/shaders/spirv/cs_init_instances.bin"}, {"start": 5588652, "audio": 0, "end": 5593918, "filename": "/shaders/spirv/fs_shadowvolume_texture_lighting.bin"}, {"start": 5593918, "audio": 0, "end": 5602936, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_esm_omni.bin"}, {"start": 5602936, "audio": 0, "end": 5604080, "filename": "/shaders/spirv/vs_shadowmaps_texture.bin"}, {"start": 5604080, "audio": 0, "end": 5604754, "filename": "/shaders/spirv/fs_shadowmaps_packdepth_linear.bin"}, {"start": 5604754, "audio": 0, "end": 5613763, "filename": "/shaders/spirv/fs_sms_mesh.bin"}, {"start": 5613763, "audio": 0, "end": 5632917, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_pcf_omni.bin"}, {"start": 5632917, "audio": 0, "end": 5634165, "filename": "/shaders/spirv/vs_terrain.bin"}, {"start": 5634165, "audio": 0, "end": 5636685, "filename": "/shaders/spirv/cs_terrain_init.bin"}, {"start": 5636685, "audio": 0, "end": 5639656, "filename": "/shaders/spirv/fs_tree.bin"}, {"start": 5639656, "audio": 0, "end": 5640985, "filename": "/shaders/spirv/fs_shadowmaps_unpackdepth_vsm.bin"}, {"start": 5640985, "audio": 0, "end": 5642129, "filename": "/shaders/spirv/vs_stencil_texture.bin"}, {"start": 5642129, "audio": 0, "end": 5643586, "filename": "/shaders/spirv/vs_vt_generic.bin"}, {"start": 5643586, "audio": 0, "end": 5650458, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_vsm.bin"}, {"start": 5650458, "audio": 0, "end": 5659784, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_vsm_omni.bin"}, {"start": 5659784, "audio": 0, "end": 5660146, "filename": "/shaders/spirv/fs_shadowmaps_color_black.bin"}, {"start": 5660146, "audio": 0, "end": 5670875, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_hard_csm.bin"}, {"start": 5670875, "audio": 0, "end": 5683644, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_vsm_csm.bin"}, {"start": 5683644, "audio": 0, "end": 5684813, "filename": "/shaders/spirv/cs_terrain_update_indirect.bin"}, {"start": 5684813, "audio": 0, "end": 5685219, "filename": "/shaders/spirv/fs_instancing.bin"}, {"start": 5685219, "audio": 0, "end": 5687250, "filename": "/shaders/spirv/vs_particle.bin"}, {"start": 5687250, "audio": 0, "end": 5687804, "filename": "/shaders/spirv/cs_assao_load_counter_clear.bin"}, {"start": 5687804, "audio": 0, "end": 5691240, "filename": "/shaders/spirv/fs_ibl_skybox.bin"}, {"start": 5691240, "audio": 0, "end": 5691906, "filename": "/shaders/spirv/fs_terrain.bin"}, {"start": 5691906, "audio": 0, "end": 5693050, "filename": "/shaders/spirv/vs_deferred_debug.bin"}, {"start": 5693050, "audio": 0, "end": 5743571, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_pcf_csm.bin"}, {"start": 5743571, "audio": 0, "end": 5745168, "filename": "/shaders/spirv/fs_shadowmaps_color_texture.bin"}, {"start": 5745168, "audio": 0, "end": 5796313, "filename": "/shaders/spirv/fs_shadowmaps_color_lighting_pcf_linear_csm.bin"}, {"start": 5796313, "audio": 0, "end": 5798301, "filename": "/shaders/spirv/vs_stencil_texture_lighting.bin"}, {"start": 5798301, "audio": 0, "end": 5798304, "filename": "/shaders/pssl/.gitignore"}, {"start": 5798304, "audio": 0, "end": 5822479, "filename": "/meshes/tricube.bin"}, {"start": 5822479, "audio": 0, "end": 5876498, "filename": "/meshes/column.bin"}, {"start": 5876498, "audio": 0, "end": 8694600, "filename": "/meshes/orb.bin"}, {"start": 8694600, "audio": 0, "end": 8713420, "filename": "/meshes/tree1b_lod1_1.bin"}, {"start": 8713420, "audio": 0, "end": 8714350, "filename": "/meshes/cube.bin"}, {"start": 8714350, "audio": 0, "end": 8725947, "filename": "/meshes/tree1b_lod2_1.bin"}, {"start": 8725947, "audio": 0, "end": 8727554, "filename": "/meshes/platform.bin"}, {"start": 8727554, "audio": 0, "end": 8827607, "filename": "/meshes/bunny_decimated.bin"}, {"start": 8827607, "audio": 0, "end": 8853158, "filename": "/meshes/tree1b_lod0_1.bin"}, {"start": 8853158, "audio": 0, "end": 9828769, "filename": "/meshes/bunny_patched.bin"}, {"start": 9828769, "audio": 0, "end": 9833464, "filename": "/meshes/tree1b_lod2_2.bin"}, {"start": 9833464, "audio": 0, "end": 9975324, "filename": "/meshes/test_scene.bin"}, {"start": 9975324, "audio": 0, "end": 9992518, "filename": "/meshes/tree1b_lod0_2.bin"}, {"start": 9992518, "audio": 0, "end": 10046826, "filename": "/meshes/tree.bin"}, {"start": 10046826, "audio": 0, "end": 12635236, "filename": "/meshes/bunny.bin"}, {"start": 12635236, "audio": 0, "end": 12673117, "filename": "/meshes/hollowcube.bin"}, {"start": 12673117, "audio": 0, "end": 12679630, "filename": "/meshes/unit_sphere.bin"}, {"start": 12679630, "audio": 0, "end": 12689440, "filename": "/meshes/tree1b_lod1_2.bin"}, {"start": 12689440, "audio": 0, "end": 12700080, "filename": "/textures/texture_compression_astc_6x6.dds"}, {"start": 12700080, "audio": 0, "end": 12722080, "filename": "/textures/texture_compression_astc_4x4.dds"}, {"start": 12722080, "audio": 0, "end": 22648708, "filename": "/textures/8k_mars.jpg"}, {"start": 22648708, "audio": 0, "end": 22736216, "filename": "/textures/parallax-d.ktx"}, {"start": 22736216, "audio": 0, "end": 22911120, "filename": "/textures/figure-rgba.dds"}, {"start": 22911120, "audio": 0, "end": 22918768, "filename": "/textures/texture_compression_astc_10x5.dds"}, {"start": 22918768, "audio": 0, "end": 27113204, "filename": "/textures/bolonga_lod.dds"}, {"start": 27113204, "audio": 0, "end": 27178808, "filename": "/textures/parallax-h.ktx"}, {"start": 27178808, "audio": 0, "end": 27528488, "filename": "/textures/fieldstone-rgba.dds"}, {"start": 27528488, "audio": 0, "end": 27543288, "filename": "/textures/texture_compression_astc_5x5.dds"}, {"start": 27543288, "audio": 0, "end": 27805500, "filename": "/textures/particle.ktx"}, {"start": 27805500, "audio": 0, "end": 27809648, "filename": "/textures/texture_compression_ptc12.pvr"}, {"start": 27809648, "audio": 0, "end": 40392628, "filename": "/textures/uffizi.ktx"}, {"start": 40392628, "audio": 0, "end": 40400872, "filename": "/textures/texture_compression_ptc24.pvr"}, {"start": 40400872, "audio": 0, "end": 40422840, "filename": "/textures/texture_compression_bc7.ktx"}, {"start": 40422840, "audio": 0, "end": 40772520, "filename": "/textures/fieldstone-n.dds"}, {"start": 40772520, "audio": 0, "end": 41305616, "filename": "/textures/fieldstone-rgba.png"}, {"start": 41305616, "audio": 0, "end": 42092196, "filename": "/textures/bolonga_irr.dds"}, {"start": 42092196, "audio": 0, "end": 42103228, "filename": "/textures/texture_compression_etc1.ktx"}, {"start": 42103228, "audio": 0, "end": 46297664, "filename": "/textures/kyoto_lod.dds"}, {"start": 46297664, "audio": 0, "end": 46319632, "filename": "/textures/texture_compression_bc2.ktx"}, {"start": 46319632, "audio": 0, "end": 46327876, "filename": "/textures/texture_compression_ptc14.pvr"}, {"start": 46327876, "audio": 0, "end": 47114456, "filename": "/textures/kyoto_irr.dds"}, {"start": 47114456, "audio": 0, "end": 47289360, "filename": "/textures/bark1.dds"}, {"start": 47289360, "audio": 0, "end": 47311360, "filename": "/textures/texture_compression_atci.dds"}, {"start": 47311360, "audio": 0, "end": 47320464, "filename": "/textures/texture_compression_astc_8x5.dds"}, {"start": 47320464, "audio": 0, "end": 48718720, "filename": "/textures/leafs1.dds"}, {"start": 48718720, "audio": 0, "end": 48726448, "filename": "/textures/texture_compression_astc_8x6.dds"}, {"start": 48726448, "audio": 0, "end": 49275690, "filename": "/textures/fieldstone-n.png"}, {"start": 49275690, "audio": 0, "end": 68268601, "filename": "/textures/dmap.png"}, {"start": 68268601, "audio": 0, "end": 68618281, "filename": "/textures/flare.dds"}, {"start": 68618281, "audio": 0, "end": 68622429, "filename": "/textures/texture_compression_ptc22.pvr"}, {"start": 68622429, "audio": 0, "end": 68644429, "filename": "/textures/texture_compression_atce.dds"}, {"start": 68644429, "audio": 0, "end": 68655461, "filename": "/textures/texture_compression_bc1.ktx"}, {"start": 68655461, "audio": 0, "end": 69704105, "filename": "/textures/lightmap.ktx"}, {"start": 69704105, "audio": 0, "end": 69791613, "filename": "/textures/parallax-n.ktx"}, {"start": 69791613, "audio": 0, "end": 69813581, "filename": "/textures/texture_compression_bc3.ktx"}, {"start": 69813581, "audio": 0, "end": 69824613, "filename": "/textures/texture_compression_etc2.ktx"}, {"start": 69824613, "audio": 0, "end": 69835677, "filename": "/textures/texture_compression_atc.dds"}, {"start": 69835677, "audio": 0, "end": 69838365, "filename": "/textures/msdf.png"}, {"start": 69838365, "audio": 0, "end": 69842183, "filename": "/images/image11.jpg"}, {"start": 69842183, "audio": 0, "end": 69866274, "filename": "/images/image2.jpg"}, {"start": 69866274, "audio": 0, "end": 69869713, "filename": "/images/image10.jpg"}, {"start": 69869713, "audio": 0, "end": 69893543, "filename": "/images/image4.jpg"}, {"start": 69893543, "audio": 0, "end": 69918659, "filename": "/images/image6.jpg"}, {"start": 69918659, "audio": 0, "end": 69945790, "filename": "/images/image5.jpg"}, {"start": 69945790, "audio": 0, "end": 69970397, "filename": "/images/image8.jpg"}, {"start": 69970397, "audio": 0, "end": 69995987, "filename": "/images/image7.jpg"}, {"start": 69995987, "audio": 0, "end": 70236831, "filename": "/images/blender_icons16.png"}, {"start": 70236831, "audio": 0, "end": 70266113, "filename": "/images/image3.jpg"}, {"start": 70266113, "audio": 0, "end": 70270148, "filename": "/images/image9.jpg"}, {"start": 70270148, "audio": 0, "end": 70275600, "filename": "/images/image12.jpg"}, {"start": 70275600, "audio": 0, "end": 70301360, "filename": "/images/image1.jpg"}, {"start": 70301360, "audio": 0, "end": 70306005, "filename": "/images/SplashScreen.png"}], "remote_package_size": 70306005, "package_uuid": "93e76632-ca8d-413a-a2c7-3a216aa0f854"});
  
  })();
  


// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
var key;
for (key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

var arguments_ = [];
var thisProgram = './this.program';
var quit_ = function(status, toThrow) {
  throw toThrow;
};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_HAS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;
ENVIRONMENT_IS_WEB = typeof window === 'object';
ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
// A web environment like Electron.js can have Node enabled, so we must
// distinguish between Node-enabled environments and Node environments per se.
// This will allow the former to do things like mount NODEFS.
// Extended check using process.versions fixes issue #8816.
// (Also makes redundant the original check that 'require' is a function.)
ENVIRONMENT_HAS_NODE = typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string';
ENVIRONMENT_IS_NODE = ENVIRONMENT_HAS_NODE && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (Module['ENVIRONMENT']) {
  throw new Error('Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)');
}



// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var read_,
    readAsync,
    readBinary,
    setWindowTitle;

var nodeFS;
var nodePath;

if (ENVIRONMENT_IS_NODE) {
  scriptDirectory = __dirname + '/';


  read_ = function shell_read(filename, binary) {
    if (!nodeFS) nodeFS = require('fs');
    if (!nodePath) nodePath = require('path');
    filename = nodePath['normalize'](filename);
    return nodeFS['readFileSync'](filename, binary ? null : 'utf8');
  };

  readBinary = function readBinary(filename) {
    var ret = read_(filename, true);
    if (!ret.buffer) {
      ret = new Uint8Array(ret);
    }
    assert(ret.buffer);
    return ret;
  };




  if (process['argv'].length > 1) {
    thisProgram = process['argv'][1].replace(/\\/g, '/');
  }

  arguments_ = process['argv'].slice(2);

  if (typeof module !== 'undefined') {
    module['exports'] = Module;
  }

  process['on']('uncaughtException', function(ex) {
    // suppress ExitStatus exceptions from showing an error
    if (!(ex instanceof ExitStatus)) {
      throw ex;
    }
  });

  process['on']('unhandledRejection', abort);

  quit_ = function(status) {
    process['exit'](status);
  };

  Module['inspect'] = function () { return '[Emscripten Module object]'; };


} else
if (ENVIRONMENT_IS_SHELL) {


  if (typeof read != 'undefined') {
    read_ = function shell_read(f) {
      return read(f);
    };
  }

  readBinary = function readBinary(f) {
    var data;
    if (typeof readbuffer === 'function') {
      return new Uint8Array(readbuffer(f));
    }
    data = read(f, 'binary');
    assert(typeof data === 'object');
    return data;
  };

  if (typeof scriptArgs != 'undefined') {
    arguments_ = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    arguments_ = arguments;
  }

  if (typeof quit === 'function') {
    quit_ = function(status) {
      quit(status);
    };
  }

  if (typeof print !== 'undefined') {
    // Prefer to use print/printErr where they exist, as they usually work better.
    if (typeof console === 'undefined') console = {};
    console.log = print;
    console.warn = console.error = typeof printErr !== 'undefined' ? printErr : print;
  }
} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_HAS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
    scriptDirectory = self.location.href;
  } else if (document.currentScript) { // web
    scriptDirectory = document.currentScript.src;
  }
  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
  // otherwise, slice off the final part of the url to find the script directory.
  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
  // and scriptDirectory will correctly be replaced with an empty string.
  if (scriptDirectory.indexOf('blob:') !== 0) {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf('/')+1);
  } else {
    scriptDirectory = '';
  }


  // Differentiate the Web Worker from the Node Worker case, as reading must
  // be done differently.
  {


  read_ = function shell_read(url) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.send(null);
      return xhr.responseText;
  };

  if (ENVIRONMENT_IS_WORKER) {
    readBinary = function readBinary(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
        return new Uint8Array(xhr.response);
    };
  }

  readAsync = function readAsync(url, onload, onerror) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function xhr_onload() {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
        onload(xhr.response);
        return;
      }
      onerror();
    };
    xhr.onerror = onerror;
    xhr.send(null);
  };




  }

  setWindowTitle = function(title) { document.title = title };
} else
{
  throw new Error('environment detection error');
}


// Set up the out() and err() hooks, which are how we can print to stdout or
// stderr, respectively.
var out = Module['print'] || console.log.bind(console);
var err = Module['printErr'] || console.warn.bind(console);

// Merge back in the overrides
for (key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
moduleOverrides = null;

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.
if (Module['arguments']) arguments_ = Module['arguments'];if (!Object.getOwnPropertyDescriptor(Module, 'arguments')) Object.defineProperty(Module, 'arguments', { configurable: true, get: function() { abort('Module.arguments has been replaced with plain arguments_') } });
if (Module['thisProgram']) thisProgram = Module['thisProgram'];if (!Object.getOwnPropertyDescriptor(Module, 'thisProgram')) Object.defineProperty(Module, 'thisProgram', { configurable: true, get: function() { abort('Module.thisProgram has been replaced with plain thisProgram') } });
if (Module['quit']) quit_ = Module['quit'];if (!Object.getOwnPropertyDescriptor(Module, 'quit')) Object.defineProperty(Module, 'quit', { configurable: true, get: function() { abort('Module.quit has been replaced with plain quit_') } });

// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
// Assertions on removed incoming Module JS APIs.
assert(typeof Module['memoryInitializerPrefixURL'] === 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['pthreadMainPrefixURL'] === 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['cdInitializerPrefixURL'] === 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['filePackagePrefixURL'] === 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['read'] === 'undefined', 'Module.read option was removed (modify read_ in JS)');
assert(typeof Module['readAsync'] === 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
assert(typeof Module['readBinary'] === 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
assert(typeof Module['setWindowTitle'] === 'undefined', 'Module.setWindowTitle option was removed (modify setWindowTitle in JS)');
if (!Object.getOwnPropertyDescriptor(Module, 'read')) Object.defineProperty(Module, 'read', { configurable: true, get: function() { abort('Module.read has been replaced with plain read_') } });
if (!Object.getOwnPropertyDescriptor(Module, 'readAsync')) Object.defineProperty(Module, 'readAsync', { configurable: true, get: function() { abort('Module.readAsync has been replaced with plain readAsync') } });
if (!Object.getOwnPropertyDescriptor(Module, 'readBinary')) Object.defineProperty(Module, 'readBinary', { configurable: true, get: function() { abort('Module.readBinary has been replaced with plain readBinary') } });
// TODO: add when SDL2 is fixed if (!Object.getOwnPropertyDescriptor(Module, 'setWindowTitle')) Object.defineProperty(Module, 'setWindowTitle', { configurable: true, get: function() { abort('Module.setWindowTitle has been replaced with plain setWindowTitle') } });
var IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';


// TODO remove when SDL2 is fixed (also see above)



// Copyright 2017 The Emscripten Authors.  All rights reserved.
// Emscripten is available under two separate licenses, the MIT license and the
// University of Illinois/NCSA Open Source License.  Both these licenses can be
// found in the LICENSE file.

// {{PREAMBLE_ADDITIONS}}

var STACK_ALIGN = 16;

// stack management, and other functionality that is provided by the compiled code,
// should not be used before it is ready
stackSave = stackRestore = stackAlloc = function() {
  abort('cannot use the stack before compiled code is ready to run, and has provided stack access');
};

function staticAlloc(size) {
  abort('staticAlloc is no longer available at runtime; instead, perform static allocations at compile time (using makeStaticAlloc)');
}

function dynamicAlloc(size) {
  assert(DYNAMICTOP_PTR);
  var ret = HEAP32[DYNAMICTOP_PTR>>2];
  var end = (ret + size + 15) & -16;
  if (end > _emscripten_get_heap_size()) {
    abort('failure to dynamicAlloc - memory growth etc. is not supported there, call malloc/sbrk directly');
  }
  HEAP32[DYNAMICTOP_PTR>>2] = end;
  return ret;
}

function alignMemory(size, factor) {
  if (!factor) factor = STACK_ALIGN; // stack alignment (16-byte) by default
  return Math.ceil(size / factor) * factor;
}

function getNativeTypeSize(type) {
  switch (type) {
    case 'i1': case 'i8': return 1;
    case 'i16': return 2;
    case 'i32': return 4;
    case 'i64': return 8;
    case 'float': return 4;
    case 'double': return 8;
    default: {
      if (type[type.length-1] === '*') {
        return 4; // A pointer
      } else if (type[0] === 'i') {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 === 0, 'getNativeTypeSize invalid bits ' + bits + ', type ' + type);
        return bits / 8;
      } else {
        return 0;
      }
    }
  }
}

function warnOnce(text) {
  if (!warnOnce.shown) warnOnce.shown = {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    err(text);
  }
}





// Wraps a JS function as a wasm function with a given signature.
function convertJsFunctionToWasm(func, sig) {

  // If the type reflection proposal is available, use the new
  // "WebAssembly.Function" constructor.
  // Otherwise, construct a minimal wasm module importing the JS function and
  // re-exporting it.
  if (typeof WebAssembly.Function === "function") {
    var typeNames = {
      'i': 'i32',
      'j': 'i64',
      'f': 'f32',
      'd': 'f64'
    };
    var type = {
      parameters: [],
      results: sig[0] == 'v' ? [] : [typeNames[sig[0]]]
    };
    for (var i = 1; i < sig.length; ++i) {
      type.parameters.push(typeNames[sig[i]]);
    }
    return new WebAssembly.Function(type, func);
  }

  // The module is static, with the exception of the type section, which is
  // generated based on the signature passed in.
  var typeSection = [
    0x01, // id: section,
    0x00, // length: 0 (placeholder)
    0x01, // count: 1
    0x60, // form: func
  ];
  var sigRet = sig.slice(0, 1);
  var sigParam = sig.slice(1);
  var typeCodes = {
    'i': 0x7f, // i32
    'j': 0x7e, // i64
    'f': 0x7d, // f32
    'd': 0x7c, // f64
  };

  // Parameters, length + signatures
  typeSection.push(sigParam.length);
  for (var i = 0; i < sigParam.length; ++i) {
    typeSection.push(typeCodes[sigParam[i]]);
  }

  // Return values, length + signatures
  // With no multi-return in MVP, either 0 (void) or 1 (anything else)
  if (sigRet == 'v') {
    typeSection.push(0x00);
  } else {
    typeSection = typeSection.concat([0x01, typeCodes[sigRet]]);
  }

  // Write the overall length of the type section back into the section header
  // (excepting the 2 bytes for the section id and length)
  typeSection[1] = typeSection.length - 2;

  // Rest of the module is static
  var bytes = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, // magic ("\0asm")
    0x01, 0x00, 0x00, 0x00, // version: 1
  ].concat(typeSection, [
    0x02, 0x07, // import section
      // (import "e" "f" (func 0 (type 0)))
      0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00,
    0x07, 0x05, // export section
      // (export "f" (func 0 (type 0)))
      0x01, 0x01, 0x66, 0x00, 0x00,
  ]));

   // We can compile this wasm module synchronously because it is very small.
  // This accepts an import (at "e.f"), that it reroutes to an export (at "f")
  var module = new WebAssembly.Module(bytes);
  var instance = new WebAssembly.Instance(module, {
    'e': {
      'f': func
    }
  });
  var wrappedFunc = instance.exports['f'];
  return wrappedFunc;
}

// Add a wasm function to the table.
function addFunctionWasm(func, sig) {
  var table = wasmTable;
  var ret = table.length;

  // Grow the table
  try {
    table.grow(1);
  } catch (err) {
    if (!(err instanceof RangeError)) {
      throw err;
    }
    throw 'Unable to grow wasm table. Use a higher value for RESERVED_FUNCTION_POINTERS or set ALLOW_TABLE_GROWTH.';
  }

  // Insert new element
  try {
    // Attempting to call this with JS function will cause of table.set() to fail
    table.set(ret, func);
  } catch (err) {
    if (!(err instanceof TypeError)) {
      throw err;
    }
    assert(typeof sig !== 'undefined', 'Missing signature argument to addFunction');
    var wrapped = convertJsFunctionToWasm(func, sig);
    table.set(ret, wrapped);
  }

  return ret;
}

function removeFunctionWasm(index) {
  // TODO(sbc): Look into implementing this to allow re-using of table slots
}

// 'sig' parameter is required for the llvm backend but only when func is not
// already a WebAssembly function.
function addFunction(func, sig) {
  assert(typeof func !== 'undefined');

  return addFunctionWasm(func, sig);
}

function removeFunction(index) {
  removeFunctionWasm(index);
}

var funcWrappers = {};

function getFuncWrapper(func, sig) {
  if (!func) return; // on null pointer, return undefined
  assert(sig);
  if (!funcWrappers[sig]) {
    funcWrappers[sig] = {};
  }
  var sigCache = funcWrappers[sig];
  if (!sigCache[func]) {
    // optimize away arguments usage in common cases
    if (sig.length === 1) {
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func);
      };
    } else if (sig.length === 2) {
      sigCache[func] = function dynCall_wrapper(arg) {
        return dynCall(sig, func, [arg]);
      };
    } else {
      // general case
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func, Array.prototype.slice.call(arguments));
      };
    }
  }
  return sigCache[func];
}


function makeBigInt(low, high, unsigned) {
  return unsigned ? ((+((low>>>0)))+((+((high>>>0)))*4294967296.0)) : ((+((low>>>0)))+((+((high|0)))*4294967296.0));
}

function dynCall(sig, ptr, args) {
  if (args && args.length) {
    assert(args.length === sig.substring(1).replace(/j/g, '--').length);
    assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
    return Module['dynCall_' + sig].apply(null, [ptr].concat(args));
  } else {
    assert(sig.length == 1);
    assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
    return Module['dynCall_' + sig].call(null, ptr);
  }
}

var tempRet0 = 0;

var setTempRet0 = function(value) {
  tempRet0 = value;
};

var getTempRet0 = function() {
  return tempRet0;
};

function getCompilerSetting(name) {
  throw 'You must build with -s RETAIN_COMPILER_SETTINGS=1 for getCompilerSetting or emscripten_get_compiler_setting to work';
}

var Runtime = {
  // helpful errors
  getTempRet0: function() { abort('getTempRet0() is now a top-level function, after removing the Runtime object. Remove "Runtime."') },
  staticAlloc: function() { abort('staticAlloc() is now a top-level function, after removing the Runtime object. Remove "Runtime."') },
  stackAlloc: function() { abort('stackAlloc() is now a top-level function, after removing the Runtime object. Remove "Runtime."') },
};

// The address globals begin at. Very low in memory, for code size and optimization opportunities.
// Above 0 is static memory, starting with globals.
// Then the stack.
// Then 'dynamic' memory for sbrk.
var GLOBAL_BASE = 1024;




// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html


var wasmBinary;if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];if (!Object.getOwnPropertyDescriptor(Module, 'wasmBinary')) Object.defineProperty(Module, 'wasmBinary', { configurable: true, get: function() { abort('Module.wasmBinary has been replaced with plain wasmBinary') } });
var noExitRuntime;if (Module['noExitRuntime']) noExitRuntime = Module['noExitRuntime'];if (!Object.getOwnPropertyDescriptor(Module, 'noExitRuntime')) Object.defineProperty(Module, 'noExitRuntime', { configurable: true, get: function() { abort('Module.noExitRuntime has been replaced with plain noExitRuntime') } });


if (typeof WebAssembly !== 'object') {
  abort('No WebAssembly support found. Build with -s WASM=0 to target JavaScript instead.');
}


// In MINIMAL_RUNTIME, setValue() and getValue() are only available when building with safe heap enabled, for heap safety checking.
// In traditional runtime, setValue() and getValue() are always available (although their use is highly discouraged due to perf penalties)

/** @type {function(number, number, string, boolean=)} */
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[((ptr)>>0)]=value; break;
      case 'i8': HEAP8[((ptr)>>0)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}

/** @type {function(number, string, boolean=)} */
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[((ptr)>>0)];
      case 'i8': return HEAP8[((ptr)>>0)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for getValue: ' + type);
    }
  return null;
}





// Wasm globals

var wasmMemory;

// In fastcomp asm.js, we don't need a wasm Table at all.
// In the wasm backend, we polyfill the WebAssembly object,
// so this creates a (non-native-wasm) table for us.
var wasmTable = new WebAssembly.Table({
  'initial': 470,
  'maximum': 470 + 0,
  'element': 'anyfunc'
});


//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS = 0;

/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  var func = Module['_' + ident]; // closure exported function
  assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
  return func;
}

// C calling interface.
function ccall(ident, returnType, argTypes, args, opts) {
  // For fast lookup of conversion functions
  var toC = {
    'string': function(str) {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) { // null string
        // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
        var len = (str.length << 2) + 1;
        ret = stackAlloc(len);
        stringToUTF8(str, ret, len);
      }
      return ret;
    },
    'array': function(arr) {
      var ret = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    }
  };

  function convertReturnValue(ret) {
    if (returnType === 'string') return UTF8ToString(ret);
    if (returnType === 'boolean') return Boolean(ret);
    return ret;
  }

  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  assert(returnType !== 'array', 'Return type should not be "array".');
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);

  ret = convertReturnValue(ret);
  if (stack !== 0) stackRestore(stack);
  return ret;
}

function cwrap(ident, returnType, argTypes, opts) {
  return function() {
    return ccall(ident, returnType, argTypes, arguments, opts);
  }
}

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_DYNAMIC = 2; // Cannot be freed except through sbrk
var ALLOC_NONE = 3; // Do not allocate

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
/** @type {function((TypedArray|Array<number>|number), string, number, number=)} */
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc,
    stackAlloc,
    dynamicAlloc][allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var stop;
    ptr = ret;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)>>0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(/** @type {!Uint8Array} */ (slab), ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    assert(type, 'Must know what type to store in allocate!');

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}

// Allocate memory during any stage of startup - static memory early on, dynamic memory later, malloc when ready
function getMemory(size) {
  if (!runtimeInitialized) return dynamicAlloc(size);
  return _malloc(size);
}




// Given a pointer 'ptr' to a null-terminated ASCII-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

function AsciiToString(ptr) {
  var str = '';
  while (1) {
    var ch = HEAPU8[((ptr++)>>0)];
    if (!ch) return str;
    str += String.fromCharCode(ch);
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in ASCII form. The copy will require at most str.length+1 bytes of space in the HEAP.

function stringToAscii(str, outPtr) {
  return writeAsciiToMemory(str, outPtr, false);
}


// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
// a copy of that string as a Javascript String object.

var UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;

/**
 * @param {number} idx
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ArrayToString(u8Array, idx, maxBytesToRead) {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  // (As a tiny code save trick, compare endPtr against endIdx using a negation, so that undefined means Infinity)
  while (u8Array[endPtr] && !(endPtr >= endIdx)) ++endPtr;

  if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
  } else {
    var str = '';
    // If building with TextDecoder, we have already computed the string length above, so test loop end condition against that
    while (idx < endPtr) {
      // For UTF8 byte structure, see:
      // http://en.wikipedia.org/wiki/UTF-8#Description
      // https://www.ietf.org/rfc/rfc2279.txt
      // https://tools.ietf.org/html/rfc3629
      var u0 = u8Array[idx++];
      if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
      var u1 = u8Array[idx++] & 63;
      if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
      var u2 = u8Array[idx++] & 63;
      if ((u0 & 0xF0) == 0xE0) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte 0x' + u0.toString(16) + ' encountered when deserializing a UTF-8 string on the asm.js/wasm heap to a JS string!');
        u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (u8Array[idx++] & 63);
      }

      if (u0 < 0x10000) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 0x10000;
        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
      }
    }
  }
  return str;
}

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns a
// copy of that string as a Javascript String object.
// maxBytesToRead: an optional length that specifies the maximum number of bytes to read. You can omit
//                 this parameter to scan the string until the first \0 byte. If maxBytesToRead is
//                 passed, and the string at [ptr, ptr+maxBytesToReadr[ contains a null byte in the
//                 middle, then the string will cut short at that byte index (i.e. maxBytesToRead will
//                 not produce a string of exact length [ptr, ptr+maxBytesToRead[)
//                 N.B. mixing frequent uses of UTF8ToString() with and without maxBytesToRead may
//                 throw JS JIT optimizations off, so it is worth to consider consistently using one
//                 style or the other.
/**
 * @param {number} ptr
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ToString(ptr, maxBytesToRead) {
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
}

// Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
// encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outU8Array: the array to copy to. Each index in this array is assumed to be one 8-byte element.
//   outIdx: The starting offset in the array to begin the copying.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array.
//                    This count should include the null terminator,
//                    i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
//                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
    return 0;

  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) {
      var u1 = str.charCodeAt(++i);
      u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
    }
    if (u <= 0x7F) {
      if (outIdx >= endIdx) break;
      outU8Array[outIdx++] = u;
    } else if (u <= 0x7FF) {
      if (outIdx + 1 >= endIdx) break;
      outU8Array[outIdx++] = 0xC0 | (u >> 6);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0xFFFF) {
      if (outIdx + 2 >= endIdx) break;
      outU8Array[outIdx++] = 0xE0 | (u >> 12);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      if (u >= 0x200000) warnOnce('Invalid Unicode code point 0x' + u.toString(16) + ' encountered when serializing a JS string to an UTF-8 string on the asm.js/wasm heap! (Valid unicode code points should be in range 0-0x1FFFFF).');
      outU8Array[outIdx++] = 0xF0 | (u >> 18);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    }
  }
  // Null-terminate the pointer to the buffer.
  outU8Array[outIdx] = 0;
  return outIdx - startIdx;
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8(str, outPtr, maxBytesToWrite) {
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.
function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
    if (u <= 0x7F) ++len;
    else if (u <= 0x7FF) len += 2;
    else if (u <= 0xFFFF) len += 3;
    else len += 4;
  }
  return len;
}


// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

var UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;
function UTF16ToString(ptr) {
  assert(ptr % 2 == 0, 'Pointer passed to UTF16ToString must be aligned to two bytes!');
  var endPtr = ptr;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  var idx = endPtr >> 1;
  while (HEAP16[idx]) ++idx;
  endPtr = idx << 1;

  if (endPtr - ptr > 32 && UTF16Decoder) {
    return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
  } else {
    var i = 0;

    var str = '';
    while (1) {
      var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
      if (codeUnit == 0) return str;
      ++i;
      // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
      str += String.fromCharCode(codeUnit);
    }
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16 form. The copy will require at most str.length*4+2 bytes of space in the HEAP.
// Use the function lengthBytesUTF16() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=2, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<2 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF16(str, outPtr, maxBytesToWrite) {
  assert(outPtr % 2 == 0, 'Pointer passed to stringToUTF16 must be aligned to two bytes!');
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 2) return 0;
  maxBytesToWrite -= 2; // Null terminator.
  var startPtr = outPtr;
  var numCharsToWrite = (maxBytesToWrite < str.length*2) ? (maxBytesToWrite / 2) : str.length;
  for (var i = 0; i < numCharsToWrite; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[((outPtr)>>1)]=codeUnit;
    outPtr += 2;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[((outPtr)>>1)]=0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF16(str) {
  return str.length*2;
}

function UTF32ToString(ptr) {
  assert(ptr % 4 == 0, 'Pointer passed to UTF32ToString must be aligned to four bytes!');
  var i = 0;

  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
// Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=4, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<4 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF32(str, outPtr, maxBytesToWrite) {
  assert(outPtr % 4 == 0, 'Pointer passed to stringToUTF32 must be aligned to four bytes!');
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 4) return 0;
  var startPtr = outPtr;
  var endPtr = startPtr + maxBytesToWrite - 4;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++i);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[((outPtr)>>2)]=codeUnit;
    outPtr += 4;
    if (outPtr + 4 > endPtr) break;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[((outPtr)>>2)]=0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF32(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i);
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
    len += 4;
  }

  return len;
}

// Allocate heap space for a JS string, and write it there.
// It is the responsibility of the caller to free() that memory.
function allocateUTF8(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

// Allocate stack space for a JS string, and write it there.
function allocateUTF8OnStack(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

// Deprecated: This function should not be called because it is unsafe and does not provide
// a maximum length limit of how many bytes it is allowed to write. Prefer calling the
// function stringToUTF8Array() instead, which takes in a maximum length that can be used
// to be secure from out of bounds writes.
/** @deprecated */
function writeStringToMemory(string, buffer, dontAddNull) {
  warnOnce('writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!');

  var /** @type {number} */ lastChar, /** @type {number} */ end;
  if (dontAddNull) {
    // stringToUTF8Array always appends null. If we don't want to do that, remember the
    // character that existed at the location where the null will be placed, and restore
    // that after the write (below).
    end = buffer + lengthBytesUTF8(string);
    lastChar = HEAP8[end];
  }
  stringToUTF8(string, buffer, Infinity);
  if (dontAddNull) HEAP8[end] = lastChar; // Restore the value under the null character.
}

function writeArrayToMemory(array, buffer) {
  assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
  HEAP8.set(array, buffer);
}

function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; ++i) {
    assert(str.charCodeAt(i) === str.charCodeAt(i)&0xff);
    HEAP8[((buffer++)>>0)]=str.charCodeAt(i);
  }
  // Null-terminate the pointer to the HEAP.
  if (!dontAddNull) HEAP8[((buffer)>>0)]=0;
}




// Memory management

var PAGE_SIZE = 16384;
var WASM_PAGE_SIZE = 65536;
var ASMJS_PAGE_SIZE = 16777216;

function alignUp(x, multiple) {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
}

var HEAP,
/** @type {ArrayBuffer} */
  buffer,
/** @type {Int8Array} */
  HEAP8,
/** @type {Uint8Array} */
  HEAPU8,
/** @type {Int16Array} */
  HEAP16,
/** @type {Uint16Array} */
  HEAPU16,
/** @type {Int32Array} */
  HEAP32,
/** @type {Uint32Array} */
  HEAPU32,
/** @type {Float32Array} */
  HEAPF32,
/** @type {Float64Array} */
  HEAPF64;

function updateGlobalBufferAndViews(buf) {
  buffer = buf;
  Module['HEAP8'] = HEAP8 = new Int8Array(buf);
  Module['HEAP16'] = HEAP16 = new Int16Array(buf);
  Module['HEAP32'] = HEAP32 = new Int32Array(buf);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
}

var STATIC_BASE = 1024,
    STACK_BASE = 5934112,
    STACKTOP = STACK_BASE,
    STACK_MAX = 691232,
    DYNAMIC_BASE = 5934112,
    DYNAMICTOP_PTR = 691072;

assert(STACK_BASE % 16 === 0, 'stack must start aligned');
assert(DYNAMIC_BASE % 16 === 0, 'heap must start aligned');



var TOTAL_STACK = 5242880;
if (Module['TOTAL_STACK']) assert(TOTAL_STACK === Module['TOTAL_STACK'], 'the stack size can no longer be determined at runtime')

var INITIAL_TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 268435456;if (!Object.getOwnPropertyDescriptor(Module, 'TOTAL_MEMORY')) Object.defineProperty(Module, 'TOTAL_MEMORY', { configurable: true, get: function() { abort('Module.TOTAL_MEMORY has been replaced with plain INITIAL_TOTAL_MEMORY') } });

assert(INITIAL_TOTAL_MEMORY >= TOTAL_STACK, 'TOTAL_MEMORY should be larger than TOTAL_STACK, was ' + INITIAL_TOTAL_MEMORY + '! (TOTAL_STACK=' + TOTAL_STACK + ')');

// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray !== undefined && Int32Array.prototype.set !== undefined,
       'JS engine does not provide full typed array support');






// In standalone mode, the wasm creates the memory, and the user can't provide it.
// In non-standalone/normal mode, we create the memory here.

// Create the main memory. (Note: this isn't used in STANDALONE_WASM mode since the wasm
// memory is created in the wasm, not in JS.)

  if (Module['wasmMemory']) {
    wasmMemory = Module['wasmMemory'];
  } else
  {
    wasmMemory = new WebAssembly.Memory({
      'initial': INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE
      ,
      'maximum': INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE
    });
  }


if (wasmMemory) {
  buffer = wasmMemory.buffer;
}

// If the user provides an incorrect length, just use that length instead rather than providing the user to
// specifically provide the memory length with Module['TOTAL_MEMORY'].
INITIAL_TOTAL_MEMORY = buffer.byteLength;
assert(INITIAL_TOTAL_MEMORY % WASM_PAGE_SIZE === 0);
updateGlobalBufferAndViews(buffer);

HEAP32[DYNAMICTOP_PTR>>2] = DYNAMIC_BASE;




// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  assert((STACK_MAX & 3) == 0);
  // The stack grows downwards
  HEAPU32[(STACK_MAX >> 2)+1] = 0x2135467;
  HEAPU32[(STACK_MAX >> 2)+2] = 0x89BACDFE;
  // Also test the global address 0 for integrity.
  // We don't do this with ASan because ASan does its own checks for this.
  HEAP32[0] = 0x63736d65; /* 'emsc' */
}

function checkStackCookie() {
  var cookie1 = HEAPU32[(STACK_MAX >> 2)+1];
  var cookie2 = HEAPU32[(STACK_MAX >> 2)+2];
  if (cookie1 != 0x2135467 || cookie2 != 0x89BACDFE) {
    abort('Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x2135467, but received 0x' + cookie2.toString(16) + ' ' + cookie1.toString(16));
  }
  // Also test the global address 0 for integrity.
  // We don't do this with ASan because ASan does its own checks for this.
  if (HEAP32[0] !== 0x63736d65 /* 'emsc' */) abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
}

function abortStackOverflow(allocSize) {
  abort('Stack overflow! Attempted to allocate ' + allocSize + ' bytes on the stack, but stack has only ' + (STACK_MAX - stackSave() + allocSize) + ' bytes available!');
}




// Endianness check (note: assumes compiler arch was little-endian)
(function() {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) throw 'Runtime error: expected the system to be little-endian!';
})();

function abortFnPtrError(ptr, sig) {
	abort("Invalid function pointer " + ptr + " called with signature '" + sig + "'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this). Build with ASSERTIONS=2 for more info.");
}



function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Module['dynCall_v'](func);
      } else {
        Module['dynCall_vi'](func, callback.arg);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the main() is called

var runtimeInitialized = false;
var runtimeExited = false;


function preRun() {

  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  checkStackCookie();
  assert(!runtimeInitialized);
  runtimeInitialized = true;
  if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
TTY.init();
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  checkStackCookie();
  FS.ignorePermissions = false;
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  checkStackCookie();
  runtimeExited = true;
}

function postRun() {
  checkStackCookie();

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}

function addOnExit(cb) {
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}


assert(Math.imul, 'This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.fround, 'This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.clz32, 'This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.trunc, 'This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');

var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_round = Math.round;
var Math_min = Math.min;
var Math_max = Math.max;
var Math_clz32 = Math.clz32;
var Math_trunc = Math.trunc;



// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

function getUniqueRunDependency(id) {
  var orig = id;
  while (1) {
    if (!runDependencyTracking[id]) return id;
    id = orig + Math.random();
  }
  return id;
}

function addRunDependency(id) {
  runDependencies++;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(function() {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            err('still waiting on run dependencies:');
          }
          err('dependency: ' + dep);
        }
        if (shown) {
          err('(end of list)');
        }
      }, 10000);
    }
  } else {
    err('warning: run dependency added without ID');
  }
}

function removeRunDependency(id) {
  runDependencies--;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    err('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data


function abort(what) {
  if (Module['onAbort']) {
    Module['onAbort'](what);
  }

  what += '';
  out(what);
  err(what);

  ABORT = true;
  EXITSTATUS = 1;

  var output = 'abort(' + what + ') at ' + stackTrace();
  what = output;

  // Throw a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  throw new WebAssembly.RuntimeError(what);
}


var memoryInitializer = null;






// Copyright 2017 The Emscripten Authors.  All rights reserved.
// Emscripten is available under two separate licenses, the MIT license and the
// University of Illinois/NCSA Open Source License.  Both these licenses can be
// found in the LICENSE file.

// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

// Indicates whether filename is a base64 data URI.
function isDataURI(filename) {
  return String.prototype.startsWith ?
      filename.startsWith(dataURIPrefix) :
      filename.indexOf(dataURIPrefix) === 0;
}




var wasmBinaryFile = 'example-01-cubesDebug.wasm';
if (!isDataURI(wasmBinaryFile)) {
  wasmBinaryFile = locateFile(wasmBinaryFile);
}

function getBinary() {
  try {
    if (wasmBinary) {
      return new Uint8Array(wasmBinary);
    }

    if (readBinary) {
      return readBinary(wasmBinaryFile);
    } else {
      throw "both async and sync fetching of the wasm failed";
    }
  }
  catch (err) {
    abort(err);
  }
}

function getBinaryPromise() {
  // if we don't have the binary yet, and have the Fetch api, use that
  // in some environments, like Electron's render process, Fetch api may be present, but have a different context than expected, let's only use it on the Web
  if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === 'function') {
    return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
      if (!response['ok']) {
        throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
      }
      return response['arrayBuffer']();
    }).catch(function () {
      return getBinary();
    });
  }
  // Otherwise, getBinary should be able to get it synchronously
  return new Promise(function(resolve, reject) {
    resolve(getBinary());
  });
}



// Create the wasm instance.
// Receives the wasm imports, returns the exports.
function createWasm() {
  // prepare imports
  var info = {
    'env': asmLibraryArg,
    'wasi_snapshot_preview1': asmLibraryArg
  };
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  function receiveInstance(instance, module) {
    var exports = instance.exports;
    Module['asm'] = exports;
    removeRunDependency('wasm-instantiate');
  }
   // we can't run yet (except in a pthread, where we have a custom sync instantiator)
  addRunDependency('wasm-instantiate');


  // Async compilation can be confusing when an error on the page overwrites Module
  // (for example, if the order of elements is wrong, and the one defining Module is
  // later), so we save Module and check it later.
  var trueModule = Module;
  function receiveInstantiatedSource(output) {
    // 'output' is a WebAssemblyInstantiatedSource object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
    trueModule = null;
      // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
      // When the regression is fixed, can restore the above USE_PTHREADS-enabled path.
    receiveInstance(output['instance']);
  }


  function instantiateArrayBuffer(receiver) {
    return getBinaryPromise().then(function(binary) {
      return WebAssembly.instantiate(binary, info);
    }).then(receiver, function(reason) {
      err('failed to asynchronously prepare wasm: ' + reason);
      abort(reason);
    });
  }

  // Prefer streaming instantiation if available.
  function instantiateAsync() {
    if (!wasmBinary &&
        typeof WebAssembly.instantiateStreaming === 'function' &&
        !isDataURI(wasmBinaryFile) &&
        typeof fetch === 'function') {
      fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function (response) {
        var result = WebAssembly.instantiateStreaming(response, info);
        return result.then(receiveInstantiatedSource, function(reason) {
            // We expect the most common failure cause to be a bad MIME type for the binary,
            // in which case falling back to ArrayBuffer instantiation should work.
            err('wasm streaming compile failed: ' + reason);
            err('falling back to ArrayBuffer instantiation');
            instantiateArrayBuffer(receiveInstantiatedSource);
          });
      });
    } else {
      return instantiateArrayBuffer(receiveInstantiatedSource);
    }
  }
  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to run the instantiation parallel
  // to any other async startup actions they are performing.
  if (Module['instantiateWasm']) {
    try {
      var exports = Module['instantiateWasm'](info, receiveInstance);
      return exports;
    } catch(e) {
      err('Module.instantiateWasm callback failed with error: ' + e);
      return false;
    }
  }

  instantiateAsync();
  return {}; // no exports yet; we'll fill them in later
}


// Globals used by JS i64 conversions
var tempDouble;
var tempI64;

// === Body ===

var ASM_CONSTS = {
  567804: function() {debugger;}
};

// Avoid creating a new array
var _readAsmConstArgsArray = [];

function readAsmConstArgs(sigPtr, buf) {
  var args = _readAsmConstArgsArray;
  args.length = 0;
  var ch;
  while (ch = HEAPU8[sigPtr++]) {
    if (ch === 100/*'d'*/ || ch === 102/*'f'*/) {
      buf = (buf + 7) & ~7;
      args.push(HEAPF64[(buf >> 3)]);
      buf += 8;
    } else if (ch === 105 /*'i'*/) {
      buf = (buf + 3) & ~3;
      args.push(HEAP32[(buf >> 2)]);
      buf += 4;
    } else abort("unexpected char in asm const signature " + ch);
  }
  return args;
}


function _emscripten_asm_const_iii(code, sigPtr, argbuf) {
  var args = readAsmConstArgs(sigPtr, argbuf);
  return ASM_CONSTS[code].apply(null, args);
}



// STATICTOP = STATIC_BASE + 690208;
/* global initializers */  __ATINIT__.push({ func: function() { ___wasm_call_ctors() } });




/* no memory initializer */
// {{PRE_LIBRARY}}


  function demangle(func) {
      warnOnce('warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling');
      return func;
    }

  function demangleAll(text) {
      var regex =
        /\b_Z[\w\d_]+/g;
      return text.replace(regex,
        function(x) {
          var y = demangle(x);
          return x === y ? x : (y + ' [' + x + ']');
        });
    }

  function jsStackTrace() {
      var err = new Error();
      if (!err.stack) {
        // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
        // so try that as a special-case.
        try {
          throw new Error(0);
        } catch(e) {
          err = e;
        }
        if (!err.stack) {
          return '(no stack trace available)';
        }
      }
      return err.stack.toString();
    }

  function stackTrace() {
      var js = jsStackTrace();
      if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
      return demangleAll(js);
    }

  function ___assert_fail(condition, filename, line, func) {
      abort('Assertion failed: ' + UTF8ToString(condition) + ', at: ' + [filename ? UTF8ToString(filename) : 'unknown filename', line, func ? UTF8ToString(func) : 'unknown function']);
    }

  
  function _atexit(func, arg) {
      warnOnce('atexit() called, but EXIT_RUNTIME is not set, so atexits() will not be called. set EXIT_RUNTIME to 1 (see the FAQ)');
      __ATEXIT__.unshift({ func: func, arg: arg });
    }function ___cxa_atexit(
  ) {
  return _atexit.apply(null, arguments)
  }

  function ___handle_stack_overflow() {
      abort('stack overflow')
    }

  function ___lock() {}

  
  function ___setErrNo(value) {
      if (Module['___errno_location']) HEAP32[((Module['___errno_location']())>>2)]=value;
      else err('failed to set errno from JS');
      return value;
    }
  
  
  var PATH={splitPath:function(filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function(parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function(path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function(path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function(path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function(path) {
        return PATH.splitPath(path)[3];
      },join:function() {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function(l, r) {
        return PATH.normalize(l + '/' + r);
      }};
  
  
  var PATH_FS={resolve:function() {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            return ''; // an invalid portion invalidates the whole thing
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function(from, to) {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  
  var TTY={ttys:[],init:function () {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function() {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function(dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(43);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function(stream) {
          // flush any pending line data
          stream.tty.ops.flush(stream.tty);
        },flush:function(stream) {
          stream.tty.ops.flush(stream.tty);
        },read:function(stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function(tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              // we will read data by chunks of BUFSIZE
              var BUFSIZE = 256;
              var buf = Buffer.alloc ? Buffer.alloc(BUFSIZE) : new Buffer(BUFSIZE);
              var bytesRead = 0;
  
              try {
                bytesRead = nodeFS.readSync(process.stdin.fd, buf, 0, BUFSIZE, null);
              } catch(e) {
                // Cross-platform differences: on Windows, reading EOF throws an exception, but on other OSes,
                // reading EOF returns 0. Uniformize behavior by treating the EOF exception to return 0.
                if (e.toString().indexOf('EOF') != -1) bytesRead = 0;
                else throw e;
              }
  
              if (bytesRead > 0) {
                result = buf.slice(0, bytesRead).toString('utf-8');
              } else {
                result = null;
              }
            } else
            if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
          }
        },flush:function(tty) {
          if (tty.output && tty.output.length > 0) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }},default_tty1_ops:{put_char:function(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },flush:function(tty) {
          if (tty.output && tty.output.length > 0) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }}};
  
  var MEMFS={ops_table:null,mount:function(mount) {
        return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createNode:function(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(63);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap,
                msync: MEMFS.stream_ops.msync
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            }
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
          // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
          // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
          // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
          node.contents = null; 
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },getFileDataAsRegularArray:function(node) {
        if (node.contents && node.contents.subarray) {
          var arr = [];
          for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
          return arr; // Returns a copy of the original data.
        }
        return node.contents; // No-op, the file contents are already in a JS array. Return as-is.
      },getFileDataAsTypedArray:function(node) {
        if (!node.contents) return new Uint8Array;
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
        return new Uint8Array(node.contents);
      },expandFileStorage:function(node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
        // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
        // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
        // avoid overshooting the allocation cap by a very large margin.
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) | 0);
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity); // Allocate new storage.
        if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
        return;
      },resizeFileStorage:function(node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
          node.contents = null; // Fully decommit when requesting a resize to zero.
          node.usedBytes = 0;
          return;
        }
        if (!node.contents || node.contents.subarray) { // Resize a typed array if that is being used as the backing store.
          var oldContents = node.contents;
          node.contents = new Uint8Array(new ArrayBuffer(newSize)); // Allocate new storage.
          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
          }
          node.usedBytes = newSize;
          return;
        }
        // Backing with a JS array.
        if (!node.contents) node.contents = [];
        if (node.contents.length > newSize) node.contents.length = newSize;
        else while (node.contents.length < newSize) node.contents.push(0);
        node.usedBytes = newSize;
      },node_ops:{getattr:function(node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function(node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },lookup:function(parent, name) {
          throw FS.genericErrors[44];
        },mknod:function(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function(old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function(parent, name) {
          delete parent.contents[name];
        },rmdir:function(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }
          delete parent.contents[name];
        },readdir:function(node) {
          var entries = ['.', '..'];
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function(node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          return node.link;
        }},stream_ops:{read:function(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }
          return size;
        },write:function(stream, buffer, offset, length, position, canOwn) {
          // The data buffer should be a typed array view
          assert(!(buffer instanceof ArrayBuffer));
  
          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();
  
          if (buffer.subarray && (!node.contents || node.contents.subarray)) { // This write is from a typed array to a typed array?
            if (canOwn) {
              assert(position === 0, 'canOwn must imply no weird position inside the file');
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) { // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
              node.contents = new Uint8Array(buffer.subarray(offset, offset + length));
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) { // Writing to an already allocated and used subrange of the file?
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }
  
          // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
          MEMFS.expandFileStorage(node, position+length);
          if (node.contents.subarray && buffer.subarray) node.contents.set(buffer.subarray(offset, offset + length), position); // Use typed array write if available.
          else {
            for (var i = 0; i < length; i++) {
             node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position+length);
          return length;
        },llseek:function(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28);
          }
          return position;
        },allocate:function(stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
        },mmap:function(stream, buffer, offset, length, position, prot, flags) {
          // The data buffer should be a typed array view
          assert(!(buffer instanceof ArrayBuffer));
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                contents.buffer === buffer.buffer ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < stream.node.usedBytes) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            // malloc() can lead to growing the heap. If targeting the heap, we need to
            // re-acquire the heap buffer object in case growth had occurred.
            var fromHeap = (buffer.buffer == HEAP8.buffer);
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            (fromHeap ? HEAP8 : buffer).set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        },msync:function(stream, buffer, offset, length, mmapFlags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          if (mmapFlags & 2) {
            // MAP_PRIVATE calls need not to be synced back to underlying fs
            return 0;
          }
  
          var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          // should we check if bytesWritten and length are the same?
          return 0;
        }}};
  
  var ERRNO_MESSAGES={0:"Success",1:"Arg list too long",2:"Permission denied",3:"Address already in use",4:"Address not available",5:"Address family not supported by protocol family",6:"No more processes",7:"Socket already connected",8:"Bad file number",9:"Trying to read unreadable message",10:"Mount device busy",11:"Operation canceled",12:"No children",13:"Connection aborted",14:"Connection refused",15:"Connection reset by peer",16:"File locking deadlock error",17:"Destination address required",18:"Math arg out of domain of func",19:"Quota exceeded",20:"File exists",21:"Bad address",22:"File too large",23:"Host is unreachable",24:"Identifier removed",25:"Illegal byte sequence",26:"Connection already in progress",27:"Interrupted system call",28:"Invalid argument",29:"I/O error",30:"Socket is already connected",31:"Is a directory",32:"Too many symbolic links",33:"Too many open files",34:"Too many links",35:"Message too long",36:"Multihop attempted",37:"File or path name too long",38:"Network interface is not configured",39:"Connection reset by network",40:"Network is unreachable",41:"Too many open files in system",42:"No buffer space available",43:"No such device",44:"No such file or directory",45:"Exec format error",46:"No record locks available",47:"The link has been severed",48:"Not enough core",49:"No message of desired type",50:"Protocol not available",51:"No space left on device",52:"Function not implemented",53:"Socket is not connected",54:"Not a directory",55:"Directory not empty",56:"State not recoverable",57:"Socket operation on non-socket",59:"Not a typewriter",60:"No such device or address",61:"Value too large for defined data type",62:"Previous owner died",63:"Not super-user",64:"Broken pipe",65:"Protocol error",66:"Unknown protocol",67:"Protocol wrong type for socket",68:"Math result not representable",69:"Read only file system",70:"Illegal seek",71:"No such process",72:"Stale file handle",73:"Connection timed out",74:"Text file busy",75:"Cross-device link",100:"Device not a stream",101:"Bad font file fmt",102:"Invalid slot",103:"Invalid request code",104:"No anode",105:"Block device required",106:"Channel number out of range",107:"Level 3 halted",108:"Level 3 reset",109:"Link number out of range",110:"Protocol driver not attached",111:"No CSI structure available",112:"Level 2 halted",113:"Invalid exchange",114:"Invalid request descriptor",115:"Exchange full",116:"No data (for no delay io)",117:"Timer expired",118:"Out of streams resources",119:"Machine is not on the network",120:"Package not installed",121:"The object is remote",122:"Advertise error",123:"Srmount error",124:"Communication error on send",125:"Cross mount point (not really error)",126:"Given log. name not unique",127:"f.d. invalid for this operation",128:"Remote address changed",129:"Can   access a needed shared lib",130:"Accessing a corrupted shared lib",131:".lib section in a.out corrupted",132:"Attempting to link in too many libs",133:"Attempting to exec a shared library",135:"Streams pipe error",136:"Too many users",137:"Socket type not supported",138:"Not supported",139:"Protocol family not supported",140:"Can't send after socket shutdown",141:"Too many references",142:"Host is down",148:"No medium (in tape drive)",156:"Level 2 not synchronized"};
  
  var ERRNO_CODES={EPERM:63,ENOENT:44,ESRCH:71,EINTR:27,EIO:29,ENXIO:60,E2BIG:1,ENOEXEC:45,EBADF:8,ECHILD:12,EAGAIN:6,EWOULDBLOCK:6,ENOMEM:48,EACCES:2,EFAULT:21,ENOTBLK:105,EBUSY:10,EEXIST:20,EXDEV:75,ENODEV:43,ENOTDIR:54,EISDIR:31,EINVAL:28,ENFILE:41,EMFILE:33,ENOTTY:59,ETXTBSY:74,EFBIG:22,ENOSPC:51,ESPIPE:70,EROFS:69,EMLINK:34,EPIPE:64,EDOM:18,ERANGE:68,ENOMSG:49,EIDRM:24,ECHRNG:106,EL2NSYNC:156,EL3HLT:107,EL3RST:108,ELNRNG:109,EUNATCH:110,ENOCSI:111,EL2HLT:112,EDEADLK:16,ENOLCK:46,EBADE:113,EBADR:114,EXFULL:115,ENOANO:104,EBADRQC:103,EBADSLT:102,EDEADLOCK:16,EBFONT:101,ENOSTR:100,ENODATA:116,ETIME:117,ENOSR:118,ENONET:119,ENOPKG:120,EREMOTE:121,ENOLINK:47,EADV:122,ESRMNT:123,ECOMM:124,EPROTO:65,EMULTIHOP:36,EDOTDOT:125,EBADMSG:9,ENOTUNIQ:126,EBADFD:127,EREMCHG:128,ELIBACC:129,ELIBBAD:130,ELIBSCN:131,ELIBMAX:132,ELIBEXEC:133,ENOSYS:52,ENOTEMPTY:55,ENAMETOOLONG:37,ELOOP:32,EOPNOTSUPP:138,EPFNOSUPPORT:139,ECONNRESET:15,ENOBUFS:42,EAFNOSUPPORT:5,EPROTOTYPE:67,ENOTSOCK:57,ENOPROTOOPT:50,ESHUTDOWN:140,ECONNREFUSED:14,EADDRINUSE:3,ECONNABORTED:13,ENETUNREACH:40,ENETDOWN:38,ETIMEDOUT:73,EHOSTDOWN:142,EHOSTUNREACH:23,EINPROGRESS:26,EALREADY:7,EDESTADDRREQ:17,EMSGSIZE:35,EPROTONOSUPPORT:66,ESOCKTNOSUPPORT:137,EADDRNOTAVAIL:4,ENETRESET:39,EISCONN:30,ENOTCONN:53,ETOOMANYREFS:141,EUSERS:136,EDQUOT:19,ESTALE:72,ENOTSUP:138,ENOMEDIUM:148,EILSEQ:25,EOVERFLOW:61,ECANCELED:11,ENOTRECOVERABLE:56,EOWNERDEAD:62,ESTRPIPE:135};var FS={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,trackingDelegate:{},tracking:{openFlags:{READ:1,WRITE:2}},ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,handleFSError:function(e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function(path, opts) {
        path = PATH_FS.resolve(FS.cwd(), path);
        opts = opts || {};
  
        if (!path) return { path: '', node: null };
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        for (var key in defaults) {
          if (opts[key] === undefined) {
            opts[key] = defaults[key];
          }
        }
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(32);
        }
  
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
  
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(32);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:function(node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function(parentid, name) {
        var hash = 0;
  
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function(parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err, parent);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function(parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
          };
  
          FS.FSNode.prototype = {};
  
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
  
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); }
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); }
            }
          });
        }
  
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },destroyNode:function(node) {
        FS.hashRemoveNode(node);
      },isRoot:function(node) {
        return node === node.parent;
      },isMountpoint:function(node) {
        return !!node.mounted;
      },isFile:function(mode) {
        return (mode & 61440) === 32768;
      },isDir:function(mode) {
        return (mode & 61440) === 16384;
      },isLink:function(mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function(mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function(mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function(mode) {
        return (mode & 61440) === 4096;
      },isSocket:function(mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function(str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function(flag) {
        var perms = ['r', 'w', 'rw'][flag & 3];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function(node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return 2;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return 2;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return 2;
        }
        return 0;
      },mayLookup:function(dir) {
        var err = FS.nodePermissions(dir, 'x');
        if (err) return err;
        if (!dir.node_ops.lookup) return 2;
        return 0;
      },mayCreate:function(dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return 20;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function(dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return 54;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return 10;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return 31;
          }
        }
        return 0;
      },mayOpen:function(node, flags) {
        if (!node) {
          return 44;
        }
        if (FS.isLink(node.mode)) {
          return 32;
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== 'r' || // opening for write
              (flags & 512)) { // TODO: check for O_SEARCH? (== search for dir only)
            return 31;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function(fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(33);
      },getStream:function(fd) {
        return FS.streams[fd];
      },createStream:function(stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        // clone it, so we can return an instance of FSStream
        var newStream = new FS.FSStream();
        for (var p in stream) {
          newStream[p] = stream[p];
        }
        stream = newStream;
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function(fd) {
        FS.streams[fd] = null;
      },chrdev_stream_ops:{open:function(stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function() {
          throw new FS.ErrnoError(70);
        }},major:function(dev) {
        return ((dev) >> 8);
      },minor:function(dev) {
        return ((dev) & 0xff);
      },makedev:function(ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function(dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function(dev) {
        return FS.devices[dev];
      },getMounts:function(mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push.apply(check, m.mounts);
        }
  
        return mounts;
      },syncfs:function(populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
  
        FS.syncFSRequests++;
  
        if (FS.syncFSRequests > 1) {
          err('warning: ' + FS.syncFSRequests + ' FS.syncfs operations in flight at once, probably just doing extra work');
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function doCallback(err) {
          assert(FS.syncFSRequests > 0);
          FS.syncFSRequests--;
          return callback(err);
        }
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(err);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach(function (mount) {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:function(type, opts, mountpoint) {
        if (typeof type === 'string') {
          // The filesystem was not included, and instead we have an error
          // message stored in the variable.
          throw type;
        }
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
        }
  
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },unmount:function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(28);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach(function (hash) {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.indexOf(current.mount) !== -1) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },lookup:function(parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function(path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === '.' || name === '..') {
          throw new FS.ErrnoError(28);
        }
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function(path, mode) {
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function(path, mode) {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdirTree:function(path, mode) {
        var dirs = path.split('/');
        var d = '';
        for (var i = 0; i < dirs.length; ++i) {
          if (!dirs[i]) continue;
          d += '/' + dirs[i];
          try {
            FS.mkdir(d, mode);
          } catch(e) {
            if (e.errno != 20) throw e;
          }
        }
      },mkdev:function(path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 438 /* 0666 */;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function(oldpath, newpath) {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS.ErrnoError(44);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function(old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(10);
        }
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(75);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(28);
        }
        // new path should not be an ancestor of the old path
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(55);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(10);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        try {
          if (FS.trackingDelegate['willMovePath']) {
            FS.trackingDelegate['willMovePath'](old_path, new_path);
          }
        } catch(e) {
          err("FS.trackingDelegate['willMovePath']('"+old_path+"', '"+new_path+"') threw an exception: " + e.message);
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
        try {
          if (FS.trackingDelegate['onMovePath']) FS.trackingDelegate['onMovePath'](old_path, new_path);
        } catch(e) {
          err("FS.trackingDelegate['onMovePath']('"+old_path+"', '"+new_path+"') threw an exception: " + e.message);
        }
      },rmdir:function(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        try {
          if (FS.trackingDelegate['willDeletePath']) {
            FS.trackingDelegate['willDeletePath'](path);
          }
        } catch(e) {
          err("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: " + e.message);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
        try {
          if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
        } catch(e) {
          err("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: " + e.message);
        }
      },readdir:function(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(54);
        }
        return node.node_ops.readdir(node);
      },unlink:function(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // According to POSIX, we should map EISDIR to EPERM, but
          // we instead do what Linux does (and we must, as we use
          // the musl linux libc).
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        try {
          if (FS.trackingDelegate['willDeletePath']) {
            FS.trackingDelegate['willDeletePath'](path);
          }
        } catch(e) {
          err("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: " + e.message);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
        try {
          if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
        } catch(e) {
          err("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: " + e.message);
        }
      },readlink:function(path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(28);
        }
        return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
      },stat:function(path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(63);
        }
        return node.node_ops.getattr(node);
      },lstat:function(path) {
        return FS.stat(path, true);
      },chmod:function(path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function(path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function(fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        FS.chmod(stream.node, mode);
      },chown:function(path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function(path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function(fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function(path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(28);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(28);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function(fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(28);
        }
        FS.truncate(stream.node, len);
      },utime:function(path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function(path, flags, mode, fd_start, fd_end) {
        if (path === "") {
          throw new FS.ErrnoError(44);
        }
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 438 /* 0666 */ : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        var created = false;
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(20);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // if asked only for a directory, then this must be one
        if ((flags & 65536) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }
        // check permissions, if this is not a file we just created now (it is ok to
        // create and write to a file with read-only permissions; it is read-only
        // for later use)
        if (!created) {
          var err = FS.mayOpen(node, flags);
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            err("FS.trackingDelegate error on read file: " + path);
          }
        }
        try {
          if (FS.trackingDelegate['onOpenFile']) {
            var trackingFlags = 0;
            if ((flags & 2097155) !== 1) {
              trackingFlags |= FS.tracking.openFlags.READ;
            }
            if ((flags & 2097155) !== 0) {
              trackingFlags |= FS.tracking.openFlags.WRITE;
            }
            FS.trackingDelegate['onOpenFile'](path, trackingFlags);
          }
        } catch(e) {
          err("FS.trackingDelegate['onOpenFile']('"+path+"', flags) threw an exception: " + e.message);
        }
        return stream;
      },close:function(stream) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (stream.getdents) stream.getdents = null; // free readdir state
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
        stream.fd = null;
      },isClosed:function(stream) {
        return stream.fd === null;
      },llseek:function(stream, offset, whence) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },read:function(stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(28);
        }
        var seeking = typeof position !== 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function(stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(28);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var seeking = typeof position !== 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        try {
          if (stream.path && FS.trackingDelegate['onWriteToFile']) FS.trackingDelegate['onWriteToFile'](stream.path);
        } catch(e) {
          err("FS.trackingDelegate['onWriteToFile']('"+stream.path+"') threw an exception: " + e.message);
        }
        return bytesWritten;
      },allocate:function(stream, offset, length) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(28);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(138);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function(stream, buffer, offset, length, position, prot, flags) {
        // User requests writing to file (prot & PROT_WRITE != 0).
        // Checking if we have permissions to write to the file unless
        // MAP_PRIVATE flag is set. According to POSIX spec it is possible
        // to write to file opened in read-only mode with MAP_PRIVATE flag,
        // as all modifications will be visible only in the memory of
        // the current process.
        if ((prot & 2) !== 0
            && (flags & 2) === 0
            && (stream.flags & 2097155) !== 2) {
          throw new FS.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(43);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },msync:function(stream, buffer, offset, length, mmapFlags) {
        if (!stream || !stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
      },munmap:function(stream) {
        return 0;
      },ioctl:function(stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function(path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },writeFile:function(path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data === 'string') {
          var buf = new Uint8Array(lengthBytesUTF8(data)+1);
          var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
          FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
        } else if (ArrayBuffer.isView(data)) {
          FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
        } else {
          throw new Error('Unsupported data type');
        }
        FS.close(stream);
      },cwd:function() {
        return FS.currentPath;
      },chdir:function(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(44);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(54);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function() {
        FS.mkdir('/tmp');
        FS.mkdir('/home');
        FS.mkdir('/home/web_user');
      },createDefaultDevices:function() {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function(stream, buffer, offset, length, pos) { return length; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // setup /dev/[u]random
        var random_device;
        if (typeof crypto === 'object' && typeof crypto['getRandomValues'] === 'function') {
          // for modern web browsers
          var randomBuffer = new Uint8Array(1);
          random_device = function() { crypto.getRandomValues(randomBuffer); return randomBuffer[0]; };
        } else
        if (ENVIRONMENT_IS_NODE) {
          // for nodejs with or without crypto support included
          try {
            var crypto_module = require('crypto');
            // nodejs has crypto support
            random_device = function() { return crypto_module['randomBytes'](1)[0]; };
          } catch (e) {
            // nodejs doesn't have crypto support
          }
        } else
        {}
        if (!random_device) {
          // we couldn't find a proper implementation, as Math.random() is not suitable for /dev/random, see emscripten-core/emscripten/pull/7096
          random_device = function() { abort("no cryptographic support found for random_device. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: function(array) { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };"); };
        }
        FS.createDevice('/dev', 'random', random_device);
        FS.createDevice('/dev', 'urandom', random_device);
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createSpecialDirectories:function() {
        // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the name of the stream for fd 6 (see test_unistd_ttyname)
        FS.mkdir('/proc');
        FS.mkdir('/proc/self');
        FS.mkdir('/proc/self/fd');
        FS.mount({
          mount: function() {
            var node = FS.createNode('/proc/self', 'fd', 16384 | 511 /* 0777 */, 73);
            node.node_ops = {
              lookup: function(parent, name) {
                var fd = +name;
                var stream = FS.getStream(fd);
                if (!stream) throw new FS.ErrnoError(8);
                var ret = {
                  parent: null,
                  mount: { mountpoint: 'fake' },
                  node_ops: { readlink: function() { return stream.path } }
                };
                ret.parent = ret; // make it look like a simple root node
                return ret;
              }
            };
            return node;
          }
        }, {}, '/proc/self/fd');
      },createStandardStreams:function() {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        var stdout = FS.open('/dev/stdout', 'w');
        var stderr = FS.open('/dev/stderr', 'w');
        assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
        assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
        assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function() {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno, node) {
          this.node = node;
          this.setErrno = function(errno) {
            this.errno = errno;
            for (var key in ERRNO_CODES) {
              if (ERRNO_CODES[key] === errno) {
                this.code = key;
                break;
              }
            }
          };
          this.setErrno(errno);
          this.message = ERRNO_MESSAGES[errno];
  
          // Try to get a maximally helpful stack trace. On Node.js, getting Error.stack
          // now ensures it shows what we want.
          if (this.stack) {
            // Define the stack property for Node.js 4, which otherwise errors on the next line.
            Object.defineProperty(this, "stack", { value: (new Error).stack, writable: true });
            this.stack = demangleAll(this.stack);
          }
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [44].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function() {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
  
        FS.filesystems = {
          'MEMFS': MEMFS,
        };
      },init:function(input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:function() {
        FS.init.initialized = false;
        // force-flush all streams, so we get musl std streams printed out
        var fflush = Module['_fflush'];
        if (fflush) fflush(0);
        // close all of our streams
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function(canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function(parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function(relative, base) {
        return PATH_FS.resolve(base, relative);
      },standardizePath:function(path) {
        return PATH.normalize(path);
      },findObject:function(path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function(path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function(parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function(parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function(parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function(parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function(parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function(parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function(obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (read_) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(read_(obj.url), true);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(29);
        return success;
      },createLazyFile:function(parent, name, url, canRead, canWrite) {
        // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
        function LazyUint8Array() {
          this.lengthKnown = false;
          this.chunks = []; // Loaded chunks. Index is the chunk number
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
          if (idx > this.length-1 || idx < 0) {
            return undefined;
          }
          var chunkOffset = idx % this.chunkSize;
          var chunkNum = (idx / this.chunkSize)|0;
          return this.getter(chunkNum)[chunkOffset];
        };
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
          this.getter = getter;
        };
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
          // Find length
          var xhr = new XMLHttpRequest();
          xhr.open('HEAD', url, false);
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          var datalength = Number(xhr.getResponseHeader("Content-length"));
          var header;
          var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
          var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
  
          var chunkSize = 1024*1024; // Chunk size in bytes
  
          if (!hasByteServing) chunkSize = datalength;
  
          // Function to get a range from the remote URL.
          var doXHR = (function(from, to) {
            if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
            if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
            // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
            // Some hints to the browser that we want binary data.
            if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
            if (xhr.overrideMimeType) {
              xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
  
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            if (xhr.response !== undefined) {
              return new Uint8Array(xhr.response || []);
            } else {
              return intArrayFromString(xhr.responseText || '', true);
            }
          });
          var lazyArray = this;
          lazyArray.setDataGetter(function(chunkNum) {
            var start = chunkNum * chunkSize;
            var end = (chunkNum+1) * chunkSize - 1; // including this byte
            end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
              lazyArray.chunks[chunkNum] = doXHR(start, end);
            }
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
            return lazyArray.chunks[chunkNum];
          });
  
          if (usesGzip || !datalength) {
            // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
            chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
            datalength = this.getter(0).length;
            chunkSize = datalength;
            out("LazyFiles on gzip forces download of the whole file when length is accessed");
          }
  
          this._length = datalength;
          this._chunkSize = chunkSize;
          this.lengthKnown = true;
        };
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          var lazyArray = new LazyUint8Array();
          Object.defineProperties(lazyArray, {
            length: {
              get: function() {
                if(!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._length;
              }
            },
            chunkSize: {
              get: function() {
                if(!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._chunkSize;
              }
            }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // Add a function that defers querying the file size until it is asked the first time.
        Object.defineProperties(node, {
          usedBytes: {
            get: function() { return this.contents.length; }
          }
        });
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(29);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(29);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
        Browser.init(); // XXX perhaps this method should move onto Browser?
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
        var dep = getUniqueRunDependency('cp ' + fullname); // might have several active requests for the same fullname
        function processData(byteArray) {
          function finish(byteArray) {
            if (preFinish) preFinish();
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency(dep);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency(dep);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency(dep);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function() {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function() {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function(paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          out('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function(paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};var SYSCALLS={DEFAULT_POLLMASK:5,mappings:{},umask:511,calculateAt:function(dirfd, path) {
        if (path[0] !== '/') {
          // relative path
          var dir;
          if (dirfd === -100) {
            dir = FS.cwd();
          } else {
            var dirstream = FS.getStream(dirfd);
            if (!dirstream) throw new FS.ErrnoError(8);
            dir = dirstream.path;
          }
          path = PATH.join2(dir, path);
        }
        return path;
      },doStat:function(func, path, buf) {
        try {
          var stat = func(path);
        } catch (e) {
          if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
            // an error occurred while trying to look up the path; we should just report ENOTDIR
            return -54;
          }
          throw e;
        }
        HEAP32[((buf)>>2)]=stat.dev;
        HEAP32[(((buf)+(4))>>2)]=0;
        HEAP32[(((buf)+(8))>>2)]=stat.ino;
        HEAP32[(((buf)+(12))>>2)]=stat.mode;
        HEAP32[(((buf)+(16))>>2)]=stat.nlink;
        HEAP32[(((buf)+(20))>>2)]=stat.uid;
        HEAP32[(((buf)+(24))>>2)]=stat.gid;
        HEAP32[(((buf)+(28))>>2)]=stat.rdev;
        HEAP32[(((buf)+(32))>>2)]=0;
        (tempI64 = [stat.size>>>0,(tempDouble=stat.size,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((buf)+(40))>>2)]=tempI64[0],HEAP32[(((buf)+(44))>>2)]=tempI64[1]);
        HEAP32[(((buf)+(48))>>2)]=4096;
        HEAP32[(((buf)+(52))>>2)]=stat.blocks;
        HEAP32[(((buf)+(56))>>2)]=(stat.atime.getTime() / 1000)|0;
        HEAP32[(((buf)+(60))>>2)]=0;
        HEAP32[(((buf)+(64))>>2)]=(stat.mtime.getTime() / 1000)|0;
        HEAP32[(((buf)+(68))>>2)]=0;
        HEAP32[(((buf)+(72))>>2)]=(stat.ctime.getTime() / 1000)|0;
        HEAP32[(((buf)+(76))>>2)]=0;
        (tempI64 = [stat.ino>>>0,(tempDouble=stat.ino,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((buf)+(80))>>2)]=tempI64[0],HEAP32[(((buf)+(84))>>2)]=tempI64[1]);
        return 0;
      },doMsync:function(addr, stream, len, flags, offset) {
        var buffer = new Uint8Array(HEAPU8.subarray(addr, addr + len));
        FS.msync(stream, buffer, offset, len, flags);
      },doMkdir:function(path, mode) {
        // remove a trailing slash, if one - /a/b/ has basename of '', but
        // we want to create b in the context of this function
        path = PATH.normalize(path);
        if (path[path.length-1] === '/') path = path.substr(0, path.length-1);
        FS.mkdir(path, mode, 0);
        return 0;
      },doMknod:function(path, mode, dev) {
        // we don't want this in the JS API as it uses mknod to create all nodes.
        switch (mode & 61440) {
          case 32768:
          case 8192:
          case 24576:
          case 4096:
          case 49152:
            break;
          default: return -28;
        }
        FS.mknod(path, mode, dev);
        return 0;
      },doReadlink:function(path, buf, bufsize) {
        if (bufsize <= 0) return -28;
        var ret = FS.readlink(path);
  
        var len = Math.min(bufsize, lengthBytesUTF8(ret));
        var endChar = HEAP8[buf+len];
        stringToUTF8(ret, buf, bufsize+1);
        // readlink is one of the rare functions that write out a C string, but does never append a null to the output buffer(!)
        // stringToUTF8() always appends a null byte, so restore the character under the null byte after the write.
        HEAP8[buf+len] = endChar;
  
        return len;
      },doAccess:function(path, amode) {
        if (amode & ~7) {
          // need a valid mode
          return -28;
        }
        var node;
        var lookup = FS.lookupPath(path, { follow: true });
        node = lookup.node;
        if (!node) {
          return -44;
        }
        var perms = '';
        if (amode & 4) perms += 'r';
        if (amode & 2) perms += 'w';
        if (amode & 1) perms += 'x';
        if (perms /* otherwise, they've just passed F_OK */ && FS.nodePermissions(node, perms)) {
          return -2;
        }
        return 0;
      },doDup:function(path, flags, suggestFD) {
        var suggest = FS.getStream(suggestFD);
        if (suggest) FS.close(suggest);
        return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
      },doReadv:function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[(((iov)+(i*8))>>2)];
          var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
          var curr = FS.read(stream, HEAP8,ptr, len, offset);
          if (curr < 0) return -1;
          ret += curr;
          if (curr < len) break; // nothing more to read
        }
        return ret;
      },doWritev:function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[(((iov)+(i*8))>>2)];
          var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
          var curr = FS.write(stream, HEAP8,ptr, len, offset);
          if (curr < 0) return -1;
          ret += curr;
        }
        return ret;
      },varargs:0,get:function(varargs) {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
        return ret;
      },getStr:function() {
        var ret = UTF8ToString(SYSCALLS.get());
        return ret;
      },getStreamFromFD:function(fd) {
        // TODO: when all syscalls use wasi, can remove the next line
        if (fd === undefined) fd = SYSCALLS.get();
        var stream = FS.getStream(fd);
        if (!stream) throw new FS.ErrnoError(8);
        return stream;
      },get64:function() {
        var low = SYSCALLS.get(), high = SYSCALLS.get();
        if (low >= 0) assert(high === 0);
        else assert(high === -1);
        return low;
      },getZero:function() {
        assert(SYSCALLS.get() === 0);
      }};function ___syscall221(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // fcntl64
      var stream = SYSCALLS.getStreamFromFD(), cmd = SYSCALLS.get();
      switch (cmd) {
        case 0: {
          var arg = SYSCALLS.get();
          if (arg < 0) {
            return -28;
          }
          var newStream;
          newStream = FS.open(stream.path, stream.flags, 0, arg);
          return newStream.fd;
        }
        case 1:
        case 2:
          return 0;  // FD_CLOEXEC makes no sense for a single process.
        case 3:
          return stream.flags;
        case 4: {
          var arg = SYSCALLS.get();
          stream.flags |= arg;
          return 0;
        }
        case 12:
        /* case 12: Currently in musl F_GETLK64 has same value as F_GETLK, so omitted to avoid duplicate case blocks. If that changes, uncomment this */ {
          
          var arg = SYSCALLS.get();
          var offset = 0;
          // We're always unlocked.
          HEAP16[(((arg)+(offset))>>1)]=2;
          return 0;
        }
        case 13:
        case 14:
        /* case 13: Currently in musl F_SETLK64 has same value as F_SETLK, so omitted to avoid duplicate case blocks. If that changes, uncomment this */
        /* case 14: Currently in musl F_SETLKW64 has same value as F_SETLKW, so omitted to avoid duplicate case blocks. If that changes, uncomment this */
          
          
          return 0; // Pretend that the locking is successful.
        case 16:
        case 8:
          return -28; // These are for sockets. We don't have them fully implemented yet.
        case 9:
          // musl trusts getown return values, due to a bug where they must be, as they overlap with errors. just return -1 here, so fnctl() returns that, and we set errno ourselves.
          ___setErrNo(28);
          return -1;
        default: {
          return -28;
        }
      }
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall5(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // open
      var pathname = SYSCALLS.getStr(), flags = SYSCALLS.get(), mode = SYSCALLS.get(); // optional TODO
      var stream = FS.open(pathname, flags, mode);
      return stream.fd;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall54(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // ioctl
      var stream = SYSCALLS.getStreamFromFD(), op = SYSCALLS.get();
      switch (op) {
        case 21509:
        case 21505: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21510:
        case 21511:
        case 21512:
        case 21506:
        case 21507:
        case 21508: {
          if (!stream.tty) return -59;
          return 0; // no-op, not actually adjusting terminal settings
        }
        case 21519: {
          if (!stream.tty) return -59;
          var argp = SYSCALLS.get();
          HEAP32[((argp)>>2)]=0;
          return 0;
        }
        case 21520: {
          if (!stream.tty) return -59;
          return -28; // not supported
        }
        case 21531: {
          var argp = SYSCALLS.get();
          return FS.ioctl(stream, op, argp);
        }
        case 21523: {
          // TODO: in theory we should write to the winsize struct that gets
          // passed in, but for now musl doesn't read anything on it
          if (!stream.tty) return -59;
          return 0;
        }
        case 21524: {
          // TODO: technically, this ioctl call should change the window size.
          // but, since emscripten doesn't have any concept of a terminal window
          // yet, we'll just silently throw it away as we do TIOCGWINSZ
          if (!stream.tty) return -59;
          return 0;
        }
        default: abort('bad ioctl syscall ' + op);
      }
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___unlock() {}

  function _abort() {
      abort();
    }

  function _emscripten_get_heap_size() {
      return HEAP8.length;
    }

  function _emscripten_get_now() { abort() }

  function _emscripten_get_sbrk_ptr() {
      return 691072;
    }

  
  
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      assert((varargs & 3) === 0);
      var textIndex = format;
      var argIndex = varargs;
      // This must be called before reading a double or i64 vararg. It will bump the pointer properly.
      // It also does an assert on i32 values, so it's nice to call it before all varargs calls.
      function prepVararg(ptr, type) {
        if (type === 'double' || type === 'i64') {
          // move so the load is aligned
          if (ptr & 7) {
            assert((ptr & 7) === 4);
            ptr += 4;
          }
        } else {
          assert((ptr & 3) === 0);
        }
        return ptr;
      }
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        argIndex = prepVararg(argIndex, type);
        if (type === 'double') {
          ret = HEAPF64[((argIndex)>>3)];
          argIndex += 8;
        } else if (type == 'i64') {
          ret = [HEAP32[((argIndex)>>2)],
                 HEAP32[(((argIndex)+(4))>>2)]];
          argIndex += 8;
        } else {
          assert((argIndex & 3) === 0);
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[((argIndex)>>2)];
          argIndex += 4;
        }
        return ret;
      }
  
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[((textIndex)>>0)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)>>0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          var flagPadSign = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              case 32:
                flagPadSign = true;
                break;
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)>>0)];
          }
  
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)>>0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)>>0)];
            }
          }
  
          // Handle precision.
          var precisionSet = false, precision = -1;
          if (next == 46) {
            precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)>>0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)>>0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)>>0)];
          }
          if (precision < 0) {
            precision = 6; // Standard default.
            precisionSet = false;
          }
  
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)>>0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)>>0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)>>0)];
  
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              currArg = getNextArg('i' + (argSize * 8));
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
  
              // Add sign if needed
              if (currArg >= 0) {
                if (flagAlwaysSigned) {
                  prefix = '+' + prefix;
                } else if (flagPadSign) {
                  prefix = ' ' + prefix;
                }
              }
  
              // Move sign to prefix so we zero-pad after the sign
              if (argText.charAt(0) == '-') {
                prefix = '-' + prefix;
                argText = argText.substr(1);
              }
  
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
  
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
  
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
  
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
  
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
  
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
  
                // Add sign.
                if (currArg >= 0) {
                  if (flagAlwaysSigned) {
                    argText = '+' + argText;
                  } else if (flagPadSign) {
                    argText = ' ' + argText;
                  }
                }
              }
  
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
  
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
  
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)>>0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length;
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[((i)>>0)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }
  
  
  
  function __emscripten_traverse_stack(args) {
      if (!args || !args.callee || !args.callee.name) {
        return [null, '', ''];
      }
  
      var funstr = args.callee.toString();
      var funcname = args.callee.name;
      var str = '(';
      var first = true;
      for (var i in args) {
        var a = args[i];
        if (!first) {
          str += ", ";
        }
        first = false;
        if (typeof a === 'number' || typeof a === 'string') {
          str += a;
        } else {
          str += '(' + typeof a + ')';
        }
      }
      str += ')';
      var caller = args.callee.caller;
      args = caller ? caller.arguments : [];
      if (first)
        str = '';
      return [args, funcname, str];
    }function _emscripten_get_callstack_js(flags) {
      var callstack = jsStackTrace();
  
      // Find the symbols in the callstack that corresponds to the functions that report callstack information, and remove everything up to these from the output.
      var iThisFunc = callstack.lastIndexOf('_emscripten_log');
      var iThisFunc2 = callstack.lastIndexOf('_emscripten_get_callstack');
      var iNextLine = callstack.indexOf('\n', Math.max(iThisFunc, iThisFunc2))+1;
      callstack = callstack.slice(iNextLine);
  
      // If user requested to see the original source stack, but no source map information is available, just fall back to showing the JS stack.
      if (flags & 8/*EM_LOG_C_STACK*/ && typeof emscripten_source_map === 'undefined') {
        warnOnce('Source map information is not available, emscripten_log with EM_LOG_C_STACK will be ignored. Build with "--pre-js $EMSCRIPTEN/src/emscripten-source-map.min.js" linker flag to add source map loading to code.');
        flags ^= 8/*EM_LOG_C_STACK*/;
        flags |= 16/*EM_LOG_JS_STACK*/;
      }
  
      var stack_args = null;
      if (flags & 128 /*EM_LOG_FUNC_PARAMS*/) {
        // To get the actual parameters to the functions, traverse the stack via the unfortunately deprecated 'arguments.callee' method, if it works:
        stack_args = __emscripten_traverse_stack(arguments);
        while (stack_args[1].indexOf('_emscripten_') >= 0)
          stack_args = __emscripten_traverse_stack(stack_args[0]);
      }
  
      // Process all lines:
      var lines = callstack.split('\n');
      callstack = '';
      var newFirefoxRe = new RegExp('\\s*(.*?)@(.*?):([0-9]+):([0-9]+)'); // New FF30 with column info: extract components of form '       Object._main@http://server.com:4324:12'
      var firefoxRe = new RegExp('\\s*(.*?)@(.*):(.*)(:(.*))?'); // Old FF without column info: extract components of form '       Object._main@http://server.com:4324'
      var chromeRe = new RegExp('\\s*at (.*?) \\\((.*):(.*):(.*)\\\)'); // Extract components of form '    at Object._main (http://server.com/file.html:4324:12)'
  
      for (var l in lines) {
        var line = lines[l];
  
        var jsSymbolName = '';
        var file = '';
        var lineno = 0;
        var column = 0;
  
        var parts = chromeRe.exec(line);
        if (parts && parts.length == 5) {
          jsSymbolName = parts[1];
          file = parts[2];
          lineno = parts[3];
          column = parts[4];
        } else {
          parts = newFirefoxRe.exec(line);
          if (!parts) parts = firefoxRe.exec(line);
          if (parts && parts.length >= 4) {
            jsSymbolName = parts[1];
            file = parts[2];
            lineno = parts[3];
            column = parts[4]|0; // Old Firefox doesn't carry column information, but in new FF30, it is present. See https://bugzilla.mozilla.org/show_bug.cgi?id=762556
          } else {
            // Was not able to extract this line for demangling/sourcemapping purposes. Output it as-is.
            callstack += line + '\n';
            continue;
          }
        }
  
        // Try to demangle the symbol, but fall back to showing the original JS symbol name if not available.
        var cSymbolName = (flags & 32/*EM_LOG_DEMANGLE*/) ? demangle(jsSymbolName) : jsSymbolName;
        if (!cSymbolName) {
          cSymbolName = jsSymbolName;
        }
  
        var haveSourceMap = false;
  
        if (flags & 8/*EM_LOG_C_STACK*/) {
          var orig = emscripten_source_map.originalPositionFor({line: lineno, column: column});
          haveSourceMap = (orig && orig.source);
          if (haveSourceMap) {
            if (flags & 64/*EM_LOG_NO_PATHS*/) {
              orig.source = orig.source.substring(orig.source.replace(/\\/g, "/").lastIndexOf('/')+1);
            }
            callstack += '    at ' + cSymbolName + ' (' + orig.source + ':' + orig.line + ':' + orig.column + ')\n';
          }
        }
        if ((flags & 16/*EM_LOG_JS_STACK*/) || !haveSourceMap) {
          if (flags & 64/*EM_LOG_NO_PATHS*/) {
            file = file.substring(file.replace(/\\/g, "/").lastIndexOf('/')+1);
          }
          callstack += (haveSourceMap ? ('     = '+jsSymbolName) : ('    at '+cSymbolName)) + ' (' + file + ':' + lineno + ':' + column + ')\n';
        }
  
        // If we are still keeping track with the callstack by traversing via 'arguments.callee', print the function parameters as well.
        if (flags & 128 /*EM_LOG_FUNC_PARAMS*/ && stack_args[0]) {
          if (stack_args[1] == jsSymbolName && stack_args[2].length > 0) {
            callstack = callstack.replace(/\s+$/, '');
            callstack += ' with values: ' + stack_args[1] + stack_args[2] + '\n';
          }
          stack_args = __emscripten_traverse_stack(stack_args[0]);
        }
      }
      // Trim extra whitespace at the end of the output.
      callstack = callstack.replace(/\s+$/, '');
      return callstack;
    }function _emscripten_log_js(flags, str) {
      if (flags & 24/*EM_LOG_C_STACK | EM_LOG_JS_STACK*/) {
        str = str.replace(/\s+$/, ''); // Ensure the message and the callstack are joined cleanly with exactly one newline.
        str += (str.length > 0 ? '\n' : '') + _emscripten_get_callstack_js(flags);
      }
  
      if (flags & 1 /*EM_LOG_CONSOLE*/) {
        if (flags & 4 /*EM_LOG_ERROR*/) {
          console.error(str);
        } else if (flags & 2 /*EM_LOG_WARN*/) {
          console.warn(str);
        } else {
          console.log(str);
        }
      } else if (flags & 6 /*EM_LOG_ERROR|EM_LOG_WARN*/) {
        err(str);
      } else {
        out(str);
      }
    }function _emscripten_log(flags, varargs) {
      // Extract the (optionally-existing) printf format specifier field from varargs.
      var format = HEAP32[((varargs)>>2)];
      varargs += 4;
      var str = '';
      if (format) {
        var result = __formatString(format, varargs);
        for(var i = 0 ; i < result.length; ++i) {
          str += String.fromCharCode(result[i]);
        }
      }
      _emscripten_log_js(flags, str);
    }

  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
    }

  
  
  var JSEvents={keyEvent:0,mouseEvent:0,wheelEvent:0,uiEvent:0,focusEvent:0,deviceOrientationEvent:0,deviceMotionEvent:0,fullscreenChangeEvent:0,pointerlockChangeEvent:0,visibilityChangeEvent:0,touchEvent:0,previousFullscreenElement:null,previousScreenX:null,previousScreenY:null,removeEventListenersRegistered:false,removeAllEventListeners:function() {
        for(var i = JSEvents.eventHandlers.length-1; i >= 0; --i) {
          JSEvents._removeHandler(i);
        }
        JSEvents.eventHandlers = [];
        JSEvents.deferredCalls = [];
      },registerRemoveEventListeners:function() {
        if (!JSEvents.removeEventListenersRegistered) {
          __ATEXIT__.push(JSEvents.removeAllEventListeners);
          JSEvents.removeEventListenersRegistered = true;
        }
      },deferredCalls:[],deferCall:function(targetFunction, precedence, argsList) {
        function arraysHaveEqualContent(arrA, arrB) {
          if (arrA.length != arrB.length) return false;
  
          for(var i in arrA) {
            if (arrA[i] != arrB[i]) return false;
          }
          return true;
        }
        // Test if the given call was already queued, and if so, don't add it again.
        for(var i in JSEvents.deferredCalls) {
          var call = JSEvents.deferredCalls[i];
          if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
            return;
          }
        }
        JSEvents.deferredCalls.push({
          targetFunction: targetFunction,
          precedence: precedence,
          argsList: argsList
        });
  
        JSEvents.deferredCalls.sort(function(x,y) { return x.precedence < y.precedence; });
      },removeDeferredCalls:function(targetFunction) {
        for(var i = 0; i < JSEvents.deferredCalls.length; ++i) {
          if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
            JSEvents.deferredCalls.splice(i, 1);
            --i;
          }
        }
      },canPerformEventHandlerRequests:function() {
        return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
      },runDeferredCalls:function() {
        if (!JSEvents.canPerformEventHandlerRequests()) {
          return;
        }
        for(var i = 0; i < JSEvents.deferredCalls.length; ++i) {
          var call = JSEvents.deferredCalls[i];
          JSEvents.deferredCalls.splice(i, 1);
          --i;
          call.targetFunction.apply(this, call.argsList);
        }
      },inEventHandler:0,currentEventHandler:null,eventHandlers:[],removeAllHandlersOnTarget:function(target, eventTypeString) {
        for(var i = 0; i < JSEvents.eventHandlers.length; ++i) {
          if (JSEvents.eventHandlers[i].target == target && 
            (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
             JSEvents._removeHandler(i--);
           }
        }
      },_removeHandler:function(i) {
        var h = JSEvents.eventHandlers[i];
        h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
        JSEvents.eventHandlers.splice(i, 1);
      },registerOrRemoveHandler:function(eventHandler) {
        var jsEventHandler = function jsEventHandler(event) {
          // Increment nesting count for the event handler.
          ++JSEvents.inEventHandler;
          JSEvents.currentEventHandler = eventHandler;
          // Process any old deferred calls the user has placed.
          JSEvents.runDeferredCalls();
          // Process the actual event, calls back to user C code handler.
          eventHandler.handlerFunc(event);
          // Process any new deferred calls that were placed right now from this event handler.
          JSEvents.runDeferredCalls();
          // Out of event handler - restore nesting count.
          --JSEvents.inEventHandler;
        };
        
        if (eventHandler.callbackfunc) {
          eventHandler.eventListenerFunc = jsEventHandler;
          eventHandler.target.addEventListener(eventHandler.eventTypeString, jsEventHandler, eventHandler.useCapture);
          JSEvents.eventHandlers.push(eventHandler);
          JSEvents.registerRemoveEventListeners();
        } else {
          for(var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if (JSEvents.eventHandlers[i].target == eventHandler.target
             && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
               JSEvents._removeHandler(i--);
             }
          }
        }
      },getNodeNameForTarget:function(target) {
        if (!target) return '';
        if (target == window) return '#window';
        if (target == screen) return '#screen';
        return (target && target.nodeName) ? target.nodeName : '';
      },fullscreenEnabled:function() {
        return document.fullscreenEnabled
        // Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitFullscreenEnabled.
        // TODO: If Safari at some point ships with unprefixed version, update the version check above.
        || document.webkitFullscreenEnabled
         ;
      }};
  
  function __setLetterbox(element, topBottom, leftRight) {
        // Cannot use margin to specify letterboxes in FF or Chrome, since those ignore margins in fullscreen mode.
        element.style.paddingLeft = element.style.paddingRight = leftRight + 'px';
        element.style.paddingTop = element.style.paddingBottom = topBottom + 'px';
    }
  
  
  
  
  function __maybeCStringToJsString(cString) {
      return cString === cString + 0 ? UTF8ToString(cString) : cString;
    }
  
  var __specialEventTargets=[0, typeof document !== 'undefined' ? document : 0, typeof window !== 'undefined' ? window : 0];function __findEventTarget(target) {
      var domElement = __specialEventTargets[target] || (typeof document !== 'undefined' ? document.querySelector(__maybeCStringToJsString(target)) : undefined);
      return domElement;
    }function __findCanvasEventTarget(target) { return __findEventTarget(target); }function _emscripten_set_canvas_element_size(target, width, height) {
      var canvas = __findCanvasEventTarget(target);
      if (!canvas) return -4;
      canvas.width = width;
      canvas.height = height;
      return 0;
    }
  
  function _emscripten_get_canvas_element_size(target, width, height) {
      var canvas = __findCanvasEventTarget(target);
      if (!canvas) return -4;
      HEAP32[((width)>>2)]=canvas.width;
      HEAP32[((height)>>2)]=canvas.height;
    }
  
  function __get_canvas_element_size(target) {
      var stackTop = stackSave();
      var w = stackAlloc(8);
      var h = w + 4;
  
      var targetInt = stackAlloc(target.id.length+1);
      stringToUTF8(target.id, targetInt, target.id.length+1);
      var ret = _emscripten_get_canvas_element_size(targetInt, w, h);
      var size = [HEAP32[((w)>>2)], HEAP32[((h)>>2)]];
      stackRestore(stackTop);
      return size;
    }
  
  function __set_canvas_element_size(target, width, height) {
      if (!target.controlTransferredOffscreen) {
        target.width = width;
        target.height = height;
      } else {
        // This function is being called from high-level JavaScript code instead of asm.js/Wasm,
        // and it needs to synchronously proxy over to another thread, so marshal the string onto the heap to do the call.
        var stackTop = stackSave();
        var targetInt = stackAlloc(target.id.length+1);
        stringToUTF8(target.id, targetInt, target.id.length+1);
        _emscripten_set_canvas_element_size(targetInt, width, height);
        stackRestore(stackTop);
      }
    }
  
  
  
  function __registerRestoreOldStyle(canvas) {
      var canvasSize = __get_canvas_element_size(canvas);
      var oldWidth = canvasSize[0];
      var oldHeight = canvasSize[1];
      var oldCssWidth = canvas.style.width;
      var oldCssHeight = canvas.style.height;
      var oldBackgroundColor = canvas.style.backgroundColor; // Chrome reads color from here.
      var oldDocumentBackgroundColor = document.body.style.backgroundColor; // IE11 reads color from here.
      // Firefox always has black background color.
      var oldPaddingLeft = canvas.style.paddingLeft; // Chrome, FF, Safari
      var oldPaddingRight = canvas.style.paddingRight;
      var oldPaddingTop = canvas.style.paddingTop;
      var oldPaddingBottom = canvas.style.paddingBottom;
      var oldMarginLeft = canvas.style.marginLeft; // IE11
      var oldMarginRight = canvas.style.marginRight;
      var oldMarginTop = canvas.style.marginTop;
      var oldMarginBottom = canvas.style.marginBottom;
      var oldDocumentBodyMargin = document.body.style.margin;
      var oldDocumentOverflow = document.documentElement.style.overflow; // Chrome, Firefox
      var oldDocumentScroll = document.body.scroll; // IE
      var oldImageRendering = canvas.style.imageRendering;
  
      function restoreOldStyle() {
        var fullscreenElement = document.fullscreenElement
          || document.webkitFullscreenElement
          || document.msFullscreenElement
          ;
        if (!fullscreenElement) {
          document.removeEventListener('fullscreenchange', restoreOldStyle);
  
  
          // Unprefixed Fullscreen API shipped in Chromium 71 (https://bugs.chromium.org/p/chromium/issues/detail?id=383813)
          // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
          document.removeEventListener('webkitfullscreenchange', restoreOldStyle);
  
  
          __set_canvas_element_size(canvas, oldWidth, oldHeight);
  
          canvas.style.width = oldCssWidth;
          canvas.style.height = oldCssHeight;
          canvas.style.backgroundColor = oldBackgroundColor; // Chrome
          // IE11 hack: assigning 'undefined' or an empty string to document.body.style.backgroundColor has no effect, so first assign back the default color
          // before setting the undefined value. Setting undefined value is also important, or otherwise we would later treat that as something that the user
          // had explicitly set so subsequent fullscreen transitions would not set background color properly.
          if (!oldDocumentBackgroundColor) document.body.style.backgroundColor = 'white';
          document.body.style.backgroundColor = oldDocumentBackgroundColor; // IE11
          canvas.style.paddingLeft = oldPaddingLeft; // Chrome, FF, Safari
          canvas.style.paddingRight = oldPaddingRight;
          canvas.style.paddingTop = oldPaddingTop;
          canvas.style.paddingBottom = oldPaddingBottom;
          canvas.style.marginLeft = oldMarginLeft; // IE11
          canvas.style.marginRight = oldMarginRight;
          canvas.style.marginTop = oldMarginTop;
          canvas.style.marginBottom = oldMarginBottom;
          document.body.style.margin = oldDocumentBodyMargin;
          document.documentElement.style.overflow = oldDocumentOverflow; // Chrome, Firefox
          document.body.scroll = oldDocumentScroll; // IE
          canvas.style.imageRendering = oldImageRendering;
          if (canvas.GLctxObject) canvas.GLctxObject.GLctx.viewport(0, 0, oldWidth, oldHeight);
  
          if (__currentFullscreenStrategy.canvasResizedCallback) {
            dynCall_iiii(__currentFullscreenStrategy.canvasResizedCallback, 37, 0, __currentFullscreenStrategy.canvasResizedCallbackUserData);
          }
        }
      }
      document.addEventListener('fullscreenchange', restoreOldStyle);
      // Unprefixed Fullscreen API shipped in Chromium 71 (https://bugs.chromium.org/p/chromium/issues/detail?id=383813)
      // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
      document.addEventListener('webkitfullscreenchange', restoreOldStyle);
      return restoreOldStyle;
    }
  
  function __getBoundingClientRect(e) {
      return e.getBoundingClientRect();
    }function _JSEvents_resizeCanvasForFullscreen(target, strategy) {
      var restoreOldStyle = __registerRestoreOldStyle(target);
      var cssWidth = strategy.softFullscreen ? innerWidth : screen.width;
      var cssHeight = strategy.softFullscreen ? innerHeight : screen.height;
      var rect = __getBoundingClientRect(target);
      var windowedCssWidth = rect.width;
      var windowedCssHeight = rect.height;
      var canvasSize = __get_canvas_element_size(target);
      var windowedRttWidth = canvasSize[0];
      var windowedRttHeight = canvasSize[1];
  
      if (strategy.scaleMode == 3) {
        __setLetterbox(target, (cssHeight - windowedCssHeight) / 2, (cssWidth - windowedCssWidth) / 2);
        cssWidth = windowedCssWidth;
        cssHeight = windowedCssHeight;
      } else if (strategy.scaleMode == 2) {
        if (cssWidth*windowedRttHeight < windowedRttWidth*cssHeight) {
          var desiredCssHeight = windowedRttHeight * cssWidth / windowedRttWidth;
          __setLetterbox(target, (cssHeight - desiredCssHeight) / 2, 0);
          cssHeight = desiredCssHeight;
        } else {
          var desiredCssWidth = windowedRttWidth * cssHeight / windowedRttHeight;
          __setLetterbox(target, 0, (cssWidth - desiredCssWidth) / 2);
          cssWidth = desiredCssWidth;
        }
      }
  
      // If we are adding padding, must choose a background color or otherwise Chrome will give the
      // padding a default white color. Do it only if user has not customized their own background color.
      if (!target.style.backgroundColor) target.style.backgroundColor = 'black';
      // IE11 does the same, but requires the color to be set in the document body.
      if (!document.body.style.backgroundColor) document.body.style.backgroundColor = 'black'; // IE11
      // Firefox always shows black letterboxes independent of style color.
  
      target.style.width = cssWidth + 'px';
      target.style.height = cssHeight + 'px';
  
      if (strategy.filteringMode == 1) {
        target.style.imageRendering = 'optimizeSpeed';
        target.style.imageRendering = '-moz-crisp-edges';
        target.style.imageRendering = '-o-crisp-edges';
        target.style.imageRendering = '-webkit-optimize-contrast';
        target.style.imageRendering = 'optimize-contrast';
        target.style.imageRendering = 'crisp-edges';
        target.style.imageRendering = 'pixelated';
      }
  
      var dpiScale = (strategy.canvasResolutionScaleMode == 2) ? devicePixelRatio : 1;
      if (strategy.canvasResolutionScaleMode != 0) {
        var newWidth = (cssWidth * dpiScale)|0;
        var newHeight = (cssHeight * dpiScale)|0;
        __set_canvas_element_size(target, newWidth, newHeight);
        if (target.GLctxObject) target.GLctxObject.GLctx.viewport(0, 0, newWidth, newHeight);
      }
      return restoreOldStyle;
    }function _JSEvents_requestFullscreen(target, strategy) {
      // EMSCRIPTEN_FULLSCREEN_SCALE_DEFAULT + EMSCRIPTEN_FULLSCREEN_CANVAS_SCALE_NONE is a mode where no extra logic is performed to the DOM elements.
      if (strategy.scaleMode != 0 || strategy.canvasResolutionScaleMode != 0) {
        _JSEvents_resizeCanvasForFullscreen(target, strategy);
      }
  
      if (target.requestFullscreen) {
        target.requestFullscreen();
      } else if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else {
        return JSEvents.fullscreenEnabled() ? -3 : -1;
      }
  
      if (strategy.canvasResizedCallback) {
        dynCall_iiii(strategy.canvasResizedCallback, 37, 0, strategy.canvasResizedCallbackUserData);
      }
  
      return 0;
    }function __emscripten_do_request_fullscreen(target, strategy) {
      if (!JSEvents.fullscreenEnabled()) return -1;
      target = __findEventTarget(target);
      if (!target) return -4;
  
      if (!target.requestFullscreen
        && !target.webkitRequestFullscreen
        ) {
        return -3;
      }
  
      var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
  
      // Queue this function call if we're not currently in an event handler and the user saw it appropriate to do so.
      if (!canPerformRequests) {
        if (strategy.deferUntilInEventHandler) {
          JSEvents.deferCall(_JSEvents_requestFullscreen, 1 /* priority over pointer lock */, [target, strategy]);
          return 1;
        } else {
          return -2;
        }
      }
  
      return _JSEvents_requestFullscreen(target, strategy);
    }
  
  var __currentFullscreenStrategy={};function _emscripten_request_fullscreen_strategy(target, deferUntilInEventHandler, fullscreenStrategy) {
      var strategy = {};
      strategy.scaleMode = HEAP32[((fullscreenStrategy)>>2)];
      strategy.canvasResolutionScaleMode = HEAP32[(((fullscreenStrategy)+(4))>>2)];
      strategy.filteringMode = HEAP32[(((fullscreenStrategy)+(8))>>2)];
      strategy.deferUntilInEventHandler = deferUntilInEventHandler;
      strategy.canvasResizedCallback = HEAP32[(((fullscreenStrategy)+(12))>>2)];
      strategy.canvasResizedCallbackUserData = HEAP32[(((fullscreenStrategy)+(16))>>2)];
      __currentFullscreenStrategy = strategy;
  
      return __emscripten_do_request_fullscreen(target, strategy);
    }

  
  function abortOnCannotGrowMemory(requestedSize) {
      abort('Cannot enlarge memory arrays to size ' + requestedSize + ' bytes (OOM). Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value ' + HEAP8.length + ', (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ');
    }function _emscripten_resize_heap(requestedSize) {
      abortOnCannotGrowMemory(requestedSize);
    }

  
  function __registerFocusEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
      if (!JSEvents.focusEvent) JSEvents.focusEvent = _malloc( 256 );
  
      var focusEventHandlerFunc = function(ev) {
        var e = ev || event;
  
        var nodeName = JSEvents.getNodeNameForTarget(e.target);
        var id = e.target.id ? e.target.id : '';
  
        var focusEvent = JSEvents.focusEvent;
        stringToUTF8(nodeName, focusEvent + 0, 128);
        stringToUTF8(id, focusEvent + 128, 128);
  
        if (dynCall_iiii(callbackfunc, eventTypeId, focusEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: __findEventTarget(target),
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: focusEventHandlerFunc,
        useCapture: useCapture
      };
      JSEvents.registerOrRemoveHandler(eventHandler);
    }function _emscripten_set_focus_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerFocusEventCallback(target, userData, useCapture, callbackfunc, 13, "focus", targetThread);
      return 0;
    }

  function _emscripten_set_focusin_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerFocusEventCallback(target, userData, useCapture, callbackfunc, 14, "focusin", targetThread);
      return 0;
    }

  function _emscripten_set_focusout_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerFocusEventCallback(target, userData, useCapture, callbackfunc, 15, "focusout", targetThread);
      return 0;
    }

  
  function __registerKeyEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
      if (!JSEvents.keyEvent) JSEvents.keyEvent = _malloc( 164 );
  
      var keyEventHandlerFunc = function(ev) {
        var e = ev || event;
  
        var keyEventData = JSEvents.keyEvent;
        stringToUTF8(e.key ? e.key : "", keyEventData + 0, 32);
        stringToUTF8(e.code ? e.code : "", keyEventData + 32, 32);
        HEAP32[(((keyEventData)+(64))>>2)]=e.location;
        HEAP32[(((keyEventData)+(68))>>2)]=e.ctrlKey;
        HEAP32[(((keyEventData)+(72))>>2)]=e.shiftKey;
        HEAP32[(((keyEventData)+(76))>>2)]=e.altKey;
        HEAP32[(((keyEventData)+(80))>>2)]=e.metaKey;
        HEAP32[(((keyEventData)+(84))>>2)]=e.repeat;
        stringToUTF8(e.locale ? e.locale : "", keyEventData + 88, 32);
        stringToUTF8(e.char ? e.char : "", keyEventData + 120, 32);
        HEAP32[(((keyEventData)+(152))>>2)]=e.charCode;
        HEAP32[(((keyEventData)+(156))>>2)]=e.keyCode;
        HEAP32[(((keyEventData)+(160))>>2)]=e.which;
  
        if (dynCall_iiii(callbackfunc, eventTypeId, keyEventData, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: __findEventTarget(target),
        allowsDeferredCalls: true,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: keyEventHandlerFunc,
        useCapture: useCapture
      };
      JSEvents.registerOrRemoveHandler(eventHandler);
    }function _emscripten_set_keydown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerKeyEventCallback(target, userData, useCapture, callbackfunc, 2, "keydown", targetThread);
      return 0;
    }

  function _emscripten_set_keypress_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerKeyEventCallback(target, userData, useCapture, callbackfunc, 1, "keypress", targetThread);
      return 0;
    }

  function _emscripten_set_keyup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerKeyEventCallback(target, userData, useCapture, callbackfunc, 3, "keyup", targetThread);
      return 0;
    }

  
  
  var Browser={mainLoop:{scheduler:null,method:"",currentlyRunningMainloop:0,func:null,arg:0,timingMode:0,timingValue:0,currentFrameNumber:0,queue:[],pause:function() {
          Browser.mainLoop.scheduler = null;
          Browser.mainLoop.currentlyRunningMainloop++; // Incrementing this signals the previous main loop that it's now become old, and it must return.
        },resume:function() {
          Browser.mainLoop.currentlyRunningMainloop++;
          var timingMode = Browser.mainLoop.timingMode;
          var timingValue = Browser.mainLoop.timingValue;
          var func = Browser.mainLoop.func;
          Browser.mainLoop.func = null;
          _emscripten_set_main_loop(func, 0, false, Browser.mainLoop.arg, true /* do not set timing and call scheduler, we will do it on the next lines */);
          _emscripten_set_main_loop_timing(timingMode, timingValue);
          Browser.mainLoop.scheduler();
        },updateStatus:function() {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        },runIter:function(func) {
          if (ABORT) return;
          if (Module['preMainLoop']) {
            var preRet = Module['preMainLoop']();
            if (preRet === false) {
              return; // |return false| skips a frame
            }
          }
          try {
            func();
          } catch (e) {
            if (e instanceof ExitStatus) {
              return;
            } else {
              if (e && typeof e === 'object' && e.stack) err('exception thrown: ' + [e, e.stack]);
              throw e;
            }
          }
          if (Module['postMainLoop']) Module['postMainLoop']();
        }},isFullscreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function() {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
  
        if (Browser.initted) return;
        Browser.initted = true;
  
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          assert(typeof url == 'string', 'createObjectURL must return a url as a string');
          var img = new Image();
          img.onload = function img_onload() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function img_onerror(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            assert(typeof url == 'string', 'createObjectURL must return a url as a string');
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function audio_onerror(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
  
  
        // Canvas event setup
  
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === Module['canvas'] ||
                                document['mozPointerLockElement'] === Module['canvas'] ||
                                document['webkitPointerLockElement'] === Module['canvas'] ||
                                document['msPointerLockElement'] === Module['canvas'];
        }
        var canvas = Module['canvas'];
        if (canvas) {
          // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
          // Module['forcedAspectRatio'] = 4 / 3;
  
          canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                      canvas['mozRequestPointerLock'] ||
                                      canvas['webkitRequestPointerLock'] ||
                                      canvas['msRequestPointerLock'] ||
                                      function(){};
          canvas.exitPointerLock = document['exitPointerLock'] ||
                                   document['mozExitPointerLock'] ||
                                   document['webkitExitPointerLock'] ||
                                   document['msExitPointerLock'] ||
                                   function(){}; // no-op if function does not exist
          canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
  
          document.addEventListener('pointerlockchange', pointerLockChange, false);
          document.addEventListener('mozpointerlockchange', pointerLockChange, false);
          document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
          document.addEventListener('mspointerlockchange', pointerLockChange, false);
  
          if (Module['elementPointerLock']) {
            canvas.addEventListener("click", function(ev) {
              if (!Browser.pointerLock && Module['canvas'].requestPointerLock) {
                Module['canvas'].requestPointerLock();
                ev.preventDefault();
              }
            }, false);
          }
        }
      },createContext:function(canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx; // no need to recreate GL context if it's already been created for this canvas.
  
        var ctx;
        var contextHandle;
        if (useWebGL) {
          // For GLES2/desktop GL compatibility, adjust a few defaults to be different to WebGL defaults, so that they align better with the desktop defaults.
          var contextAttributes = {
            antialias: false,
            alpha: false,
            majorVersion: 1,
          };
  
          if (webGLContextAttributes) {
            for (var attribute in webGLContextAttributes) {
              contextAttributes[attribute] = webGLContextAttributes[attribute];
            }
          }
  
          // This check of existence of GL is here to satisfy Closure compiler, which yells if variable GL is referenced below but GL object is not
          // actually compiled in because application is not doing any GL operations. TODO: Ideally if GL is not being used, this function
          // Browser.createContext() should not even be emitted.
          if (typeof GL !== 'undefined') {
            contextHandle = GL.createContext(canvas, contextAttributes);
            if (contextHandle) {
              ctx = GL.getContext(contextHandle).GLctx;
            }
          }
        } else {
          ctx = canvas.getContext('2d');
        }
  
        if (!ctx) return null;
  
        if (setInModule) {
          if (!useWebGL) assert(typeof GLctx === 'undefined', 'cannot set in module if GLctx is used, but we are a non-GL context that would replace it');
  
          Module.ctx = ctx;
          if (useWebGL) GL.makeContextCurrent(contextHandle);
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function(canvas, useWebGL, setInModule) {},fullscreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullscreen:function(lockPointer, resizeCanvas, vrDevice) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        Browser.vrDevice = vrDevice;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
        if (typeof Browser.vrDevice === 'undefined') Browser.vrDevice = null;
  
        var canvas = Module['canvas'];
        function fullscreenChange() {
          Browser.isFullscreen = false;
          var canvasContainer = canvas.parentNode;
          if ((document['fullscreenElement'] || document['mozFullScreenElement'] ||
               document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
               document['webkitCurrentFullScreenElement']) === canvasContainer) {
            canvas.exitFullscreen = Browser.exitFullscreen;
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullscreen = true;
            if (Browser.resizeCanvas) {
              Browser.setFullscreenCanvasSize();
            } else {
              Browser.updateCanvasDimensions(canvas);
            }
          } else {
            // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
            canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
            canvasContainer.parentNode.removeChild(canvasContainer);
  
            if (Browser.resizeCanvas) {
              Browser.setWindowedCanvasSize();
            } else {
              Browser.updateCanvasDimensions(canvas);
            }
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullscreen);
          if (Module['onFullscreen']) Module['onFullscreen'](Browser.isFullscreen);
        }
  
        if (!Browser.fullscreenHandlersInstalled) {
          Browser.fullscreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullscreenChange, false);
          document.addEventListener('mozfullscreenchange', fullscreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullscreenChange, false);
          document.addEventListener('MSFullscreenChange', fullscreenChange, false);
        }
  
        // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
  
        // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
        canvasContainer.requestFullscreen = canvasContainer['requestFullscreen'] ||
                                            canvasContainer['mozRequestFullScreen'] ||
                                            canvasContainer['msRequestFullscreen'] ||
                                           (canvasContainer['webkitRequestFullscreen'] ? function() { canvasContainer['webkitRequestFullscreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null) ||
                                           (canvasContainer['webkitRequestFullScreen'] ? function() { canvasContainer['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
  
        if (vrDevice) {
          canvasContainer.requestFullscreen({ vrDisplay: vrDevice });
        } else {
          canvasContainer.requestFullscreen();
        }
      },requestFullScreen:function() {
        abort('Module.requestFullScreen has been replaced by Module.requestFullscreen (without a capital S)');
      },exitFullscreen:function() {
        // This is workaround for chrome. Trying to exit from fullscreen
        // not in fullscreen state will cause "TypeError: Document not active"
        // in chrome. See https://github.com/emscripten-core/emscripten/pull/8236
        if (!Browser.isFullscreen) {
          return false;
        }
  
        var CFS = document['exitFullscreen'] ||
                  document['cancelFullScreen'] ||
                  document['mozCancelFullScreen'] ||
                  document['msExitFullscreen'] ||
                  document['webkitCancelFullScreen'] ||
            (function() {});
        CFS.apply(document, []);
        return true;
      },nextRAF:0,fakeRequestAnimationFrame:function(func) {
        // try to keep 60fps between calls to here
        var now = Date.now();
        if (Browser.nextRAF === 0) {
          Browser.nextRAF = now + 1000/60;
        } else {
          while (now + 2 >= Browser.nextRAF) { // fudge a little, to avoid timer jitter causing us to do lots of delay:0
            Browser.nextRAF += 1000/60;
          }
        }
        var delay = Math.max(Browser.nextRAF - now, 0);
        setTimeout(func, delay);
      },requestAnimationFrame:function(func) {
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(func);
          return;
        }
        var RAF = Browser.fakeRequestAnimationFrame;
        RAF(func);
      },safeCallback:function(func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },allowAsyncCallbacks:true,queuedAsyncCallbacks:[],pauseAsyncCallbacks:function() {
        Browser.allowAsyncCallbacks = false;
      },resumeAsyncCallbacks:function() { // marks future callbacks as ok to execute, and synchronously runs any remaining ones right now
        Browser.allowAsyncCallbacks = true;
        if (Browser.queuedAsyncCallbacks.length > 0) {
          var callbacks = Browser.queuedAsyncCallbacks;
          Browser.queuedAsyncCallbacks = [];
          callbacks.forEach(function(func) {
            func();
          });
        }
      },safeRequestAnimationFrame:function(func) {
        return Browser.requestAnimationFrame(function() {
          if (ABORT) return;
          if (Browser.allowAsyncCallbacks) {
            func();
          } else {
            Browser.queuedAsyncCallbacks.push(func);
          }
        });
      },safeSetTimeout:function(func, timeout) {
        noExitRuntime = true;
        return setTimeout(function() {
          if (ABORT) return;
          if (Browser.allowAsyncCallbacks) {
            func();
          } else {
            Browser.queuedAsyncCallbacks.push(func);
          }
        }, timeout);
      },safeSetInterval:function(func, timeout) {
        noExitRuntime = true;
        return setInterval(function() {
          if (ABORT) return;
          if (Browser.allowAsyncCallbacks) {
            func();
          } // drop it on the floor otherwise, next interval will kick in
        }, timeout);
      },getMimetype:function(name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function(func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function(event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function(event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },getMouseWheelDelta:function(event) {
        var delta = 0;
        switch (event.type) {
          case 'DOMMouseScroll':
            // 3 lines make up a step
            delta = event.detail / 3;
            break;
          case 'mousewheel':
            // 120 units make up a step
            delta = event.wheelDelta / 120;
            break;
          case 'wheel':
            delta = event.deltaY
            switch(event.deltaMode) {
              case 0:
                // DOM_DELTA_PIXEL: 100 pixels make up a step
                delta /= 100;
                break;
              case 1:
                // DOM_DELTA_LINE: 3 lines make up a step
                delta /= 3;
                break;
              case 2:
                // DOM_DELTA_PAGE: A page makes up 80 steps
                delta *= 80;
                break;
              default:
                throw 'unrecognized mouse wheel delta mode: ' + event.deltaMode;
            }
            break;
          default:
            throw 'unrecognized mouse wheel event: ' + event.type;
        }
        return delta;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,touches:{},lastTouches:{},calculateMouseEvent:function(event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
  
          // check if SDL is available
          if (typeof SDL != "undefined") {
            Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
            Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
            // just add the mouse delta to the current absolut mouse position
            // FIXME: ideally this should be clamped against the canvas size and zero
            Browser.mouseX += Browser.mouseMovementX;
            Browser.mouseY += Browser.mouseMovementY;
          }
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
  
          // Neither .scrollX or .pageXOffset are defined in a spec, but
          // we prefer .scrollX because it is currently in a spec draft.
          // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
          var scrollX = ((typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset);
          var scrollY = ((typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset);
          // If this assert lands, it's likely because the browser doesn't support scrollX or pageXOffset
          // and we have no viable fallback.
          assert((typeof scrollX !== 'undefined') && (typeof scrollY !== 'undefined'), 'Unable to retrieve scroll position, mouse positions likely broken.');
  
          if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
            var touch = event.touch;
            if (touch === undefined) {
              return; // the "touch" property is only defined in SDL
  
            }
            var adjustedX = touch.pageX - (scrollX + rect.left);
            var adjustedY = touch.pageY - (scrollY + rect.top);
  
            adjustedX = adjustedX * (cw / rect.width);
            adjustedY = adjustedY * (ch / rect.height);
  
            var coords = { x: adjustedX, y: adjustedY };
  
            if (event.type === 'touchstart') {
              Browser.lastTouches[touch.identifier] = coords;
              Browser.touches[touch.identifier] = coords;
            } else if (event.type === 'touchend' || event.type === 'touchmove') {
              var last = Browser.touches[touch.identifier];
              if (!last) last = coords;
              Browser.lastTouches[touch.identifier] = last;
              Browser.touches[touch.identifier] = coords;
            }
            return;
          }
  
          var x = event.pageX - (scrollX + rect.left);
          var y = event.pageY - (scrollY + rect.top);
  
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
  
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },asyncLoad:function(url, onload, onerror, noRunDep) {
        var dep = !noRunDep ? getUniqueRunDependency('al ' + url) : '';
        readAsync(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (dep) removeRunDependency(dep);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (dep) addRunDependency(dep);
      },resizeListeners:[],updateResizeListeners:function() {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function(width, height, noUpdates) {
        var canvas = Module['canvas'];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullscreenCanvasSize:function() {
        // check if SDL is available
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
          HEAP32[((SDL.screen)>>2)]=flags
        }
        Browser.updateCanvasDimensions(Module['canvas']);
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function() {
        // check if SDL is available
        if (typeof SDL != "undefined") {
          var flags = HEAPU32[((SDL.screen)>>2)];
          flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
          HEAP32[((SDL.screen)>>2)]=flags
        }
        Browser.updateCanvasDimensions(Module['canvas']);
        Browser.updateResizeListeners();
      },updateCanvasDimensions:function(canvas, wNative, hNative) {
        if (wNative && hNative) {
          canvas.widthNative = wNative;
          canvas.heightNative = hNative;
        } else {
          wNative = canvas.widthNative;
          hNative = canvas.heightNative;
        }
        var w = wNative;
        var h = hNative;
        if (Module['forcedAspectRatio'] && Module['forcedAspectRatio'] > 0) {
          if (w/h < Module['forcedAspectRatio']) {
            w = Math.round(h * Module['forcedAspectRatio']);
          } else {
            h = Math.round(w / Module['forcedAspectRatio']);
          }
        }
        if (((document['fullscreenElement'] || document['mozFullScreenElement'] ||
             document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
             document['webkitCurrentFullScreenElement']) === canvas.parentNode) && (typeof screen != 'undefined')) {
           var factor = Math.min(screen.width / w, screen.height / h);
           w = Math.round(w * factor);
           h = Math.round(h * factor);
        }
        if (Browser.resizeCanvas) {
          if (canvas.width  != w) canvas.width  = w;
          if (canvas.height != h) canvas.height = h;
          if (typeof canvas.style != 'undefined') {
            canvas.style.removeProperty( "width");
            canvas.style.removeProperty("height");
          }
        } else {
          if (canvas.width  != wNative) canvas.width  = wNative;
          if (canvas.height != hNative) canvas.height = hNative;
          if (typeof canvas.style != 'undefined') {
            if (w != wNative || h != hNative) {
              canvas.style.setProperty( "width", w + "px", "important");
              canvas.style.setProperty("height", h + "px", "important");
            } else {
              canvas.style.removeProperty( "width");
              canvas.style.removeProperty("height");
            }
          }
        }
      },wgetRequests:{},nextWgetRequestHandle:0,getNextWgetRequestHandle:function() {
        var handle = Browser.nextWgetRequestHandle;
        Browser.nextWgetRequestHandle++;
        return handle;
      }};function _emscripten_set_main_loop_timing(mode, value) {
      Browser.mainLoop.timingMode = mode;
      Browser.mainLoop.timingValue = value;
  
      if (!Browser.mainLoop.func) {
        console.error('emscripten_set_main_loop_timing: Cannot set timing mode for main loop since a main loop does not exist! Call emscripten_set_main_loop first to set one up.');
        return 1; // Return non-zero on failure, can't set timing mode when there is no main loop.
      }
  
      if (mode == 0 /*EM_TIMING_SETTIMEOUT*/) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
          var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now())|0;
          setTimeout(Browser.mainLoop.runner, timeUntilNextTick); // doing this each time means that on exception, we stop
        };
        Browser.mainLoop.method = 'timeout';
      } else if (mode == 1 /*EM_TIMING_RAF*/) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
          Browser.requestAnimationFrame(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'rAF';
      } else if (mode == 2 /*EM_TIMING_SETIMMEDIATE*/) {
        if (typeof setImmediate === 'undefined') {
          // Emulate setImmediate. (note: not a complete polyfill, we don't emulate clearImmediate() to keep code size to minimum, since not needed)
          var setImmediates = [];
          var emscriptenMainLoopMessageId = 'setimmediate';
          var Browser_setImmediate_messageHandler = function(event) {
            // When called in current thread or Worker, the main loop ID is structured slightly different to accommodate for --proxy-to-worker runtime listening to Worker events,
            // so check for both cases.
            if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
              event.stopPropagation();
              setImmediates.shift()();
            }
          }
          addEventListener("message", Browser_setImmediate_messageHandler, true);
          setImmediate = function Browser_emulated_setImmediate(func) {
            setImmediates.push(func);
            if (ENVIRONMENT_IS_WORKER) {
              if (Module['setImmediates'] === undefined) Module['setImmediates'] = [];
              Module['setImmediates'].push(func);
              postMessage({target: emscriptenMainLoopMessageId}); // In --proxy-to-worker, route the message via proxyClient.js
            } else postMessage(emscriptenMainLoopMessageId, "*"); // On the main thread, can just send the message to itself.
          }
        }
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
          setImmediate(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'immediate';
      }
      return 0;
    }function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop, arg, noSetTiming) {
      noExitRuntime = true;
  
      assert(!Browser.mainLoop.func, 'emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.');
  
      Browser.mainLoop.func = func;
      Browser.mainLoop.arg = arg;
  
      var browserIterationFunc;
      if (typeof arg !== 'undefined') {
        browserIterationFunc = function() {
          Module['dynCall_vi'](func, arg);
        };
      } else {
        browserIterationFunc = function() {
          Module['dynCall_v'](func);
        };
      }
  
      var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
  
      Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return;
        if (Browser.mainLoop.queue.length > 0) {
          var start = Date.now();
          var blocker = Browser.mainLoop.queue.shift();
          blocker.func(blocker.arg);
          if (Browser.mainLoop.remainingBlockers) {
            var remaining = Browser.mainLoop.remainingBlockers;
            var next = remaining%1 == 0 ? remaining-1 : Math.floor(remaining);
            if (blocker.counted) {
              Browser.mainLoop.remainingBlockers = next;
            } else {
              // not counted, but move the progress along a tiny bit
              next = next + 0.5; // do not steal all the next one's progress
              Browser.mainLoop.remainingBlockers = (8*remaining + next)/9;
            }
          }
          console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + ' ms'); //, left: ' + Browser.mainLoop.remainingBlockers);
          Browser.mainLoop.updateStatus();
  
          // catches pause/resume main loop from blocker execution
          if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
  
          setTimeout(Browser.mainLoop.runner, 0);
          return;
        }
  
        // catch pauses from non-main loop sources
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
  
        // Implement very basic swap interval control
        Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
        if (Browser.mainLoop.timingMode == 1/*EM_TIMING_RAF*/ && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
          // Not the scheduled time to render this frame - skip.
          Browser.mainLoop.scheduler();
          return;
        } else if (Browser.mainLoop.timingMode == 0/*EM_TIMING_SETTIMEOUT*/) {
          Browser.mainLoop.tickStartTime = _emscripten_get_now();
        }
  
        // Signal GL rendering layer that processing of a new frame is about to start. This helps it optimize
        // VBO double-buffering and reduce GPU stalls.
  
  
  
        if (Browser.mainLoop.method === 'timeout' && Module.ctx) {
          warnOnce('Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!');
          Browser.mainLoop.method = ''; // just warn once per call to set main loop
        }
  
        Browser.mainLoop.runIter(browserIterationFunc);
  
        checkStackCookie();
  
        // catch pauses from the main loop itself
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
  
        // Queue new audio data. This is important to be right after the main loop invocation, so that we will immediately be able
        // to queue the newest produced audio samples.
        // TODO: Consider adding pre- and post- rAF callbacks so that GL.newRenderingFrameStarted() and SDL.audio.queueNewAudioData()
        //       do not need to be hardcoded into this function, but can be more generic.
        if (typeof SDL === 'object' && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
  
        Browser.mainLoop.scheduler();
      }
  
      if (!noSetTiming) {
        if (fps && fps > 0) _emscripten_set_main_loop_timing(0/*EM_TIMING_SETTIMEOUT*/, 1000.0 / fps);
        else _emscripten_set_main_loop_timing(1/*EM_TIMING_RAF*/, 1); // Do rAF by rendering each frame (no decimating)
  
        Browser.mainLoop.scheduler();
      }
  
      if (simulateInfiniteLoop) {
        throw 'unwind';
      }
    }

  
  
  function __fillMouseEventData(eventStruct, e, target) {
      HEAP32[((eventStruct)>>2)]=e.screenX;
      HEAP32[(((eventStruct)+(4))>>2)]=e.screenY;
      HEAP32[(((eventStruct)+(8))>>2)]=e.clientX;
      HEAP32[(((eventStruct)+(12))>>2)]=e.clientY;
      HEAP32[(((eventStruct)+(16))>>2)]=e.ctrlKey;
      HEAP32[(((eventStruct)+(20))>>2)]=e.shiftKey;
      HEAP32[(((eventStruct)+(24))>>2)]=e.altKey;
      HEAP32[(((eventStruct)+(28))>>2)]=e.metaKey;
      HEAP16[(((eventStruct)+(32))>>1)]=e.button;
      HEAP16[(((eventStruct)+(34))>>1)]=e.buttons;
      var movementX = e["movementX"]
        || (e.screenX-JSEvents.previousScreenX)
        ;
      var movementY = e["movementY"]
        || (e.screenY-JSEvents.previousScreenY)
        ;
  
      HEAP32[(((eventStruct)+(36))>>2)]=movementX;
      HEAP32[(((eventStruct)+(40))>>2)]=movementY;
  
      var rect = __specialEventTargets.indexOf(target) < 0 ? __getBoundingClientRect(target) : {'left':0,'top':0};
      HEAP32[(((eventStruct)+(44))>>2)]=e.clientX - rect.left;
      HEAP32[(((eventStruct)+(48))>>2)]=e.clientY - rect.top;
  
      // wheel and mousewheel events contain wrong screenX/screenY on chrome/opera
        // https://github.com/emscripten-core/emscripten/pull/4997
      // https://bugs.chromium.org/p/chromium/issues/detail?id=699956
      if (e.type !== 'wheel' && e.type !== 'mousewheel') {
        JSEvents.previousScreenX = e.screenX;
        JSEvents.previousScreenY = e.screenY;
      }
    }function __registerMouseEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
      if (!JSEvents.mouseEvent) JSEvents.mouseEvent = _malloc( 64 );
      target = __findEventTarget(target);
  
      var mouseEventHandlerFunc = function(ev) {
        var e = ev || event;
  
        // TODO: Make this access thread safe, or this could update live while app is reading it.
        __fillMouseEventData(JSEvents.mouseEvent, e, target);
  
        if (dynCall_iiii(callbackfunc, eventTypeId, JSEvents.mouseEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: target,
        allowsDeferredCalls: eventTypeString != 'mousemove' && eventTypeString != 'mouseenter' && eventTypeString != 'mouseleave', // Mouse move events do not allow fullscreen/pointer lock requests to be handled in them!
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: mouseEventHandlerFunc,
        useCapture: useCapture
      };
      JSEvents.registerOrRemoveHandler(eventHandler);
    }function _emscripten_set_mousedown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerMouseEventCallback(target, userData, useCapture, callbackfunc, 5, "mousedown", targetThread);
      return 0;
    }

  function _emscripten_set_mousemove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerMouseEventCallback(target, userData, useCapture, callbackfunc, 8, "mousemove", targetThread);
      return 0;
    }

  function _emscripten_set_mouseup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerMouseEventCallback(target, userData, useCapture, callbackfunc, 6, "mouseup", targetThread);
      return 0;
    }

  
  function __registerUiEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
      if (!JSEvents.uiEvent) JSEvents.uiEvent = _malloc( 36 );
  
      target = __findEventTarget(target);
  
      var uiEventHandlerFunc = function(ev) {
        var e = ev || event;
        if (e.target != target) {
          // Never take ui events such as scroll via a 'bubbled' route, but always from the direct element that
          // was targeted. Otherwise e.g. if app logs a message in response to a page scroll, the Emscripten log
          // message box could cause to scroll, generating a new (bubbled) scroll message, causing a new log print,
          // causing a new scroll, etc..
          return;
        }
        var uiEvent = JSEvents.uiEvent;
        var b = document.body; // Take document.body to a variable, Closure compiler does not outline access to it on its own.
        HEAP32[((uiEvent)>>2)]=e.detail;
        HEAP32[(((uiEvent)+(4))>>2)]=b.clientWidth;
        HEAP32[(((uiEvent)+(8))>>2)]=b.clientHeight;
        HEAP32[(((uiEvent)+(12))>>2)]=innerWidth;
        HEAP32[(((uiEvent)+(16))>>2)]=innerHeight;
        HEAP32[(((uiEvent)+(20))>>2)]=outerWidth;
        HEAP32[(((uiEvent)+(24))>>2)]=outerHeight;
        HEAP32[(((uiEvent)+(28))>>2)]=pageXOffset;
        HEAP32[(((uiEvent)+(32))>>2)]=pageYOffset;
        if (dynCall_iiii(callbackfunc, eventTypeId, uiEvent, userData)) e.preventDefault();
      };
  
      var eventHandler = {
        target: target,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: uiEventHandlerFunc,
        useCapture: useCapture
      };
      JSEvents.registerOrRemoveHandler(eventHandler);
    }function _emscripten_set_resize_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      __registerUiEventCallback(target, userData, useCapture, callbackfunc, 10, "resize", targetThread);
      return 0;
    }

  
  function __registerWheelEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
      if (!JSEvents.wheelEvent) JSEvents.wheelEvent = _malloc( 96 );
  
      // The DOM Level 3 events spec event 'wheel'
      var wheelHandlerFunc = function(ev) {
        var e = ev || event;
        var wheelEvent = JSEvents.wheelEvent;
        __fillMouseEventData(wheelEvent, e, target);
        HEAPF64[(((wheelEvent)+(64))>>3)]=e["deltaX"];
        HEAPF64[(((wheelEvent)+(72))>>3)]=e["deltaY"];
        HEAPF64[(((wheelEvent)+(80))>>3)]=e["deltaZ"];
        HEAP32[(((wheelEvent)+(88))>>2)]=e["deltaMode"];
        if (dynCall_iiii(callbackfunc, eventTypeId, wheelEvent, userData)) e.preventDefault();
      };
      // The 'mousewheel' event as implemented in Safari 6.0.5
      var mouseWheelHandlerFunc = function(ev) {
        var e = ev || event;
        __fillMouseEventData(JSEvents.wheelEvent, e, target);
        HEAPF64[(((JSEvents.wheelEvent)+(64))>>3)]=e["wheelDeltaX"] || 0;
        /* 1. Invert to unify direction with the DOM Level 3 wheel event. 2. MSIE does not provide wheelDeltaY, so wheelDelta is used as a fallback. */
        var wheelDeltaY = -(e["wheelDeltaY"] || e["wheelDelta"])
        HEAPF64[(((JSEvents.wheelEvent)+(72))>>3)]=wheelDeltaY;
        HEAPF64[(((JSEvents.wheelEvent)+(80))>>3)]=0 /* Not available */;
        HEAP32[(((JSEvents.wheelEvent)+(88))>>2)]=0 /* DOM_DELTA_PIXEL */;
        var shouldCancel = dynCall_iiii(callbackfunc, eventTypeId, JSEvents.wheelEvent, userData);
        if (shouldCancel) {
          e.preventDefault();
        }
      };
  
      var eventHandler = {
        target: target,
        allowsDeferredCalls: true,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: (eventTypeString == 'wheel') ? wheelHandlerFunc : mouseWheelHandlerFunc,
        useCapture: useCapture
      };
      JSEvents.registerOrRemoveHandler(eventHandler);
    }function _emscripten_set_wheel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
      target = __findEventTarget(target);
      if (typeof target.onwheel !== 'undefined') {
        __registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "wheel", targetThread);
        return 0;
      } else if (typeof target.onmousewheel !== 'undefined') {
        __registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "mousewheel", targetThread);
        return 0;
      } else {
        return -1;
      }
    }

  
  
  var WebGPU={initManagers:function() {
        if (this.mgrDevice) return;
  
        function makeManager() {
          return {
            objects: [undefined],
            create: function(object) {
              var id = this.objects.length;
              assert(typeof this.objects[id] === 'undefined');
              this.objects[id] = { refcount: 1, object };
              return id;
            },
            get: function(id) {
              if (id === 0) return undefined;
              var o = this.objects[id];
              assert(typeof o !== "undefined");
              return o.object;
            },
            reference: function(id) {
              var o = this.objects[id];
              assert(typeof o !== "undefined");
              o.refcount++;
            },
            release: function(id) {
              var o = this.objects[id];
              assert(typeof o !== "undefined");
              assert(o.refcount > 0);
              o.refcount--;
              if (o.refcount <= 0) {
                delete this.objects[id];
              }
            },
          };
        }
  
        this.mgrDevice = this.mgrDevice || makeManager();
        this.mgrQueue = this.mgrQueue || makeManager();
        this.mgrFence = this.mgrFence || makeManager();
  
        this.mgrCommandBuffer = this.mgrCommandBuffer || makeManager();
        this.mgrCommandEncoder = this.mgrCommandEncoder || makeManager();
        this.mgrRenderPassEncoder = this.mgrRenderPassEncoder || makeManager();
        this.mgrComputePassEncoder = this.mgrComputePassEncoder || makeManager();
        this.mgrComputePipeline = this.mgrComputePipeline || makeManager();
  
        this.mgrBindGroup = this.mgrBindGroup || makeManager();
        this.mgrBuffer = this.mgrBuffer || makeManager();
        this.mgrSampler = this.mgrSampler || makeManager();
        this.mgrTexture = this.mgrTexture || makeManager();
        this.mgrTextureView = this.mgrTextureView || makeManager();
  
        this.mgrBindGroupLayout = this.mgrBindGroupLayout || makeManager();
        this.mgrPipelineLayout = this.mgrPipelineLayout || makeManager();
        this.mgrRenderPipeline = this.mgrRenderPipeline || makeManager();
        this.mgrShaderModule = this.mgrShaderModule || makeManager();
  
        this.mgrRenderBundleEncoder = this.mgrRenderBundleEncoder || makeManager();
        this.mgrRenderBundle = this.mgrRenderBundle || makeManager();
      },trackMapWrite:function(obj, mapped) {
        var data = _malloc(mapped.byteLength);
        HEAPU8.fill(0, data, mapped.byteLength);
        obj.mapWriteSrc = data;
        obj.mapWriteDst = mapped;
      },trackUnmap:function(obj) {
        if (obj.mapWriteSrc) {
          new Uint8Array(obj.mapWriteDst).set(HEAPU8.subarray(obj.mapWriteSrc, obj.mapWriteSrc + obj.mapWriteDst.byteLength));
          _free(obj.mapWriteSrc);
        }
        obj.mapWriteSrc = undefined;
        obj.mapWriteDst = undefined;
      },makeColor:function(ptr) {
        return {
          r: HEAPF32[((ptr)>>2)],
          g: HEAPF32[(((ptr)+(4))>>2)],
          b: HEAPF32[(((ptr)+(8))>>2)],
          a: HEAPF32[(((ptr)+(12))>>2)],
        };
      },makeExtent3D:function(ptr) {
        return {
          width: HEAPU32[((ptr)>>2)],
          height: HEAPU32[(((ptr)+(4))>>2)],
          depth: HEAPU32[(((ptr)+(8))>>2)],
        };
      },makeOrigin3D:function(ptr) {
        return {
          x: HEAPU32[((ptr)>>2)],
          y: HEAPU32[(((ptr)+(4))>>2)],
          z: HEAPU32[(((ptr)+(8))>>2)],
        };
      },makeTextureCopyView:function(ptr) {
        assert(ptr !== 0);assert(HEAP32[((ptr)>>2)] === 0);
        return {
          texture: this.mgrTexture.get(
            HEAP32[(((ptr)+(4))>>2)]),
          mipLevel: HEAPU32[(((ptr)+(8))>>2)],
          arrayLayer: HEAPU32[(((ptr)+(12))>>2)],
          origin: WebGPU.makeOrigin3D(ptr + 16),
        };
      },makeBufferCopyView:function(ptr) {
        assert(ptr !== 0);assert(HEAP32[((ptr)>>2)] === 0);
        return {
          buffer: this.mgrBuffer.get(
            HEAP32[(((ptr)+(4))>>2)]),
          offset: HEAPU32[((((ptr + 4))+(8))>>2)] * 0x100000000 + HEAPU32[(((ptr)+(8))>>2)],
          rowPitch: HEAPU32[(((ptr)+(16))>>2)],
          imageHeight: HEAPU32[(((ptr)+(20))>>2)],
        };
      },AddressMode:["repeat","mirror-repeat","clamp-to-edge"],BindingType:["uniform-buffer","storage-buffer","readonly-storage-buffer","sampler","sampled-texture","storage-texture"],BlendFactor:["zero","one","src-color","one-minus-src-color","src-alpha","one-minus-src-alpha","dst-color","one-minus-dst-color","dst-alpha","one-minus-dst-alpha","src-alpha-saturated","blend-color","one-minus-blend-color"],BlendOperation:["add","subtract","reverse-subtract","min","max"],BufferMapAsyncStatus:["success","error","unknown","device-lost"],CompareFunction:["never","less","less-equal","greater","greater-equal","equal","not-equal","always"],CullMode:["none","front","back"],ErrorFilter:["none","validation","out-of-memory"],ErrorType:["no-error","validation","out-of-memory","unknown","device-lost"],FenceCompletionStatus:["success","error","unknown","device-lost"],FilterMode:["nearest","linear"],FrontFace:["ccw","cw"],IndexFormat:["uint16","uint32"],InputStepMode:["vertex","instance"],LoadOp:["clear","load"],PrimitiveTopology:["point-list","line-list","line-strip","triangle-list","triangle-strip"],StencilOperation:["keep","zero","replace","invert","increment-clamp","decrement-clamp","increment-wrap","decrement-wrap"],StoreOp:["store","clear"],TextureAspect:["all","stencil-only","depth-only"],TextureComponentType:["float","sint","uint"],TextureDimension:["1d","2d","3d"],TextureFormat:[,"r8unorm","r8snorm","r8uint","r8sint","r16uint","r16sint","r16float","rg8unorm","rg8snorm","rg8uint","rg8sint","r32float","r32uint","r32sint","rg16uint","rg16sint","rg16float","rgba8unorm","rgba8unorm-srgb","rgba8snorm","rgba8uint","rgba8sint","bgra8unorm","bgra8unorm-srgb","rgb10a2unorm","rg11b10float","rg32float","rg32uint","rg32sint","rgba16uint","rgba16sint","rgba16float","rgba32float","rgba32uint","rgba32sint","depth32float","depth24plus","depth24plus-stencil8","bc1rgbaunorm","bc1rgbaunorm-srgb","bc2rgbaunorm","bc2rgbaunorm-srgb","bc3rgbaunorm","bc3rgbaunorm-srgb","bc4runorm","bc4rsnorm","bc5rgunorm","bc5rgsnorm","bc6hrgbufloat","bc6hrgbsfloat","bc7rgbaunorm","bc7rgbaunorm-srgb"],TextureViewDimension:[,"1d","2d","2darray","cube","cube-array","3d"],VertexFormat:["uchar2","uchar4","char2","char4","uchar2norm","uchar4norm","char2norm","char4norm","ushort2","ushort4","short2","short4","ushort2norm","ushort4norm","short2norm","short4norm","half2","half4","float","float2","float3","float4","uint","uint2","uint3","uint4","int","int2","int3","int4"]};function _emscripten_webgpu_do_get_current_texture_view() {
      var swapchain = Module['preinitializedWebGPUSwapChain'];
      assert(swapchain);
      WebGPU.initManagers();
      return WebGPU.mgrTextureView.create(swapchain.getCurrentTextureView());
    }function _emscripten_webgpu_get_current_texture_view(
  ) {
  return _emscripten_webgpu_do_get_current_texture_view();
  }

  
  function _emscripten_webgpu_do_get_device() {
      // TODO(kainino0x): make it possible to actually create devices
      assert(Module['preinitializedWebGPUDevice']);
      WebGPU.initManagers();
      return WebGPU.mgrDevice.create(Module['preinitializedWebGPUDevice']);
    }function _emscripten_webgpu_get_device(
  ) {
  return _emscripten_webgpu_do_get_device();
  }

  
  
  var ENV={};function _emscripten_get_environ() {
      if (!_emscripten_get_environ.strings) {
        // Default values.
        var env = {
          'USER': 'web_user',
          'LOGNAME': 'web_user',
          'PATH': '/',
          'PWD': '/',
          'HOME': '/home/web_user',
          // Browser language detection #8751
          'LANG': ((typeof navigator === 'object' && navigator.languages && navigator.languages[0]) || 'C').replace('-', '_') + '.UTF-8',
          '_': thisProgram
        };
        // Apply the user-provided values, if any.
        for (var x in ENV) {
          env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(x + '=' + env[x]);
        }
        _emscripten_get_environ.strings = strings;
      }
      return _emscripten_get_environ.strings;
    }function _environ_get(__environ, environ_buf) {
      var strings = _emscripten_get_environ();
      var bufSize = 0;
      strings.forEach(function(string, i) {
        var ptr = environ_buf + bufSize;
        HEAP32[(((__environ)+(i * 4))>>2)]=ptr;
        writeAsciiToMemory(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    }

  function _environ_sizes_get(penviron_count, penviron_buf_size) {
      var strings = _emscripten_get_environ();
      HEAP32[((penviron_count)>>2)]=strings.length;
      var bufSize = 0;
      strings.forEach(function(string) {
        bufSize += string.length + 1;
      });
      HEAP32[((penviron_buf_size)>>2)]=bufSize;
      return 0;
    }

  function _fd_close(fd) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.close(stream);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  function _fd_read(fd, iov, iovcnt, pnum) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = SYSCALLS.doReadv(stream, iov, iovcnt);
      HEAP32[((pnum)>>2)]=num
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var HIGH_OFFSET = 0x100000000; // 2^32
      // use an unsigned operator on low and shift high by 32-bits
      var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
  
      var DOUBLE_LIMIT = 0x20000000000000; // 2^53
      // we also check for equality since DOUBLE_LIMIT + 1 == DOUBLE_LIMIT
      if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
        return -61;
      }
  
      FS.llseek(stream, offset, whence);
      (tempI64 = [stream.position>>>0,(tempDouble=stream.position,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((newOffset)>>2)]=tempI64[0],HEAP32[(((newOffset)+(4))>>2)]=tempI64[1]);
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  function _fd_write(fd, iov, iovcnt, pnum) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = SYSCALLS.doWritev(stream, iov, iovcnt);
      HEAP32[((pnum)>>2)]=num
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  
  function _memcpy(dest, src, num) {
      dest = dest|0; src = src|0; num = num|0;
      var ret = 0;
      var aligned_dest_end = 0;
      var block_aligned_dest_end = 0;
      var dest_end = 0;
      // Test against a benchmarked cutoff limit for when HEAPU8.set() becomes faster to use.
      if ((num|0) >= 8192) {
        _emscripten_memcpy_big(dest|0, src|0, num|0)|0;
        return dest|0;
      }
  
      ret = dest|0;
      dest_end = (dest + num)|0;
      if ((dest&3) == (src&3)) {
        // The initial unaligned < 4-byte front.
        while (dest & 3) {
          if ((num|0) == 0) return ret|0;
          HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
          dest = (dest+1)|0;
          src = (src+1)|0;
          num = (num-1)|0;
        }
        aligned_dest_end = (dest_end & -4)|0;
        block_aligned_dest_end = (aligned_dest_end - 64)|0;
        while ((dest|0) <= (block_aligned_dest_end|0) ) {
          HEAP32[((dest)>>2)]=((HEAP32[((src)>>2)])|0);
          HEAP32[(((dest)+(4))>>2)]=((HEAP32[(((src)+(4))>>2)])|0);
          HEAP32[(((dest)+(8))>>2)]=((HEAP32[(((src)+(8))>>2)])|0);
          HEAP32[(((dest)+(12))>>2)]=((HEAP32[(((src)+(12))>>2)])|0);
          HEAP32[(((dest)+(16))>>2)]=((HEAP32[(((src)+(16))>>2)])|0);
          HEAP32[(((dest)+(20))>>2)]=((HEAP32[(((src)+(20))>>2)])|0);
          HEAP32[(((dest)+(24))>>2)]=((HEAP32[(((src)+(24))>>2)])|0);
          HEAP32[(((dest)+(28))>>2)]=((HEAP32[(((src)+(28))>>2)])|0);
          HEAP32[(((dest)+(32))>>2)]=((HEAP32[(((src)+(32))>>2)])|0);
          HEAP32[(((dest)+(36))>>2)]=((HEAP32[(((src)+(36))>>2)])|0);
          HEAP32[(((dest)+(40))>>2)]=((HEAP32[(((src)+(40))>>2)])|0);
          HEAP32[(((dest)+(44))>>2)]=((HEAP32[(((src)+(44))>>2)])|0);
          HEAP32[(((dest)+(48))>>2)]=((HEAP32[(((src)+(48))>>2)])|0);
          HEAP32[(((dest)+(52))>>2)]=((HEAP32[(((src)+(52))>>2)])|0);
          HEAP32[(((dest)+(56))>>2)]=((HEAP32[(((src)+(56))>>2)])|0);
          HEAP32[(((dest)+(60))>>2)]=((HEAP32[(((src)+(60))>>2)])|0);
          dest = (dest+64)|0;
          src = (src+64)|0;
        }
        while ((dest|0) < (aligned_dest_end|0) ) {
          HEAP32[((dest)>>2)]=((HEAP32[((src)>>2)])|0);
          dest = (dest+4)|0;
          src = (src+4)|0;
        }
      } else {
        // In the unaligned copy case, unroll a bit as well.
        aligned_dest_end = (dest_end - 4)|0;
        while ((dest|0) < (aligned_dest_end|0) ) {
          HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
          HEAP8[(((dest)+(1))>>0)]=((HEAP8[(((src)+(1))>>0)])|0);
          HEAP8[(((dest)+(2))>>0)]=((HEAP8[(((src)+(2))>>0)])|0);
          HEAP8[(((dest)+(3))>>0)]=((HEAP8[(((src)+(3))>>0)])|0);
          dest = (dest+4)|0;
          src = (src+4)|0;
        }
      }
      // The remaining unaligned < 4 byte tail.
      while ((dest|0) < (dest_end|0)) {
        HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
        dest = (dest+1)|0;
        src = (src+1)|0;
      }
      return ret|0;
    }

  function _memset(ptr, value, num) {
      ptr = ptr|0; value = value|0; num = num|0;
      var end = 0, aligned_end = 0, block_aligned_end = 0, value4 = 0;
      end = (ptr + num)|0;
  
      value = value & 0xff;
      if ((num|0) >= 67 /* 64 bytes for an unrolled loop + 3 bytes for unaligned head*/) {
        while ((ptr&3) != 0) {
          HEAP8[((ptr)>>0)]=value;
          ptr = (ptr+1)|0;
        }
  
        aligned_end = (end & -4)|0;
        value4 = value | (value << 8) | (value << 16) | (value << 24);
  
        block_aligned_end = (aligned_end - 64)|0;
  
        while((ptr|0) <= (block_aligned_end|0)) {
          HEAP32[((ptr)>>2)]=value4;
          HEAP32[(((ptr)+(4))>>2)]=value4;
          HEAP32[(((ptr)+(8))>>2)]=value4;
          HEAP32[(((ptr)+(12))>>2)]=value4;
          HEAP32[(((ptr)+(16))>>2)]=value4;
          HEAP32[(((ptr)+(20))>>2)]=value4;
          HEAP32[(((ptr)+(24))>>2)]=value4;
          HEAP32[(((ptr)+(28))>>2)]=value4;
          HEAP32[(((ptr)+(32))>>2)]=value4;
          HEAP32[(((ptr)+(36))>>2)]=value4;
          HEAP32[(((ptr)+(40))>>2)]=value4;
          HEAP32[(((ptr)+(44))>>2)]=value4;
          HEAP32[(((ptr)+(48))>>2)]=value4;
          HEAP32[(((ptr)+(52))>>2)]=value4;
          HEAP32[(((ptr)+(56))>>2)]=value4;
          HEAP32[(((ptr)+(60))>>2)]=value4;
          ptr = (ptr + 64)|0;
        }
  
        while ((ptr|0) < (aligned_end|0) ) {
          HEAP32[((ptr)>>2)]=value4;
          ptr = (ptr+4)|0;
        }
      }
      // The remaining bytes.
      while ((ptr|0) < (end|0)) {
        HEAP8[((ptr)>>0)]=value;
        ptr = (ptr+1)|0;
      }
      return (end-num)|0;
    }

  function _setTempRet0($i) {
      setTempRet0(($i) | 0);
    }

  function _system(command) {
      // int system(const char *command);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/system.html
      // Can't call external programs.
      ___setErrNo(6);
      return -1;
    }

  function _time(ptr) {
      var ret = (Date.now()/1000)|0;
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret;
      }
      return ret;
    }

  function _wgpuBindGroupLayoutReference(id) {
    WebGPU.mgrBindGroupLayout.reference(id);
  }

  function _wgpuBindGroupLayoutRelease(id) {
    WebGPU.mgrBindGroupLayout.release(id);
  }

  function _wgpuBindGroupRelease(id) {
    WebGPU.mgrBindGroup.release(id);
  }

  function _wgpuBufferDestroy(bufferId) { WebGPU.mgrBuffer.get(bufferId).destroy(); }

  function _wgpuBufferReference(id) {
    WebGPU.mgrBuffer.reference(id);
  }

  function _wgpuBufferRelease(id) {
    WebGPU.mgrBuffer.release(id);
  }

  function _wgpuBufferSetSubData(bufferId, start_l, start_h, count_l, count_h, data) {
      var buffer = WebGPU.mgrBuffer.get(bufferId);
      var start = (assert(start_h < 0x200000), start_h * 0x100000000 + start_l)
  ;
      var count = (assert(count_h < 0x200000), count_h * 0x100000000 + count_l)
  ;
      buffer.setSubData(start, HEAPU8, data, count);
    }

  function _wgpuCommandBufferRelease(id) {
    WebGPU.mgrCommandBuffer.release(id);
  }

  function _wgpuCommandEncoderBeginComputePass(encoderId, descriptor) {
      assert(descriptor !== 0);
  
      function makeComputePassDescriptor(descriptor) {
        return {
          label: UTF8ToString(HEAPU32[(((descriptor)+(4))>>2)])
        };
      }
  
      var desc = makeComputePassDescriptor(descriptor);
  
      var commandEncoder = WebGPU.mgrCommandEncoder.get(encoderId);
      return WebGPU.mgrComputePassEncoder.create(commandEncoder.beginComputePass(desc));
    }

  function _wgpuCommandEncoderBeginRenderPass(encoderId, descriptor) {
      assert(descriptor !== 0);
  
      function makeColorAttachment(caPtr) {
        let loadValue =  WebGPU.LoadOp[
            HEAPU32[(((caPtr)+(8))>>2)]];
        if (loadValue === 'clear') {
          loadValue = WebGPU.makeColor(caPtr + 16);
        }
  
        return {
          attachment: WebGPU.mgrTextureView.get(
            HEAPU32[((caPtr)>>2)]),
          resolveTarget: WebGPU.mgrTextureView.get(
            HEAPU32[(((caPtr)+(4))>>2)]),
          storeOp: WebGPU.StoreOp[
            HEAPU32[(((caPtr)+(12))>>2)]],
          loadValue,
        };
      }
  
      function makeColorAttachments(count, caPtr) {
        var attachments = [];
        for (var i = 0; i < count; ++i) {
          attachments.push(makeColorAttachment(caPtr + 32 * i));
        }
        return attachments;
      }
  
      function makeDepthStencilAttachment(dsaPtr) {
        if (dsaPtr === 0) return undefined;
  
        let depthLoadValue = WebGPU.LoadOp[
            HEAPU32[(((dsaPtr)+(4))>>2)]];
        if (depthLoadValue === 'clear') {
          depthLoadValue = HEAPF32[(((dsaPtr)+(12))>>2)];
        }
  
        let stencilLoadValue = WebGPU.LoadOp[
            HEAPU32[(((dsaPtr)+(16))>>2)]];
        if (stencilLoadValue === 'clear') {
          stencilLoadValue = HEAPU32[(((dsaPtr)+(24))>>2)];
        }
  
        return {
          attachment: WebGPU.mgrTextureView.get(
            HEAPU32[((dsaPtr)>>2)]),
          depthStoreOp: WebGPU.StoreOp[
            HEAPU32[(((dsaPtr)+(8))>>2)]],
          depthLoadValue,
          stencilStoreOp: WebGPU.StoreOp[
            HEAPU32[(((dsaPtr)+(20))>>2)]],
          stencilLoadValue,
        };
      }
  
      function makeRenderPassDescriptor(descriptor) {
        // required sequence<GPURenderPassColorAttachmentDescriptor> colorAttachments;
        // GPURenderPassDepthStencilAttachmentDescriptor depthStencilAttachment;
        return {
          colorAttachments: makeColorAttachments(
            HEAPU32[(((descriptor)+(8))>>2)],
            HEAP32[(((descriptor)+(12))>>2)]),
          depthStencilAttachment: makeDepthStencilAttachment(
            HEAP32[(((descriptor)+(16))>>2)]),
        };
      }
  
      var desc = makeRenderPassDescriptor(descriptor);
  
      var commandEncoder = WebGPU.mgrCommandEncoder.get(encoderId);
      return WebGPU.mgrRenderPassEncoder.create(commandEncoder.beginRenderPass(desc));
    }

  function _wgpuCommandEncoderCopyBufferToBuffer(encoderId, srcId, srcOffset_l, srcOffset_h, dstId, dstOffset_l, dstOffset_h, size_l, size_h) {
      var commandEncoder = WebGPU.mgrCommandEncoder.get(encoderId);
      var src = WebGPU.mgrBuffer.get(srcId);
      var dst = WebGPU.mgrBuffer.get(dstId);
      commandEncoder.copyBufferToBuffer(
        src, (assert(srcOffset_h < 0x200000), srcOffset_h * 0x100000000 + srcOffset_l)
  ,
        dst, (assert(dstOffset_h < 0x200000), dstOffset_h * 0x100000000 + dstOffset_l)
  ,
        (assert(size_h < 0x200000), size_h * 0x100000000 + size_l)
  );
    }

  function _wgpuCommandEncoderCopyBufferToTexture(encoderId, srcPtr, dstPtr, copySizePtr) {
      var commandEncoder = WebGPU.mgrCommandEncoder.get(encoderId);
      var copySize = WebGPU.makeExtent3D(copySizePtr);
      commandEncoder.copyBufferToTexture(
        WebGPU.makeBufferCopyView(srcPtr), WebGPU.makeTextureCopyView(dstPtr), copySize);
    }

  function _wgpuCommandEncoderCopyTextureToTexture(encoderId, srcPtr, dstPtr, copySizePtr) {
      var commandEncoder = WebGPU.mgrCommandEncoder.get(encoderId);
      var src = WebGPU.makeTextureCopyView(srcPtr);
      var dst = WebGPU.makeTextureCopyView(dstPtr);
      var copySize = WebGPU.makeExtent3D(copySizePtr);
      commandEncoder.copyTextureToTexture(src, dst, copySize);
    }

  function _wgpuCommandEncoderFinish(encoderId) {
      var commandEncoder = WebGPU.mgrCommandEncoder.get(encoderId);
      return WebGPU.mgrCommandBuffer.create(commandEncoder.finish());
    }

  function _wgpuCommandEncoderRelease(id) {
    WebGPU.mgrCommandEncoder.release(id);
  }

  function _wgpuComputePassEncoderDispatch(passId, x, y, z) {
      var pass = WebGPU.mgrComputePassEncoder.get(passId);
      pass.dispatch(x, y, z);
    }

  function _wgpuComputePassEncoderEndPass(passId) {
      var pass = WebGPU.mgrComputePassEncoder.get(passId);
      pass.endPass();
    }

  function _wgpuComputePassEncoderPopDebugGroup(passId) {
      var pass = WebGPU.mgrComputePassEncoder.get(passId);
      pass.popDebugGroup();
    }

  function _wgpuComputePassEncoderPushDebugGroup(passId, groupLabel) {
      var pass = WebGPU.mgrComputePassEncoder.get(passId);
      pass.pushDebugGroup(UTF8ToString(groupLabel));
    }

  function _wgpuComputePassEncoderRelease(id) {
    WebGPU.mgrComputePassEncoder.release(id);
  }

  function _wgpuComputePassEncoderSetBindGroup(passId, groupIndex, group, dynamicOffsetCount, dynamicOffsets) {
      var pass = WebGPU.mgrComputePassEncoder.get(passId);
      pass.setBindGroup();
    }

  function _wgpuComputePassEncoderSetPipeline(passId, pipeline) {
      var pass = WebGPU.mgrComputePassEncoder.get(passId);
      pass.setPipeline(pipeline);
    }

  function _wgpuComputePipelineRelease(id) {
    WebGPU.mgrComputePipeline.release(id);
  }

  function _wgpuDeviceCreateBindGroup(deviceId, descriptor) {
      assert(descriptor !== 0);assert(HEAP32[((descriptor)>>2)] === 0);
  
      function makeBinding(bindingPtr) {
        assert(bindingPtr !== 0);
  
        var bufferId = HEAPU32[(((bindingPtr)+(4))>>2)];
        var samplerId = HEAPU32[(((bindingPtr)+(24))>>2)];
        var textureViewId = HEAPU32[(((bindingPtr)+(28))>>2)];
        assert((bufferId != 0) + (samplerId != 0) + (textureViewId != 0) == 1);
  
        var binding = HEAPU32[((bindingPtr)>>2)];
  
        if (bufferId != 0) {
          var size = undefined;
  
          // Handle WGPU_WHOLE_SIZE.
          var sizePart1 = HEAPU32[(((bindingPtr)+(16))>>2)];
          var sizePart2 = HEAPU32[(((bindingPtr)+(20))>>2)];
          if (sizePart1 != 0xFFFFFFFF || sizePart2 != 0xFFFFFFFF) {
            size = HEAPU32[((((bindingPtr + 4))+(16))>>2)] * 0x100000000 + HEAPU32[(((bindingPtr)+(16))>>2)];
          }
  
          return {
            binding,
            resource: {
              buffer: WebGPU.mgrBuffer.get(bufferId),
              offset: HEAPU32[((((bindingPtr + 4))+(8))>>2)] * 0x100000000 + HEAPU32[(((bindingPtr)+(8))>>2)],
              size: size,
            },
          };
        } else if (samplerId != 0) {
          return {
            binding,
            resource: WebGPU.mgrSampler.get(samplerId),
          };
        } else {
          return {
            binding,
            resource: WebGPU.mgrTextureView.get(textureViewId),
          };
        }
      }
  
      function makeBindings(count, bindingsPtrs) {
        var bindings = [];
        for (var i = 0; i < count; ++i) {
          bindings.push(makeBinding(bindingsPtrs +
              32 * i));
        }
        return bindings;
      }
  
      var desc = {
        layout: WebGPU.mgrBindGroupLayout.get(
          HEAP32[(((descriptor)+(8))>>2)]),
        bindings: makeBindings(
          HEAPU32[(((descriptor)+(12))>>2)],
          HEAP32[(((descriptor)+(16))>>2)],
        ),
      };
  
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrBindGroup.create(device.createBindGroup(desc));
    }

  function _wgpuDeviceCreateBindGroupLayout(deviceId, descriptor) {
      assert(descriptor !== 0);assert(HEAP32[((descriptor)>>2)] === 0);
  
      function makeBinding(bindingPtr) {
        assert(bindingPtr !== 0);
  
        return {
          binding:
            HEAPU32[((bindingPtr)>>2)],
          visibility:
            HEAPU32[(((bindingPtr)+(4))>>2)],
          type: WebGPU.BindingType[
            HEAPU32[(((bindingPtr)+(8))>>2)]],
          textureDimension: WebGPU.TextureViewDimension[
            HEAPU32[(((bindingPtr)+(16))>>2)]],
          textureComponentType: WebGPU.TextureComponentType[
            HEAPU32[(((bindingPtr)+(20))>>2)]],
          multisampled:
            (HEAP8[(((bindingPtr)+(13))>>0)] !== 0),
          hasDynamicOffset:
            (HEAP8[(((bindingPtr)+(12))>>0)] !== 0),
        };
      }
  
      function makeBindings(count, bindingsPtrs) {
        var bindings = [];
        for (var i = 0; i < count; ++i) {
          bindings.push(makeBinding(bindingsPtrs +
              24 * i));
        }
        return bindings;
      }
  
      var desc = {
        bindings: makeBindings(
          HEAPU32[(((descriptor)+(8))>>2)],
          HEAP32[(((descriptor)+(12))>>2)],
        ),
      };
  
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrBindGroupLayout.create(device.createBindGroupLayout(desc));
    }

  function _wgpuDeviceCreateBuffer(deviceId, descriptor) {
      assert(descriptor !== 0);assert(HEAP32[((descriptor)>>2)] === 0);
      var desc = {
        usage: HEAPU32[(((descriptor)+(8))>>2)],
        size: HEAPU32[((((descriptor + 4))+(16))>>2)] * 0x100000000 + HEAPU32[(((descriptor)+(16))>>2)],
      };
  
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrBuffer.create(device.createBuffer(desc));
    }

  function _wgpuDeviceCreateCommandEncoder(deviceId, descriptor) {
      if (descriptor) {
        assert(descriptor !== 0);assert(HEAP32[((descriptor)>>2)] === 0);
      }
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrCommandEncoder.create(device.createCommandEncoder());
    }

  function _wgpuDeviceCreateComputePipeline(deviceId, descriptor) {
    }

  function _wgpuDeviceCreatePipelineLayout(deviceId, descriptor) {
      assert(descriptor !== 0);assert(HEAP32[((descriptor)>>2)] === 0);
      var bglCount = HEAPU32[(((descriptor)+(8))>>2)];
      var bglPtr = HEAP32[(((descriptor)+(12))>>2)];
      var bgls = [];
      for (var i = 0; i < bglCount; ++i) {
        bgls.push(WebGPU.mgrBindGroupLayout.get(
          HEAP32[(((bglPtr)+(4 * i))>>2)]));
      }
      var desc = { bindGroupLayouts: bgls };
  
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrPipelineLayout.create(device.createPipelineLayout(desc));
    }

  function _wgpuDeviceCreateQueue(deviceId) {
      assert(WebGPU.mgrQueue.objects.length === 1, 'there is only one queue');
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrQueue.create(device.defaultQueue);
    }

  function _wgpuDeviceCreateRenderPipeline(deviceId, descriptor) {
      assert(descriptor !== 0);assert(HEAP32[((descriptor)>>2)] === 0);
  
      function makeStage(ptr) {
        if (ptr === 0) return undefined;
        assert(ptr !== 0);assert(HEAP32[((ptr)>>2)] === 0);
        return {
          module: WebGPU.mgrShaderModule.get(
            HEAP32[(((ptr)+(4))>>2)]),
          entryPoint: UTF8ToString(
            HEAP32[(((ptr)+(8))>>2)]),
        };
      }
  
      function makeRasterizationState(rsPtr) {
        if (rsPtr === 0) return undefined;
        assert(rsPtr !== 0);assert(HEAP32[((rsPtr)>>2)] === 0);
        return {
          frontFace: WebGPU.FrontFace[
            HEAPU32[(((rsPtr)+(4))>>2)]],
          cullMode: WebGPU.CullMode[
            HEAPU32[(((rsPtr)+(8))>>2)]],
        };
      }
  
      function makeBlendDescriptor(bdPtr) {
        if (bdPtr === 0) return undefined;
        return {
          operation: WebGPU.BlendOperation[
            HEAPU32[((bdPtr)>>2)]],
          srcFactor: WebGPU.BlendFactor[
            HEAPU32[(((bdPtr)+(4))>>2)]],
          dstFactor: WebGPU.BlendFactor[
            HEAPU32[(((bdPtr)+(8))>>2)]],
        };
      }
  
      function makeColorState(csPtr) {
        assert(csPtr !== 0);assert(HEAP32[((csPtr)>>2)] === 0);
        return {
          format: WebGPU.TextureFormat[
            HEAPU32[(((csPtr)+(4))>>2)]],
          alphaBlend: makeBlendDescriptor(csPtr + 8),
          colorBlend: makeBlendDescriptor(csPtr + 20),
          writeMask: HEAPU32[(((csPtr)+(32))>>2)],
        };
      }
  
      function makeColorStates(count, csPtr) {
        if (count === 0) return undefined;
  
        var states = [];
        for (var i = 0; i < count; ++i) {
          states.push(makeColorState(csPtr + 36 * i));
        }
        return states;
      }
  
      function makeStencilStateFace(ssfPtr) {
        assert(ssfPtr !== 0);
        return {
          compare: WebGPU.CompareFunction[
            HEAPU32[((ssfPtr)>>2)]],
          failOp: WebGPU.StencilOperation[
            HEAPU32[(((ssfPtr)+(4))>>2)]],
          depthFailOp: WebGPU.StencilOperation[
            HEAPU32[(((ssfPtr)+(8))>>2)]],
          passOp: WebGPU.StencilOperation[
            HEAPU32[(((ssfPtr)+(12))>>2)]],
        };
      }
  
      function makeDepthStencilState(dssPtr) {
        if (dssPtr === 0) return undefined;
  
        assert(dssPtr !== 0);
        return {
          format: WebGPU.TextureFormat[
            HEAPU32[(((dssPtr)+(4))>>2)]],
          depthWriteEnabled: (HEAP8[(((dssPtr)+(8))>>0)] !== 0),
          depthCompare: WebGPU.CompareFunction[
            HEAPU32[(((dssPtr)+(12))>>2)]],
          stencilFront: makeStencilStateFace(dssPtr + 16),
          stencilBack: makeStencilStateFace(dssPtr + 32),
          stencilReadMask: HEAPU32[(((dssPtr)+(48))>>2)],
          stencilWriteMask: HEAPU32[(((dssPtr)+(52))>>2)],
        };
      }
  
      function makeVertexAttribute(vaPtr) {
        assert(vaPtr !== 0);
        return {
          offset: HEAPU32[((((vaPtr + 4))+(8))>>2)] * 0x100000000 + HEAPU32[(((vaPtr)+(8))>>2)],
          format: WebGPU.VertexFormat[
            HEAPU32[((vaPtr)>>2)]],
          shaderLocation: HEAPU32[(((vaPtr)+(16))>>2)],
        };
      }
  
      function makeVertexAttributes(count, vaArrayPtr) {
        var vas = [];
        for (var i = 0; i < count; ++i) {
          vas.push(makeVertexAttribute(vaArrayPtr + i * 24));
        }
        return vas;
      }
  
      function makeVertexBuffer(vbPtr) {
        if (vbPtr === 0) return undefined;
  
        return {
          arrayStride: HEAPU32[(((vbPtr + 4))>>2)] * 0x100000000 + HEAPU32[((vbPtr)>>2)],
          stepMode: WebGPU.InputStepMode[
            HEAPU32[(((vbPtr)+(8))>>2)]],
          // TODO(kainino0x): Update naming once WGPU matches WebGPU.
          attributes: makeVertexAttributes(
            HEAPU32[(((vbPtr)+(12))>>2)],
            HEAP32[(((vbPtr)+(16))>>2)]),
        };
      }
  
      function makeVertexBuffers(count, vbArrayPtr) {
        if (count === 0) return undefined;
  
        var vbs = [];
        for (var i = 0; i < count; ++i) {
          vbs.push(makeVertexBuffer(vbArrayPtr + i * 24));
        }
        return vbs;
      }
  
      function makeVertexInput(viPtr) {
        if (viPtr === 0) return undefined;
        assert(viPtr !== 0);assert(HEAP32[((viPtr)>>2)] === 0);
        return {
          indexFormat: WebGPU.IndexFormat[
            HEAPU32[(((viPtr)+(4))>>2)]],
          vertexBuffers: makeVertexBuffers(
            HEAPU32[(((viPtr)+(8))>>2)],
            HEAP32[(((viPtr)+(12))>>2)]),
        };
      }
  
      var desc = {
        layout: WebGPU.mgrPipelineLayout.get(
          HEAP32[(((descriptor)+(8))>>2)]),
        vertexStage: makeStage(
          descriptor + 12),
        fragmentStage: makeStage(
          HEAP32[(((descriptor)+(24))>>2)]),
        primitiveTopology: WebGPU.PrimitiveTopology[
          HEAPU32[(((descriptor)+(32))>>2)]],
        rasterizationState: makeRasterizationState(
          HEAP32[(((descriptor)+(36))>>2)]),
        colorStates: makeColorStates(
          HEAPU32[(((descriptor)+(48))>>2)],
          HEAP32[(((descriptor)+(52))>>2)]),
        depthStencilState: makeDepthStencilState(
          HEAP32[(((descriptor)+(44))>>2)]),
        vertexState: makeVertexInput(
          HEAP32[(((descriptor)+(28))>>2)]),
        sampleCount: HEAPU32[(((descriptor)+(40))>>2)],
        sampleMask: HEAPU32[(((descriptor)+(56))>>2)],
        alphaToCoverageEnabled: (HEAP8[(((descriptor)+(60))>>0)] !== 0),
      };
  
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrRenderPipeline.create(device.createRenderPipeline(desc));
    }

  function _wgpuDeviceCreateSampler(deviceId, descriptor) {
      assert(descriptor !== 0);assert(HEAP32[((descriptor)>>2)] === 0);
  
      var desc = {
        addressModeU: WebGPU.AddressMode[
            HEAPU32[(((descriptor)+(8))>>2)]],
        addressModeV: WebGPU.AddressMode[
            HEAPU32[(((descriptor)+(12))>>2)]],
        addressModeW: WebGPU.AddressMode[
            HEAPU32[(((descriptor)+(16))>>2)]],
        magFilter: WebGPU.FilterMode[
            HEAPU32[(((descriptor)+(20))>>2)]],
        minFilter: WebGPU.FilterMode[
            HEAPU32[(((descriptor)+(24))>>2)]],
        mipmapFilter: WebGPU.FilterMode[
            HEAPU32[(((descriptor)+(28))>>2)]],
        lodMinClamp: HEAPF32[(((descriptor)+(32))>>2)],
        lodMaxClamp: HEAPF32[(((descriptor)+(36))>>2)],
        compare: WebGPU.CompareFunction[
            HEAPU32[(((descriptor)+(40))>>2)]],
      };
  
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrSampler.create(device.createSampler(desc));
    }

  function _wgpuDeviceCreateShaderModule(deviceId, descriptor) {
      assert(descriptor !== 0);assert(HEAP32[((descriptor)>>2)] === 0);
      var count = HEAPU32[(((descriptor)+(8))>>2)];
      var start = HEAP32[(((descriptor)+(12))>>2)];
      var desc = { code: HEAPU32.subarray(start >> 2, (start >> 2) + count) };
  
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrShaderModule.create(device.createShaderModule(desc));
    }

  function _wgpuDeviceCreateTexture(deviceId, descriptor) {
      assert(descriptor !== 0);assert(HEAP32[((descriptor)>>2)] === 0);
  
      var desc = {
        size: WebGPU.makeExtent3D(descriptor + 16),
        arrayLayerCount: HEAPU32[(((descriptor)+(28))>>2)],
        mipLevelCount: HEAPU32[(((descriptor)+(36))>>2)],
        sampleCount: HEAPU32[(((descriptor)+(40))>>2)],
        dimension: WebGPU.TextureDimension[
          HEAPU32[(((descriptor)+(12))>>2)]],
        format: WebGPU.TextureFormat[
          HEAPU32[(((descriptor)+(32))>>2)]],
        usage: HEAPU32[(((descriptor)+(8))>>2)],
      };
  
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrTexture.create(device.createTexture(desc));
    }

  function _wgpuDeviceReference(id) {
    WebGPU.mgrDevice.reference(id);
  }

  function _wgpuDeviceRelease(id) {
    WebGPU.mgrDevice.release(id);
  }

  function _wgpuPipelineLayoutRelease(id) {
    WebGPU.mgrPipelineLayout.release(id);
  }

  function _wgpuQueueReference(id) {
    WebGPU.mgrQueue.reference(id);
  }

  function _wgpuQueueRelease(id) {
    WebGPU.mgrQueue.release(id);
  }

  function _wgpuQueueSubmit(queueId, commandCount, commands) {
      assert(commands % 4 === 0);
      var queue = WebGPU.mgrQueue.get(queueId);
      var cmds = Array.from(HEAP32.subarray(commands >> 2, (commands >> 2) + commandCount),
        function(id) { return WebGPU.mgrCommandBuffer.get(id); });
      queue.submit(cmds);
    }

  function _wgpuRenderPassEncoderDraw(passId, vertexCount, instanceCount, firstVertex, firstInstance) {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      pass.draw(vertexCount, instanceCount, firstVertex, firstInstance);
    }

  function _wgpuRenderPassEncoderDrawIndexed(passId, indexCount, instanceCount, firstIndex, baseVertex, firstInstance) {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      pass.drawIndexed(indexCount, instanceCount, firstIndex, baseVertex, firstInstance);
    }

  function _wgpuRenderPassEncoderEndPass(passId) {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      pass.endPass();
    }

  function _wgpuRenderPassEncoderInsertDebugMarker(passId, groupLabel) {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      pass.insertDebugMarker(UTF8ToString(groupLabel));
    }

  function _wgpuRenderPassEncoderPopDebugGroup(passId) {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      pass.popDebugGroup();
    }

  function _wgpuRenderPassEncoderPushDebugGroup(passId, groupLabel) {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      pass.pushDebugGroup(UTF8ToString(groupLabel));
    }

  function _wgpuRenderPassEncoderReference(id) {
    WebGPU.mgrRenderPassEncoder.reference(id);
  }

  function _wgpuRenderPassEncoderRelease(id) {
    WebGPU.mgrRenderPassEncoder.release(id);
  }

  function _wgpuRenderPassEncoderSetBindGroup(passId, groupIndex, groupId, dynamicOffsetCount, dynamicOffsetsPtr) {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      var group = WebGPU.mgrBindGroup.get(groupId);
      if (dynamicOffsetCount == 0) {
        pass.setBindGroup(groupIndex, group);
      } else {
        var offsets = [];
        // TODO: Update to u32 after rolling the header.
        for (var i = 0; i < dynamicOffsetCount; i++, dynamicOffsetsPtr += 8) {
          offsets.push(HEAPU32[(((dynamicOffsetsPtr + 4))>>2)] * 0x100000000 + HEAPU32[((dynamicOffsetsPtr)>>2)]);
        }
        pass.setBindGroup(groupIndex, group, offsets);
      }
    }

  function _wgpuRenderPassEncoderSetBlendColor(passId, colorPtr) {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      var color = WebGPU.makeColor(colorPtr);
      pass.setBlendColor(color);
    }

  function _wgpuRenderPassEncoderSetIndexBuffer(passId, bufferId, offset) {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      var buffer = WebGPU.mgrBuffer.get(bufferId);
      pass.setIndexBuffer(buffer, offset);
    }

  function _wgpuRenderPassEncoderSetPipeline(passId, pipelineId) {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      var pipeline = WebGPU.mgrRenderPipeline.get(pipelineId);
      pass.setPipeline(pipeline);
    }

  function _wgpuRenderPassEncoderSetScissorRect(passId, x, y, w, h) {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      pass.setScissorRect(x, y, w, h);
    }

  function _wgpuRenderPassEncoderSetVertexBuffer(passId, slot, bufferId, offset) {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      pass.setVertexBuffer(slot, WebGPU.mgrBuffer.get(bufferId), offset);
    }

  function _wgpuRenderPipelineRelease(id) {
    WebGPU.mgrRenderPipeline.release(id);
  }

  function _wgpuSamplerReference(id) {
    WebGPU.mgrSampler.reference(id);
  }

  function _wgpuSamplerRelease(id) {
    WebGPU.mgrSampler.release(id);
  }

  function _wgpuShaderModuleReference(id) {
    WebGPU.mgrShaderModule.reference(id);
  }

  function _wgpuShaderModuleRelease(id) {
    WebGPU.mgrShaderModule.release(id);
  }

  function _wgpuTextureCreateView(textureId, descriptor) {
      var desc;
      if (descriptor !== 0) {
        assert(descriptor !== 0);assert(HEAP32[((descriptor)>>2)] === 0);
  
        desc = {
          format: WebGPU.TextureFormat[
            HEAPU32[(((descriptor)+(8))>>2)]],
          dimension: WebGPU.TextureViewDimension[
            HEAPU32[(((descriptor)+(12))>>2)]],
          baseMipLevel: HEAPU32[(((descriptor)+(16))>>2)],
          mipLevelCount: HEAPU32[(((descriptor)+(20))>>2)],
          baseArrayLayer: HEAPU32[(((descriptor)+(24))>>2)],
          arrayLayerCount: HEAPU32[(((descriptor)+(28))>>2)],
          aspect: WebGPU.TextureAspect[
            HEAPU32[(((descriptor)+(32))>>2)]],
        };
      }
  
      var texture = WebGPU.mgrTexture.get(textureId);
      return WebGPU.mgrTextureView.create(texture.createView(desc));
    }

  function _wgpuTextureDestroy(textureId) { WebGPU.mgrTexture.get(textureId).destroy(); }

  function _wgpuTextureReference(id) {
    WebGPU.mgrTexture.reference(id);
  }

  function _wgpuTextureRelease(id) {
    WebGPU.mgrTexture.release(id);
  }

  function _wgpuTextureViewReference(id) {
    WebGPU.mgrTextureView.reference(id);
  }

  function _wgpuTextureViewRelease(id) {
    WebGPU.mgrTextureView.release(id);
  }

FS.staticInit();Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;Module["FS_unlink"] = FS.unlink;;
if (ENVIRONMENT_IS_NODE) {
    _emscripten_get_now = function _emscripten_get_now_actual() {
      var t = process['hrtime']();
      return t[0] * 1e3 + t[1] / 1e6;
    };
  } else if (typeof dateNow !== 'undefined') {
    _emscripten_get_now = dateNow;
  } else _emscripten_get_now = function() { return performance['now'](); };
  ;
Module["requestFullscreen"] = function Module_requestFullscreen(lockPointer, resizeCanvas, vrDevice) { Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice) };
  Module["requestFullScreen"] = function Module_requestFullScreen() { Browser.requestFullScreen() };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
  Module["createContext"] = function Module_createContext(canvas, useWebGL, setInModule, webGLContextAttributes) { return Browser.createContext(canvas, useWebGL, setInModule, webGLContextAttributes) };
var ASSERTIONS = true;

// Copyright 2017 The Emscripten Authors.  All rights reserved.
// Emscripten is available under two separate licenses, the MIT license and the
// University of Illinois/NCSA Open Source License.  Both these licenses can be
// found in the LICENSE file.

/** @type {function(string, boolean=, number=)} */
function intArrayFromString(stringy, dontAddNull, length) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      if (ASSERTIONS) {
        assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
      }
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}


// ASM_LIBRARY EXTERN PRIMITIVES: Int8Array,Int32Array

var asmGlobalArg = {};
var asmLibraryArg = { "__assert_fail": ___assert_fail, "__cxa_atexit": ___cxa_atexit, "__handle_stack_overflow": ___handle_stack_overflow, "__lock": ___lock, "__syscall221": ___syscall221, "__syscall5": ___syscall5, "__syscall54": ___syscall54, "__unlock": ___unlock, "abort": _abort, "emscripten_asm_const_iii": _emscripten_asm_const_iii, "emscripten_get_now": _emscripten_get_now, "emscripten_get_sbrk_ptr": _emscripten_get_sbrk_ptr, "emscripten_log": _emscripten_log, "emscripten_memcpy_big": _emscripten_memcpy_big, "emscripten_request_fullscreen_strategy": _emscripten_request_fullscreen_strategy, "emscripten_resize_heap": _emscripten_resize_heap, "emscripten_set_focus_callback_on_thread": _emscripten_set_focus_callback_on_thread, "emscripten_set_focusin_callback_on_thread": _emscripten_set_focusin_callback_on_thread, "emscripten_set_focusout_callback_on_thread": _emscripten_set_focusout_callback_on_thread, "emscripten_set_keydown_callback_on_thread": _emscripten_set_keydown_callback_on_thread, "emscripten_set_keypress_callback_on_thread": _emscripten_set_keypress_callback_on_thread, "emscripten_set_keyup_callback_on_thread": _emscripten_set_keyup_callback_on_thread, "emscripten_set_main_loop": _emscripten_set_main_loop, "emscripten_set_mousedown_callback_on_thread": _emscripten_set_mousedown_callback_on_thread, "emscripten_set_mousemove_callback_on_thread": _emscripten_set_mousemove_callback_on_thread, "emscripten_set_mouseup_callback_on_thread": _emscripten_set_mouseup_callback_on_thread, "emscripten_set_resize_callback_on_thread": _emscripten_set_resize_callback_on_thread, "emscripten_set_wheel_callback_on_thread": _emscripten_set_wheel_callback_on_thread, "emscripten_webgpu_get_current_texture_view": _emscripten_webgpu_get_current_texture_view, "emscripten_webgpu_get_device": _emscripten_webgpu_get_device, "environ_get": _environ_get, "environ_sizes_get": _environ_sizes_get, "fd_close": _fd_close, "fd_read": _fd_read, "fd_seek": _fd_seek, "fd_write": _fd_write, "memory": wasmMemory, "setTempRet0": _setTempRet0, "system": _system, "table": wasmTable, "time": _time, "wgpuBindGroupLayoutReference": _wgpuBindGroupLayoutReference, "wgpuBindGroupLayoutRelease": _wgpuBindGroupLayoutRelease, "wgpuBindGroupRelease": _wgpuBindGroupRelease, "wgpuBufferDestroy": _wgpuBufferDestroy, "wgpuBufferReference": _wgpuBufferReference, "wgpuBufferRelease": _wgpuBufferRelease, "wgpuBufferSetSubData": _wgpuBufferSetSubData, "wgpuCommandBufferRelease": _wgpuCommandBufferRelease, "wgpuCommandEncoderBeginComputePass": _wgpuCommandEncoderBeginComputePass, "wgpuCommandEncoderBeginRenderPass": _wgpuCommandEncoderBeginRenderPass, "wgpuCommandEncoderCopyBufferToBuffer": _wgpuCommandEncoderCopyBufferToBuffer, "wgpuCommandEncoderCopyBufferToTexture": _wgpuCommandEncoderCopyBufferToTexture, "wgpuCommandEncoderCopyTextureToTexture": _wgpuCommandEncoderCopyTextureToTexture, "wgpuCommandEncoderFinish": _wgpuCommandEncoderFinish, "wgpuCommandEncoderRelease": _wgpuCommandEncoderRelease, "wgpuComputePassEncoderDispatch": _wgpuComputePassEncoderDispatch, "wgpuComputePassEncoderEndPass": _wgpuComputePassEncoderEndPass, "wgpuComputePassEncoderPopDebugGroup": _wgpuComputePassEncoderPopDebugGroup, "wgpuComputePassEncoderPushDebugGroup": _wgpuComputePassEncoderPushDebugGroup, "wgpuComputePassEncoderRelease": _wgpuComputePassEncoderRelease, "wgpuComputePassEncoderSetBindGroup": _wgpuComputePassEncoderSetBindGroup, "wgpuComputePassEncoderSetPipeline": _wgpuComputePassEncoderSetPipeline, "wgpuComputePipelineRelease": _wgpuComputePipelineRelease, "wgpuDeviceCreateBindGroup": _wgpuDeviceCreateBindGroup, "wgpuDeviceCreateBindGroupLayout": _wgpuDeviceCreateBindGroupLayout, "wgpuDeviceCreateBuffer": _wgpuDeviceCreateBuffer, "wgpuDeviceCreateCommandEncoder": _wgpuDeviceCreateCommandEncoder, "wgpuDeviceCreateComputePipeline": _wgpuDeviceCreateComputePipeline, "wgpuDeviceCreatePipelineLayout": _wgpuDeviceCreatePipelineLayout, "wgpuDeviceCreateQueue": _wgpuDeviceCreateQueue, "wgpuDeviceCreateRenderPipeline": _wgpuDeviceCreateRenderPipeline, "wgpuDeviceCreateSampler": _wgpuDeviceCreateSampler, "wgpuDeviceCreateShaderModule": _wgpuDeviceCreateShaderModule, "wgpuDeviceCreateTexture": _wgpuDeviceCreateTexture, "wgpuDeviceReference": _wgpuDeviceReference, "wgpuDeviceRelease": _wgpuDeviceRelease, "wgpuPipelineLayoutRelease": _wgpuPipelineLayoutRelease, "wgpuQueueReference": _wgpuQueueReference, "wgpuQueueRelease": _wgpuQueueRelease, "wgpuQueueSubmit": _wgpuQueueSubmit, "wgpuRenderPassEncoderDraw": _wgpuRenderPassEncoderDraw, "wgpuRenderPassEncoderDrawIndexed": _wgpuRenderPassEncoderDrawIndexed, "wgpuRenderPassEncoderEndPass": _wgpuRenderPassEncoderEndPass, "wgpuRenderPassEncoderInsertDebugMarker": _wgpuRenderPassEncoderInsertDebugMarker, "wgpuRenderPassEncoderPopDebugGroup": _wgpuRenderPassEncoderPopDebugGroup, "wgpuRenderPassEncoderPushDebugGroup": _wgpuRenderPassEncoderPushDebugGroup, "wgpuRenderPassEncoderReference": _wgpuRenderPassEncoderReference, "wgpuRenderPassEncoderRelease": _wgpuRenderPassEncoderRelease, "wgpuRenderPassEncoderSetBindGroup": _wgpuRenderPassEncoderSetBindGroup, "wgpuRenderPassEncoderSetBlendColor": _wgpuRenderPassEncoderSetBlendColor, "wgpuRenderPassEncoderSetIndexBuffer": _wgpuRenderPassEncoderSetIndexBuffer, "wgpuRenderPassEncoderSetPipeline": _wgpuRenderPassEncoderSetPipeline, "wgpuRenderPassEncoderSetScissorRect": _wgpuRenderPassEncoderSetScissorRect, "wgpuRenderPassEncoderSetVertexBuffer": _wgpuRenderPassEncoderSetVertexBuffer, "wgpuRenderPipelineRelease": _wgpuRenderPipelineRelease, "wgpuSamplerReference": _wgpuSamplerReference, "wgpuSamplerRelease": _wgpuSamplerRelease, "wgpuShaderModuleReference": _wgpuShaderModuleReference, "wgpuShaderModuleRelease": _wgpuShaderModuleRelease, "wgpuTextureCreateView": _wgpuTextureCreateView, "wgpuTextureDestroy": _wgpuTextureDestroy, "wgpuTextureReference": _wgpuTextureReference, "wgpuTextureRelease": _wgpuTextureRelease, "wgpuTextureViewReference": _wgpuTextureViewReference, "wgpuTextureViewRelease": _wgpuTextureViewRelease };
var asm = createWasm();
var real____wasm_call_ctors = asm["__wasm_call_ctors"];
asm["__wasm_call_ctors"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real____wasm_call_ctors.apply(null, arguments);
};

var real__strlen = asm["strlen"];
asm["strlen"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__strlen.apply(null, arguments);
};

var real__malloc = asm["malloc"];
asm["malloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__malloc.apply(null, arguments);
};

var real__free = asm["free"];
asm["free"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__free.apply(null, arguments);
};

var real__main = asm["main"];
asm["main"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__main.apply(null, arguments);
};

var real__realloc = asm["realloc"];
asm["realloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__realloc.apply(null, arguments);
};

var real__fflush = asm["fflush"];
asm["fflush"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__fflush.apply(null, arguments);
};

var real____errno_location = asm["__errno_location"];
asm["__errno_location"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real____errno_location.apply(null, arguments);
};

var real__setThrew = asm["setThrew"];
asm["setThrew"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__setThrew.apply(null, arguments);
};

var real____set_stack_limit = asm["__set_stack_limit"];
asm["__set_stack_limit"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real____set_stack_limit.apply(null, arguments);
};

var real_stackSave = asm["stackSave"];
asm["stackSave"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_stackSave.apply(null, arguments);
};

var real_stackAlloc = asm["stackAlloc"];
asm["stackAlloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_stackAlloc.apply(null, arguments);
};

var real_stackRestore = asm["stackRestore"];
asm["stackRestore"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_stackRestore.apply(null, arguments);
};

var real___growWasmMemory = asm["__growWasmMemory"];
asm["__growWasmMemory"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real___growWasmMemory.apply(null, arguments);
};

var real_dynCall_ii = asm["dynCall_ii"];
asm["dynCall_ii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_ii.apply(null, arguments);
};

var real_dynCall_vi = asm["dynCall_vi"];
asm["dynCall_vi"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_vi.apply(null, arguments);
};

var real_dynCall_viiiii = asm["dynCall_viiiii"];
asm["dynCall_viiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_viiiii.apply(null, arguments);
};

var real_dynCall_vii = asm["dynCall_vii"];
asm["dynCall_vii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_vii.apply(null, arguments);
};

var real_dynCall_viii = asm["dynCall_viii"];
asm["dynCall_viii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_viii.apply(null, arguments);
};

var real_dynCall_viiii = asm["dynCall_viiii"];
asm["dynCall_viiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_viiii.apply(null, arguments);
};

var real_dynCall_iiii = asm["dynCall_iiii"];
asm["dynCall_iiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_iiii.apply(null, arguments);
};

var real_dynCall_iii = asm["dynCall_iii"];
asm["dynCall_iii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_iii.apply(null, arguments);
};

var real_dynCall_fii = asm["dynCall_fii"];
asm["dynCall_fii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_fii.apply(null, arguments);
};

var real_dynCall_v = asm["dynCall_v"];
asm["dynCall_v"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_v.apply(null, arguments);
};

var real_dynCall_iiiii = asm["dynCall_iiiii"];
asm["dynCall_iiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_iiiii.apply(null, arguments);
};

var real_dynCall_jiji = asm["dynCall_jiji"];
asm["dynCall_jiji"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_jiji.apply(null, arguments);
};

var real_dynCall_iiiiiii = asm["dynCall_iiiiiii"];
asm["dynCall_iiiiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_iiiiiii.apply(null, arguments);
};

var real_dynCall_iij = asm["dynCall_iij"];
asm["dynCall_iij"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_iij.apply(null, arguments);
};

var real_dynCall_iijii = asm["dynCall_iijii"];
asm["dynCall_iijii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_iijii.apply(null, arguments);
};

var real_dynCall_vijii = asm["dynCall_vijii"];
asm["dynCall_vijii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_vijii.apply(null, arguments);
};

var real_dynCall_viiiiiiii = asm["dynCall_viiiiiiii"];
asm["dynCall_viiiiiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_viiiiiiii.apply(null, arguments);
};

var real_dynCall_viiiiii = asm["dynCall_viiiiii"];
asm["dynCall_viiiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_viiiiii.apply(null, arguments);
};

var real_dynCall_iiiiji = asm["dynCall_iiiiji"];
asm["dynCall_iiiiji"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_iiiiji.apply(null, arguments);
};

var real_dynCall_viiiiiiiii = asm["dynCall_viiiiiiiii"];
asm["dynCall_viiiiiiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_viiiiiiiii.apply(null, arguments);
};

var real_dynCall_viiiiiii = asm["dynCall_viiiiiii"];
asm["dynCall_viiiiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_viiiiiii.apply(null, arguments);
};

var real_dynCall_iidiiii = asm["dynCall_iidiiii"];
asm["dynCall_iidiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_dynCall_iidiiii.apply(null, arguments);
};

Module["asm"] = asm;
var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["__wasm_call_ctors"].apply(null, arguments)
};

var _strlen = Module["_strlen"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["strlen"].apply(null, arguments)
};

var _malloc = Module["_malloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["malloc"].apply(null, arguments)
};

var _free = Module["_free"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["free"].apply(null, arguments)
};

var _main = Module["_main"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["main"].apply(null, arguments)
};

var _realloc = Module["_realloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["realloc"].apply(null, arguments)
};

var _fflush = Module["_fflush"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["fflush"].apply(null, arguments)
};

var ___errno_location = Module["___errno_location"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["__errno_location"].apply(null, arguments)
};

var _setThrew = Module["_setThrew"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["setThrew"].apply(null, arguments)
};

var ___set_stack_limit = Module["___set_stack_limit"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["__set_stack_limit"].apply(null, arguments)
};

var stackSave = Module["stackSave"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["stackSave"].apply(null, arguments)
};

var stackAlloc = Module["stackAlloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["stackAlloc"].apply(null, arguments)
};

var stackRestore = Module["stackRestore"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["stackRestore"].apply(null, arguments)
};

var __growWasmMemory = Module["__growWasmMemory"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["__growWasmMemory"].apply(null, arguments)
};

var dynCall_ii = Module["dynCall_ii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_ii"].apply(null, arguments)
};

var dynCall_vi = Module["dynCall_vi"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_vi"].apply(null, arguments)
};

var dynCall_viiiii = Module["dynCall_viiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viiiii"].apply(null, arguments)
};

var dynCall_vii = Module["dynCall_vii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_vii"].apply(null, arguments)
};

var dynCall_viii = Module["dynCall_viii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viii"].apply(null, arguments)
};

var dynCall_viiii = Module["dynCall_viiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viiii"].apply(null, arguments)
};

var dynCall_iiii = Module["dynCall_iiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_iiii"].apply(null, arguments)
};

var dynCall_iii = Module["dynCall_iii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_iii"].apply(null, arguments)
};

var dynCall_fii = Module["dynCall_fii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_fii"].apply(null, arguments)
};

var dynCall_v = Module["dynCall_v"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_v"].apply(null, arguments)
};

var dynCall_iiiii = Module["dynCall_iiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_iiiii"].apply(null, arguments)
};

var dynCall_jiji = Module["dynCall_jiji"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_jiji"].apply(null, arguments)
};

var dynCall_iiiiiii = Module["dynCall_iiiiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_iiiiiii"].apply(null, arguments)
};

var dynCall_iij = Module["dynCall_iij"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_iij"].apply(null, arguments)
};

var dynCall_iijii = Module["dynCall_iijii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_iijii"].apply(null, arguments)
};

var dynCall_vijii = Module["dynCall_vijii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_vijii"].apply(null, arguments)
};

var dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viiiiiiii"].apply(null, arguments)
};

var dynCall_viiiiii = Module["dynCall_viiiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viiiiii"].apply(null, arguments)
};

var dynCall_iiiiji = Module["dynCall_iiiiji"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_iiiiji"].apply(null, arguments)
};

var dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viiiiiiiii"].apply(null, arguments)
};

var dynCall_viiiiiii = Module["dynCall_viiiiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_viiiiiii"].apply(null, arguments)
};

var dynCall_iidiiii = Module["dynCall_iidiiii"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return Module["asm"]["dynCall_iidiiii"].apply(null, arguments)
};




// === Auto-generated postamble setup entry stuff ===

Module['asm'] = asm;

if (!Object.getOwnPropertyDescriptor(Module, "intArrayFromString")) Module["intArrayFromString"] = function() { abort("'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "intArrayToString")) Module["intArrayToString"] = function() { abort("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "ccall")) Module["ccall"] = function() { abort("'ccall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "cwrap")) Module["cwrap"] = function() { abort("'cwrap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "setValue")) Module["setValue"] = function() { abort("'setValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getValue")) Module["getValue"] = function() { abort("'getValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "allocate")) Module["allocate"] = function() { abort("'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
Module["getMemory"] = getMemory;
if (!Object.getOwnPropertyDescriptor(Module, "AsciiToString")) Module["AsciiToString"] = function() { abort("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToAscii")) Module["stringToAscii"] = function() { abort("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "UTF8ArrayToString")) Module["UTF8ArrayToString"] = function() { abort("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "UTF8ToString")) Module["UTF8ToString"] = function() { abort("'UTF8ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8Array")) Module["stringToUTF8Array"] = function() { abort("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF8")) Module["stringToUTF8"] = function() { abort("'stringToUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF8")) Module["lengthBytesUTF8"] = function() { abort("'lengthBytesUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "UTF16ToString")) Module["UTF16ToString"] = function() { abort("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF16")) Module["stringToUTF16"] = function() { abort("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF16")) Module["lengthBytesUTF16"] = function() { abort("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "UTF32ToString")) Module["UTF32ToString"] = function() { abort("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stringToUTF32")) Module["stringToUTF32"] = function() { abort("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "lengthBytesUTF32")) Module["lengthBytesUTF32"] = function() { abort("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "allocateUTF8")) Module["allocateUTF8"] = function() { abort("'allocateUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackTrace")) Module["stackTrace"] = function() { abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPreRun")) Module["addOnPreRun"] = function() { abort("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnInit")) Module["addOnInit"] = function() { abort("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPreMain")) Module["addOnPreMain"] = function() { abort("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnExit")) Module["addOnExit"] = function() { abort("'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addOnPostRun")) Module["addOnPostRun"] = function() { abort("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeStringToMemory")) Module["writeStringToMemory"] = function() { abort("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeArrayToMemory")) Module["writeArrayToMemory"] = function() { abort("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "writeAsciiToMemory")) Module["writeAsciiToMemory"] = function() { abort("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
Module["addRunDependency"] = addRunDependency;
Module["removeRunDependency"] = removeRunDependency;
if (!Object.getOwnPropertyDescriptor(Module, "ENV")) Module["ENV"] = function() { abort("'ENV' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "FS")) Module["FS"] = function() { abort("'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
Module["FS_createFolder"] = FS.createFolder;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createLink"] = FS.createLink;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
if (!Object.getOwnPropertyDescriptor(Module, "GL")) Module["GL"] = function() { abort("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "dynamicAlloc")) Module["dynamicAlloc"] = function() { abort("'dynamicAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "loadDynamicLibrary")) Module["loadDynamicLibrary"] = function() { abort("'loadDynamicLibrary' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "loadWebAssemblyModule")) Module["loadWebAssemblyModule"] = function() { abort("'loadWebAssemblyModule' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getLEB")) Module["getLEB"] = function() { abort("'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getFunctionTables")) Module["getFunctionTables"] = function() { abort("'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "alignFunctionTables")) Module["alignFunctionTables"] = function() { abort("'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "registerFunctions")) Module["registerFunctions"] = function() { abort("'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "addFunction")) Module["addFunction"] = function() { abort("'addFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "removeFunction")) Module["removeFunction"] = function() { abort("'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getFuncWrapper")) Module["getFuncWrapper"] = function() { abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "prettyPrint")) Module["prettyPrint"] = function() { abort("'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "makeBigInt")) Module["makeBigInt"] = function() { abort("'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "dynCall")) Module["dynCall"] = function() { abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getCompilerSetting")) Module["getCompilerSetting"] = function() { abort("'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "print")) Module["print"] = function() { abort("'print' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "printErr")) Module["printErr"] = function() { abort("'printErr' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "getTempRet0")) Module["getTempRet0"] = function() { abort("'getTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "setTempRet0")) Module["setTempRet0"] = function() { abort("'setTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "callMain")) Module["callMain"] = function() { abort("'callMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "abort")) Module["abort"] = function() { abort("'abort' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "warnOnce")) Module["warnOnce"] = function() { abort("'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackSave")) Module["stackSave"] = function() { abort("'stackSave' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackRestore")) Module["stackRestore"] = function() { abort("'stackRestore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Object.getOwnPropertyDescriptor(Module, "stackAlloc")) Module["stackAlloc"] = function() { abort("'stackAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
Module["writeStackCookie"] = writeStackCookie;
Module["checkStackCookie"] = checkStackCookie;
Module["abortStackOverflow"] = abortStackOverflow;if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_NORMAL")) Object.defineProperty(Module, "ALLOC_NORMAL", { configurable: true, get: function() { abort("'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_STACK")) Object.defineProperty(Module, "ALLOC_STACK", { configurable: true, get: function() { abort("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_DYNAMIC")) Object.defineProperty(Module, "ALLOC_DYNAMIC", { configurable: true, get: function() { abort("'ALLOC_DYNAMIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Object.getOwnPropertyDescriptor(Module, "ALLOC_NONE")) Object.defineProperty(Module, "ALLOC_NONE", { configurable: true, get: function() { abort("'ALLOC_NONE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
Module["calledRun"] = calledRun;



var calledRun;


/**
 * @constructor
 * @this {ExitStatus}
 */
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
}

var calledMain = false;


dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
};

function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');

  var entryFunction = Module['_main'];


  args = args || [];

  var argc = args.length+1;
  var argv = stackAlloc((argc + 1) * 4);
  HEAP32[argv >> 2] = allocateUTF8OnStack(thisProgram);
  for (var i = 1; i < argc; i++) {
    HEAP32[(argv >> 2) + i] = allocateUTF8OnStack(args[i - 1]);
  }
  HEAP32[(argv >> 2) + argc] = 0;


  try {

    Module['___set_stack_limit'](STACK_MAX);

    var ret = entryFunction(argc, argv);


    // In PROXY_TO_PTHREAD builds, we should never exit the runtime below, as execution is asynchronously handed
    // off to a pthread.
    // if we're not running an evented main loop, it's time to exit
      exit(ret, /* implicit = */ true);
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'unwind') {
      // running an evented main loop, don't immediately exit
      noExitRuntime = true;
      return;
    } else {
      var toLog = e;
      if (e && typeof e === 'object' && e.stack) {
        toLog = [e, e.stack];
      }
      err('exception thrown: ' + toLog);
      quit_(1, e);
    }
  } finally {
    calledMain = true;
  }
}




/** @type {function(Array=)} */
function run(args) {
  args = args || arguments_;

  if (runDependencies > 0) {
    return;
  }

  writeStackCookie();

  preRun();

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    if (calledRun) return;
    calledRun = true;
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    preMain();

    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    if (shouldRunNow) callMain(args);

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
  checkStackCookie();
}
Module['run'] = run;

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var print = out;
  var printErr = err;
  var has = false;
  out = err = function(x) {
    has = true;
  }
  try { // it doesn't matter if it fails
    var flush = Module['_fflush'];
    if (flush) flush(0);
    // also flush in the JS FS layer
    ['stdout', 'stderr'].forEach(function(name) {
      var info = FS.analyzePath('/dev/' + name);
      if (!info) return;
      var stream = info.object;
      var rdev = stream.rdev;
      var tty = TTY.ttys[rdev];
      if (tty && tty.output && tty.output.length) {
        has = true;
      }
    });
  } catch(e) {}
  out = print;
  err = printErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.');
  }
}

function exit(status, implicit) {
  checkUnflushedContent();

  // if this is just main exit-ing implicitly, and the status is 0, then we
  // don't need to do anything here and can just leave. if the status is
  // non-zero, though, then we need to report it.
  // (we may have warned about this earlier, if a situation justifies doing so)
  if (implicit && noExitRuntime && status === 0) {
    return;
  }

  if (noExitRuntime) {
    // if exit() was called, we may warn the user if the runtime isn't actually being shut down
    if (!implicit) {
      err('program exited (with status: ' + status + '), but EXIT_RUNTIME is not set, so halting execution but not exiting the runtime or preventing further async execution (build with EXIT_RUNTIME=1, if you want a true shutdown)');
    }
  } else {

    ABORT = true;
    EXITSTATUS = status;

    exitRuntime();

    if (Module['onExit']) Module['onExit'](status);
  }

  quit_(status, new ExitStatus(status));
}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;

if (Module['noInitialRun']) shouldRunNow = false;


  noExitRuntime = true;

run();





// {{MODULE_ADDITIONS}}



