module;
#include <cpp/preimport.h>
#include <infra/Config.h>

export module TWO(bgfx);
import std.core;
import std.threading;
import std.regex;

export import TWO(infra);
export import TWO(type);
export import TWO(math);
export import TWO(ctx);
export import TWO2(ctx, glfw);

#include <bgfx/Api.h>

