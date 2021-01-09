module;
#include <cpp/preimport.h>
#include <infra/Config.h>

export module TWO(ecs);
import std.core;
import std.threading;
import std.regex;

export import TWO(infra);
export import TWO(pool);
export import TWO(type);

#include <ecs/Api.h>

