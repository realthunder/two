module;
#include <cpp/preimport.h>
#include <infra/Config.h>

export module TWO(noise);
import std.core;
import std.threading;
import std.regex;

export import TWO(infra);
export import TWO(type);
export import TWO(math);
export import TWO(geom);

#include <noise/Api.h>

