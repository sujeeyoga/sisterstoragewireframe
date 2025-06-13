
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AnimatedText from '@/components/ui/animated-text';

const ContentPage = () => {
  const { slug } = useParams();

  const contentMap: Record<string, { title: string; description: string; content: string }> = {
    'workspace-organization': {
      title: 'Workspace Organization',
      description: 'Creating productive and organized workspaces that inspire creativity.',
      content: 'Transform your workspace into a hub of productivity and inspiration. Our approach to workspace organization combines functionality with aesthetic appeal, ensuring every item has its place while maintaining the cultural elements that make your space uniquely yours.'
    },
    'living-spaces': {
      title: 'Living Spaces',
      description: 'Modern living room designs that balance comfort with organization.',
      content: 'Your living space should reflect your personality while maintaining order and functionality. We focus on creating environments where cultural heritage meets modern design principles, resulting in spaces that are both beautiful and highly functional.'
    },
    'digital-organization': {
      title: 'Digital Organization',
      description: 'Organizing your digital life with the same care as your physical space.',
      content: 'Digital organization is just as important as physical organization. Learn how to streamline your digital workflows, organize your files, and create systems that support both your personal and professional goals while maintaining cultural connections.'
    },
    'collaborative-spaces': {
      title: 'Collaborative Spaces',
      description: 'Designing spaces that foster collaboration and community.',
      content: 'Collaborative spaces bring people together while maintaining organization and cultural identity. These environments encourage teamwork, creativity, and community building while respecting individual needs and cultural backgrounds.'
    },
    'creative-inspiration': {
      title: 'Creative Inspiration',
      description: 'Finding inspiration in organized, culturally-rich environments.',
      content: 'Creativity flourishes in organized environments that honor cultural heritage. Discover how to create spaces that inspire innovation while maintaining connection to your roots and providing the structure needed for creative work.'
    },
    'desk-organization': {
      title: 'Desk Organization',
      description: 'Perfecting your desk setup for maximum productivity and style.',
      content: 'A well-organized desk is the foundation of productivity. Learn how to create a desk setup that not only maximizes efficiency but also incorporates elements of your cultural identity, making your workspace both functional and personally meaningful.'
    }
  };

  const content = contentMap[slug || ''] || {
    title: 'Content Not Found',
    description: 'The requested content could not be found.',
    content: 'Please return to the main page and try again.'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          to="/brand"
          className="w-12 h-12 bg-black text-white hover:bg-[#E90064] flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 shadow-lg"
          style={{ borderRadius: '0px' }}
          aria-label="Back to brand page"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      {/* Content */}
      <div className="container-custom pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedText
            as="h1"
            className="text-4xl md:text-5xl font-bold mb-6 font-poppins text-black"
            animation="breath-fade-up"
          >
            {content.title}
          </AnimatedText>
          
          <AnimatedText
            as="p"
            className="text-xl text-gray-600 mb-12 font-poppins"
            animation="breath-fade-up-2"
          >
            {content.description}
          </AnimatedText>

          <div className="bg-[#E90064] p-8 md:p-12 text-white mb-12" style={{ borderRadius: '0px' }}>
            <AnimatedText
              as="p"
              className="text-lg leading-relaxed font-poppins"
              animation="breath-fade-up-3"
            >
              {content.content}
            </AnimatedText>
          </div>

          <AnimatedText
            as="div"
            className="text-center"
            animation="breath-fade-up-4"
            container
          >
            <Link
              to="/brand"
              className="inline-block bg-black text-white px-8 py-4 font-semibold uppercase font-poppins hover:bg-[#E90064] transition-colors duration-300"
              style={{ borderRadius: '0px' }}
            >
              Back to Brand Guide
            </Link>
          </AnimatedText>
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
