module;
#include <cpp/preimport.h>
#include <infra/Config.h>
#include <bx/allocator.h>
#include <bx/timer.h>
#include <bgfx/bgfx.h>
#include <bgfx/platform.h>

export module two.bgfx;
import std.core;
import std.threading;
import std.regex;

export import two.infra;
export import two.type;
export import two.math;
export import two.ctx;
export import two.ctx.glfw;

#include <bgfx/Api.h>

