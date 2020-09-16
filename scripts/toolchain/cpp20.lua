-- two toolchain
-- cpp20 modules

if not cxxmodule then
    cxxmodule = function(m)
    end
end

function modules(m)
    if not _OPTIONS["cpp-modules"] then
        return
    end
    
    removeflags { "Cpp17" }
    flags {
        "CppLatest",
        --"CppModules",
    }
    
    defines { "_CRT_NO_VA_START_VALIDATION" }

    if _ACTION == "vs2017"
	or _ACTION == "vs2019" then
        files {
          --path.join(m.path, m.dotname .. ".ixx"),
            path.join(m.path, m.dotname2 .. ".ixx"),
        }

        buildoptions {
            -- HACK for VS2019 preview 3 std.module bug
            "/experimental:module /stdIfcDir \"C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Preview\\VC\\Tools\\MSVC\\14.28.29304\\ifc\\x64\""
        }
    else
        files {
            path.join(m.path, m.dotname .. ".mxx"),
        }
        
        links {
            "std_core",
            "std_io",
            "std_threading",
            "std_regex",
        }
    end
end

function mxx(cpps, m)
    if not _OPTIONS["cpp-modules"] then
        return
    end
    
    local cxxmodules = {}

    for _, cpp in ipairs(cpps) do
        local relcpp = path.getrelative(TWO_DIR, cpp)
      --print("module for " .. relcpp .. " = " .. m.dotname)
        cxxmodules[relcpp] = m.dotname
    end

    cxxmodule(cxxmodules)
end
