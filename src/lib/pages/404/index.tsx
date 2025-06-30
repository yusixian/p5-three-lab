import { Link } from '@tanstack/react-router';

const Page404 = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="relative w-full max-w-4xl px-6">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-10 h-32 w-32 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-xl animate-pulse"></div>
          <div
            className="absolute right-1/4 bottom-10 h-40 w-40 rounded-full bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Left side - Illustration */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-2xl transform rotate-6"></div>
              <div className="relative rounded-3xl bg-gradient-to-br from-gray-900/5 to-gray-800/5 dark:from-gray-100/5 dark:to-gray-200/5 p-8 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20">
                <div className="text-center">
                  <div className="relative mb-8">
                    <div className="text-8xl font-bold bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                      404
                    </div>
                    <div className="absolute inset-0 text-8xl font-bold text-gray-200/10 dark:text-gray-800/10 blur-sm">
                      404
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto animate-pulse"></div>
                    <div
                      className="h-2 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto animate-pulse"
                      style={{ animationDelay: '0.5s' }}
                    ></div>
                    <div
                      className="h-2 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto animate-pulse"
                      style={{ animationDelay: '1s' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="text-center md:text-left space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                页面走丢了
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                看起来你访问的页面不存在，或者可能已经被移动到了其他地方。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover:-translate-x-1"
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
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
              >
                浏览示例
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
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

            <div className="text-sm text-gray-500 dark:text-gray-400">
              错误代码: 404 | 页面未找到
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page404;
