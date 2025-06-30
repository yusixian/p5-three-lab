import { Link } from '@tanstack/react-router';

const Page404 = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="relative w-full max-w-4xl px-6">
        {/* Background decoration */}
        <div className="-z-10 absolute inset-0">
          <div className="absolute top-10 left-1/4 h-32 w-32 animate-pulse rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-xl"></div>
          <div
            className="absolute right-1/4 bottom-10 h-40 w-40 animate-pulse rounded-full bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-xl"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Left side - Illustration */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rotate-6 transform rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-2xl"></div>
              <div className="relative rounded-3xl border border-gray-200/20 bg-gradient-to-br from-gray-900/5 to-gray-800/5 p-8 backdrop-blur-sm dark:border-gray-700/20 dark:from-gray-100/5 dark:to-gray-200/5">
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 bg-clip-text font-bold text-8xl text-transparent">
                      404
                    </div>
                    <div className="absolute inset-0 font-bold text-8xl text-gray-200/10 blur-sm dark:text-gray-800/10">
                      404
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="mx-auto h-2 w-20 animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    <div
                      className="mx-auto h-2 w-16 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{ animationDelay: '0.5s' }}
                    ></div>
                    <div
                      className="mx-auto h-2 w-12 animate-pulse rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                      style={{ animationDelay: '1s' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6 text-center md:text-left">
            <div className="space-y-4">
              <h1 className="bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text font-bold text-4xl text-transparent md:text-5xl dark:from-gray-100 dark:to-gray-300">
                页面走丢了
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed dark:text-gray-400">
                看起来你访问的页面不存在，或者可能已经被移动到了其他地方。
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
              <Link
                to="/"
                className="group hover:-translate-y-0.5 inline-flex transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl"
              >
                <svg
                  className="group-hover:-translate-x-1 h-4 w-4 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                >
                  <title>返回首页箭头</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                返回首页
              </Link>

              <Link
                to="/examples"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all duration-300 hover:border-purple-500 hover:text-purple-600 dark:border-gray-600 dark:text-gray-300 dark:hover:text-purple-400"
              >
                浏览示例
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                >
                  <title>浏览示例箭头</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>

            <div className="text-gray-500 text-sm dark:text-gray-400">
              错误代码: 404 | 页面未找到
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page404;
