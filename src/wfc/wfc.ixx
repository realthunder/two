module;
#include <cpp/preimport.h>
#include <infra/Config.h>

export module TWO(wfc);
import std.core;
import std.threading;
import std.regex;

export import TWO(json11);
export import TWO(infra);
export import TWO(type);
export import TWO(srlz);
export import TWO(math);
export import TWO(geom);

#include <wfc/Api.h>

