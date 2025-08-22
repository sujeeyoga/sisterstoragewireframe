import React from 'react';

const Home2 = () => {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-black text-gray-900">SISTER</span>
              <span className="text-sm text-gray-600">STORAGE</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-pink-600 font-medium">Home</a>
              <a href="/shop" className="text-gray-700 hover:text-pink-600 font-medium">Shop</a>
              <a href="/about" className="text-gray-700 hover:text-pink-600 font-medium">About</a>
              <a href="/blog" className="text-gray-700 hover:text-pink-600 font-medium">Blog</a>
              <a href="/contact" className="text-gray-700 hover:text-pink-600 font-medium">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-700 hover:text-pink-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-2 text-gray-700 hover:text-pink-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 to-white py-32 lg:py-40">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-8">
                <span className="inline-block px-6 py-3 bg-pink-600 text-white text-sm font-bold rounded-full">
                  NEW COLLECTION
                </span>
                <h1 className="text-6xl lg:text-8xl font-black text-gray-900 leading-tight">
                  ORGANIZE<br />
                  <span className="text-pink-600">YOUR LIFE</span><br />
                  WITH STYLE
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-lg">
                  Beautiful, functional storage solutions designed by sisters, for sisters. 
                  Transform your space into an organized sanctuary.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <button className="bg-pink-600 text-white px-10 py-5 rounded-lg font-bold text-lg hover:bg-pink-700 transition-colors">
                  SHOP NOW
                </button>
                <button className="border-2 border-pink-600 text-pink-600 px-10 py-5 rounded-lg font-bold text-lg hover:bg-pink-600 hover:text-white transition-colors">
                  OUR STORY
                </button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/2a4c457a-7695-47d3-9912-ab2900c6ea25.png" 
                alt="Sister Storage Collection" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">1000+ Happy Sisters</p>
                    <p className="text-sm text-gray-600">Organized & Stylish</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Grid */}
      <section className="py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-screen">
          <div className="relative overflow-hidden group">
            <img 
              src="/lovable-uploads/76c5f6ac-f27b-4f26-8377-759dfc17c71d.png" 
              alt="Travel Collection" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Travel Collection</h3>
              <p className="text-white/80">On-the-go organization</p>
            </div>
          </div>
          <div className="relative overflow-hidden group">
            <img 
              src="/lovable-uploads/b32a7860-b957-41e7-9c5c-cbd348260cf2.png" 
              alt="Home Essentials" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Home Essentials</h3>
              <p className="text-white/80">Daily organization made beautiful</p>
            </div>
          </div>
          <div className="relative overflow-hidden group">
            <img 
              src="/lovable-uploads/03cc68a5-5bfc-4417-bf01-d43578ffa321.png" 
              alt="Premium Collection" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Premium Collection</h3>
              <p className="text-white/80">Luxury meets functionality</p>
            </div>
          </div>
          <div className="relative overflow-hidden group">
            <img 
              src="/src/assets/bangles-top-view.jpg" 
              alt="Jewelry Organization" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Jewelry Storage</h3>
              <p className="text-white/80">Keep your treasures safe</p>
            </div>
          </div>
        </div>
      </section>

      {/* Best Seller Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-block px-6 py-3 bg-pink-600 text-white text-sm font-bold rounded-full mb-6">
              Shop Now
            </span>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-8 leading-tight">
              BUY SISTER<br />
              <span className="text-pink-600">FAVORITES</span>
            </h2>
            <p className="text-gray-600 text-xl lg:text-2xl leading-relaxed">
              Get the storage solutions our community loves most. 
              Limited stock, unlimited style.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Card 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <span className="absolute top-4 left-4 z-10 px-4 py-2 text-xs font-bold rounded-full bg-white text-blue-600 shadow-lg">
                  STARTER BUNDLE
                </span>
                <img 
                  src="/lovable-uploads/2a4c457a-7695-47d3-9912-ab2900c6ea25.png" 
                  alt="First Sister Set" 
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <svg className="h-4 w-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <svg className="h-4 w-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <svg className="h-4 w-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <svg className="h-4 w-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <span className="text-gray-500 text-xs font-medium">(89)</span>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">First Sister Set</h3>
                  <p className="text-gray-600 text-base">Perfect starter collection for new Sister Storage lovers</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Bundle Includes</p>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">2 Large (4 rods each) + 1 Medium (2 rods) + 1 Travel (1 rod)</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-gray-900">$89.99</span>
                      <span className="text-sm text-gray-400 line-through">$120.99</span>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">
                      Save $31.00
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-lg flex-shrink-0">
                      <div className="text-center">
                        <span className="text-xs font-bold uppercase tracking-wider block">Rods</span>
                        <span className="text-2xl font-thin">11</span>
                      </div>
                    </div>
                    
                    <button className="flex-1 bg-pink-600 text-white font-bold text-sm py-3 px-4 rounded-lg shadow-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      GET THIS BUNDLE
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <span className="absolute top-4 left-4 z-10 px-4 py-2 text-xs font-bold rounded-full bg-white text-emerald-600 shadow-lg">
                  TRAVEL READY
                </span>
                <img 
                  src="/lovable-uploads/76c5f6ac-f27b-4f26-8377-759dfc17c71d.png" 
                  alt="Small & Travel" 
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <svg className="h-4 w-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <svg className="h-4 w-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <svg className="h-4 w-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <svg className="h-4 w-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <span className="text-gray-500 text-xs font-medium">(124)</span>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">Small & Travel</h3>
                  <p className="text-gray-600 text-base">Compact, on-the-go storage for your adventures</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Bundle Includes</p>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">3 Travel boxes (1 rod each)</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-gray-900">$49.99</span>
                      <span className="text-sm text-gray-400 line-through">$60.99</span>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">
                      Save $11.00
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-lg flex-shrink-0">
                      <div className="text-center">
                        <span className="text-xs font-bold uppercase tracking-wider block">Rods</span>
                        <span className="text-2xl font-thin">3</span>
                      </div>
                    </div>
                    
                    <button className="flex-1 bg-pink-600 text-white font-bold text-sm py-3 px-4 rounded-lg shadow-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      GET THIS BUNDLE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-20">
            <button className="px-10 py-5 text-xl border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white font-bold transition-colors rounded-lg">
              View All Products
            </button>
            <p className="text-gray-500 text-base mt-6">Free shipping on orders over $50 • 30-day returns</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-8">
                <span className="inline-block px-6 py-3 bg-pink-100 text-pink-600 text-sm font-bold rounded-full">
                  ABOUT US
                </span>
                <h2 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                  DESIGNED BY<br />
                  <span className="text-pink-600">SISTERS</span><br />
                  FOR SISTERS
                </h2>
                <p className="text-gray-600 text-xl lg:text-2xl leading-relaxed">
                  We understand the unique challenges women face in staying organized. 
                  Our products are designed with love, tested by real sisters, and built to last.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">Quality Materials</h4>
                    <p className="text-gray-600 text-base">Premium materials that stand the test of time</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">Beautiful Design</h4>
                    <p className="text-gray-600 text-base">Functional doesn't mean boring - style meets utility</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">Sister Support</h4>
                    <p className="text-gray-600 text-base">Join a community of organized, empowered women</p>
                  </div>
                </div>
              </div>
              <button className="bg-pink-600 text-white px-10 py-5 rounded-lg font-bold hover:bg-pink-700 transition-colors mt-4">
                Learn Our Story
              </button>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/b32a7860-b957-41e7-9c5c-cbd348260cf2.png" 
                alt="About Sister Storage" 
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-r from-pink-600 to-rose-600">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto space-y-10">
            <h2 className="text-5xl lg:text-6xl font-black text-white">
              JOIN THE SISTER COMMUNITY
            </h2>
            <p className="text-pink-100 text-xl lg:text-2xl leading-relaxed">
              Get exclusive access to new products, organization tips, and sister stories delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-6 py-4 rounded-lg border-0 focus:ring-2 focus:ring-white/50 text-base"
              />
              <button className="bg-white text-pink-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-base">
                Subscribe
              </button>
            </div>
            <p className="text-pink-200 text-base mt-6">
              No spam, just sister love. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black">SISTER</span>
                <span className="text-sm text-gray-400">STORAGE</span>
              </div>
              <p className="text-gray-400">
                Beautiful, functional storage solutions designed by sisters, for sisters.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-bold text-lg">Shop</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">All Products</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Bundles</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Travel Collection</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Home Essentials</a>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-bold text-lg">Company</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">About Us</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Our Story</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Blog</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-bold text-lg">Support</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Shipping Info</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Returns</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Size Guide</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-12 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Sister Storage. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.215.082.334-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.163-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home2;