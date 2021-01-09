module;
#include <cpp/preimport.h>
#include <infra/Config.h>

export module TWO(lang);
import std.core;
import std.threading;
import std.regex;

export import TWO(infra);
export import TWO(type);
export import TWO(pool);
export import TWO(refl);

#include <lang/Api.h>

