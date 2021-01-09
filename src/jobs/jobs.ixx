module;
#include <cpp/preimport.h>
#include <infra/Config.h>

export module TWO(jobs);
import std.core;
import std.threading;
import std.regex;

export import TWO(infra);
export import TWO(type);

#include <jobs/Api.h>

