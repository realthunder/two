module;
#include <cpp/preimport.h>
#include <infra/Config.h>
#include <ctx-glfw/Glfw.h>

export module TWO2(ctx, glfw);
import std.core;
import std.threading;
import std.regex;

export import TWO(math);
export import TWO(ctx);

#include <ctx-glfw/Api.h>

