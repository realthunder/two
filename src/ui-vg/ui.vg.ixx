module;
#include <cpp/preimport.h>
#include <infra/Config.h>
#include <bx/allocator.h>
#include <vg/vg.h>
#include <bgfx/bgfx.h>

export module TWO2(ui, vg);
import std.core;
import std.threading;
import std.regex;

export import TWO(infra);
export import TWO(type);
export import TWO(math);
export import TWO(ui);

#include <ui-vg/Api.h>

