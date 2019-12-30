-- two library
-- zeromq 3rdparty module

function uses_zeromq()
    includedirs {
        path.join(TWO_3RDPARTY_DIR, "libzmq", "include"),
        path.join(TWO_3RDPARTY_DIR, "cppzmq"),
    }
    
    configuration { "vs*" }
        links {
            "ws2_32",
            "rpcrt4",
            "iphlpapi",
        }
        
    configuration {}
end

zeromq = dep(nil, "zeromq", true, uses_zeromq)
    kind "StaticLib"
    
    defines {
        "ZMQ_STATIC",
    }

	--removedefines {
	--	"__STDC_LIMIT_MACROS",
    --}
    
    includedirs {
        path.join(TWO_SRC_DIR),
        path.join(TWO_DIR, "scripts", "3rdparty", "zeromq"),
        path.join(TWO_3RDPARTY_DIR, "libzmq"),
    }
    
    files {
        path.join(TWO_3RDPARTY_DIR, "libzmq", "include", "**.h"),
        path.join(TWO_3RDPARTY_DIR, "libzmq", "src", "**.hpp"),
        path.join(TWO_3RDPARTY_DIR, "libzmq", "src", "**.cpp"),
    }

    removefiles {
        path.join(TWO_3RDPARTY_DIR, "libzmq", "src", "wss_engine.hpp"),
        path.join(TWO_3RDPARTY_DIR, "libzmq", "src", "wss_engine.cpp"),
        path.join(TWO_3RDPARTY_DIR, "libzmq", "src", "ws_engine.cpp"),
        path.join(TWO_3RDPARTY_DIR, "libzmq", "src", "ws_address.cpp"),
        path.join(TWO_3RDPARTY_DIR, "libzmq", "src", "ws_connecter.cpp"),
    }

    configuration { "vs*" }
        defines {
            "ZMQ_HAVE_WINDOWS",
            "ZMQ_IOTHREAD_POLLER_USE_SELECT",
            "ZMQ_POLL_BASED_ON_SELECT",
        }

        links {
            "ws2_32",
            "rpcrt4",
            "iphlpapi",
        }

        buildoptions {
            "/wd4005", -- warning C4204: 'xxx': macro redefinition
            "/wd4100", -- warning C4100: 'xxx': unreferenced formal parameter
            "/wd4245", -- warning C4245: 'return': conversion from 'xxx' to 'yyy', signed/unsigned mismatch
            "/wd4244", -- warning C4244: '+=': conversion from 'xxx' to 'yyy', possible loss of data
            "/wd4701", -- warning C4701: potentially uninitialized local variable 'xxx' used
        }
        
    configuration {}
