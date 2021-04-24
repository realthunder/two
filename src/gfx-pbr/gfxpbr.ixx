module;
#include <cpp/preimport.h>
#include <infra/Config.h>
#include <bgfx/bgfx.h>
#include <bimg/bimg.h>

export module TWO2(gfx, pbr);
import std.core;
import std.threading;
import std.regex;

export import TWO(infra);
export import TWO(type);
export import TWO(math);
export import TWO(geom);
export import TWO(gfx);

#include <gfx-pbr/Api.h>

