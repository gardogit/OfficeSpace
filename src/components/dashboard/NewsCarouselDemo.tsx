import React from 'react';
import { NewsCarousel } from './NewsCarousel';
import mockData from '../../data/mockData.json';

/**
 * Demo component showing NewsCarousel integration with mock data
 * This demonstrates how the component would be used in the main dashboard
 */
export const NewsCarouselDemo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        NewsCarousel Demo
      </h1>
      
      <div className="space-y-8">
        {/* Default NewsCarousel with auto-rotation */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Default Configuration (Auto-rotation enabled)
          </h2>
          <NewsCarousel news={mockData.news} />
        </section>

        {/* NewsCarousel without auto-rotation */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Manual Navigation Only (Auto-rotation disabled)
          </h2>
          <NewsCarousel 
            news={mockData.news} 
            autoRotate={false}
          />
        </section>

        {/* NewsCarousel with custom interval */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Fast Auto-rotation (2 second interval)
          </h2>
          <NewsCarousel 
            news={mockData.news} 
            autoRotateInterval={2000}
          />
        </section>

        {/* Single article */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Single Article (No navigation controls)
          </h2>
          <NewsCarousel 
            news={[mockData.news[0]]} 
          />
        </section>

        {/* Empty state */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Empty State
          </h2>
          <NewsCarousel news={[]} />
        </section>
      </div>
    </div>
  );
};

export default NewsCarouselDemo;