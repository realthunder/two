module;
#include <cpp/preimport.h>
#include <infra/Config.h>

export module TWO(gfx.obj);
import std.core;
import std.threading;
import std.regex;

export import TWO(infra);
export import TWO(type);
export import TWO(srlz);
export import TWO(math);
export import TWO(geom);
export import TWO(gfx);

#include <gfx-obj/Api.h>

