#ifndef USE_STL
#ifdef TWO_MODULES
module TWO(jobs);
#else
#include <stl/vector.hpp>
#include <jobs/Api.h>
#endif

namespace stl
{
	using namespace two;
	//template class TWO_JOBS_EXPORT vector<JobSystem::ThreadState>;
}
#endif
