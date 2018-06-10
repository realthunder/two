
#pragma once

#if !defined MUD_MODULES || defined MUD_OBJ_LIB
#include <refl/Module.h>
#endif

#ifndef MUD_MODULES
#include <meta/obj/Module.h>
#include <meta/srlz/Module.h>
#include <meta/math/Module.h>
#include <meta/geom/Module.h>
#include <meta/gfx/Module.h>
#endif
        
#include <gfx-pbr/Forward.h>
#include <gfx-pbr/Types.h>
#include <gfx-pbr/Api.h>

#include <meta/gfx-pbr/Convert.h>

#ifndef MUD_GFX_PBR_REFL_EXPORT
#define MUD_GFX_PBR_REFL_EXPORT MUD_IMPORT
#endif

namespace mud
{
	export_ class MUD_GFX_PBR_REFL_EXPORT mudgfxpbr : public Module
	{
	private:
		mudgfxpbr();

	public:
		static mudgfxpbr& m() { static mudgfxpbr instance; return instance; }
	};
}

#ifdef MUD_GFX_PBR_MODULE
extern "C"
MUD_GFX_PBR_REFL_EXPORT Module& getModule();
#endif