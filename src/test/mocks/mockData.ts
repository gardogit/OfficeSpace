export const mockData = {
  currentUser: {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan.perez@empresa.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    department: 'Tecnología',
    role: 'Desarrollador Senior'
  },
  news: [
    {
      id: '1',
      title: 'Nueva política de trabajo remoto',
      summary: 'La empresa anuncia cambios en la política de trabajo remoto para mejorar la flexibilidad laboral.',
      content: 'Contenido completo del artículo...',
      author: 'María García',
      publishDate: '2024-01-15T10:00:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=400&fit=crop',
      category: 'Políticas'
    },
    {
      id: '2',
      title: 'Lanzamiento de nueva plataforma interna',
      summary: 'Presentamos la nueva plataforma de gestión interna que mejorará la productividad del equipo.',
      content: 'Contenido completo del artículo...',
      author: 'Carlos López',
      publishDate: '2024-01-14T14:30:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      category: 'Tecnología'
    },
    {
      id: '3',
      title: 'Resultados del trimestre Q4 2023',
      summary: 'Excelentes resultados financieros para el último trimestre del año 2023.',
      content: 'Contenido completo del artículo...',
      author: 'Ana Martínez',
      publishDate: '2024-01-13T09:15:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
      category: 'Finanzas'
    }
  ],
  events: [
    {
      id: '1',
      title: 'Reunión mensual de equipo',
      description: 'Revisión de objetivos y planificación para el próximo mes.',
      startDate: '2024-01-20T10:00:00Z',
      endDate: '2024-01-20T11:30:00Z',
      location: 'Sala de conferencias A',
      organizer: 'María García',
      attendees: 15
    },
    {
      id: '2',
      title: 'Workshop de desarrollo profesional',
      description: 'Taller sobre nuevas tecnologías y metodologías de desarrollo.',
      startDate: '2024-01-22T14:00:00Z',
      endDate: '2024-01-22T17:00:00Z',
      location: 'Auditorio principal',
      organizer: 'Carlos López',
      attendees: 30
    }
  ],
  newHires: [
    {
      id: '1',
      name: 'Laura Rodríguez',
      position: 'Diseñadora UX',
      department: 'Diseño',
      startDate: '2024-01-15T00:00:00Z',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9e0e4b0?w=150&h=150&fit=crop&crop=face',
      bio: 'Especialista en experiencia de usuario con 5 años de experiencia.'
    },
    {
      id: '2',
      name: 'Roberto Silva',
      position: 'Analista de Datos',
      department: 'Tecnología',
      startDate: '2024-01-10T00:00:00Z',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Experto en análisis de datos y machine learning.'
    }
  ]
};