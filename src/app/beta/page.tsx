      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Info */}
          <div>
            <h1 className="text-4xl font-bold mb-6" style={{ color: '#fb923c' }}>
              Join the BBQ Revolution
            </h1>
            
            <p className="text-xl text-orange-200 mb-8">
              Be among the first 50 pitmasters to shape the future of BBQ community. 
              Get exclusive access to premium recipes, live sessions, and direct feedback with our team.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-orange-100">Direct Chat Access</h3>
                  <p className="text-orange-200">
                    Chat directly with our team, share feedback, and get personalized BBQ advice.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-orange-100">Premium Access</h3>
                  <p className="text-orange-200">
                    Free access to all premium recipes, tools, and features during the beta period.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-orange-100">Early Access</h3>
                  <p className="text-orange-200">
                    Be the first to try new features and influence product development.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-8">
              <h3 className="font-semibold text-lg mb-3 text-orange-100">Beta Program Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-orange-200 text-sm">Total Applications</p>
                  <p className="text-2xl font-bold text-orange-100">{betaStats.totalSignups}</p>
                </div>
                <div>
                  <p className="text-orange-200 text-sm">Active Testers</p>
                  <p className="text-2xl font-bold text-orange-100">{betaStats.approvedTesters}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-orange-600 mb-6">
              Apply for Beta Access
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-600 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-600 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-600 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-600 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-600 mb-2">
                  BBQ Experience Level *
                </label>
                <select
                  required
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select your level</option>
                  <option value="beginner">Beginner (Just starting out)</option>
                  <option value="intermediate">Intermediate (1-3 years experience)</option>
                  <option value="advanced">Advanced (3+ years, regular smoking)</option>
                  <option value="professional">Professional (Pitmaster/Restaurant)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-600 mb-2">
                  What BBQ equipment do you have? *
                </label>
                <textarea
                  required
                  value={formData.equipment}
                  onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                  placeholder="e.g., Weber Kettle, Big Green Egg, Offset smoker, Pellet grill..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-600 mb-3">
                  What are you most interested in? (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {interestOptions.map((interest) => (
                    <label key={interest} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleInterestChange(interest)}
                        className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-orange-600">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-600 mb-2">
                  Why do you want to join the Que-Munity beta? *
                </label>
                <textarea
                  required
                  value={formData.motivation}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                  placeholder="Tell us about your BBQ passion and what you hope to get from the platform..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent h-24 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || betaStats.spotsRemaining <= 0}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Application...
                  </div>
                ) : (
                  `Apply for Beta Access (${betaStats.spotsRemaining} spots left)`
                )}
              </button>

              <p className="text-xs text-orange-500 text-center">
                * Required fields. We'll review applications within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}