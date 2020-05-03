//  Copyright (c) 2019 Hugo Amiard hugo.amiard@laposte.net
//  This software is provided 'as-is' under the zlib License, see the LICENSE.txt file.
//  This notice and the license may not be removed or altered from any source distribution.

#pragma once

#include <stl/string.h>
#include <infra/Forward.h>

#include <cstdio>

namespace two
{
	namespace ANSIToken
	{
		constexpr char Header[] = "\033[95m";
		constexpr char OkBlue[] = "\033[94m";
		constexpr char OkGreen[] = "\033[92m";
		constexpr char Warn[] = "\033[93m";
		constexpr char Fail[] = "\033[91m";
		constexpr char End[] = "\033[0m";
		constexpr char Bold[] = "\033[1m";
		constexpr char Underline[] = "\033[4m";
	};

	export_ TWO_INFRA_EXPORT void init_console();

	template <class... Args>
	void info(const char* message, Args&&... args)
	{
		printf("[info] %s", ANSIToken::OkGreen);
		printf(message, args...);
		printf("%s\n", ANSIToken::End);
	}

	template <class... Args>
	void warn(const char* message, Args&&... args)
	{
		printf("[warning] %s", ANSIToken::Warn);
		printf(message, args...);
		printf("%s\n", ANSIToken::End);
	}

	template <class... Args>
	void error(const char* message, Args&&... args)
	{
		printf("[ERROR] %s", ANSIToken::Fail);
		printf(message, args...);
		printf("%s\n", ANSIToken::End);
	}
}
