-- Update Multipurpose Box product images
UPDATE woocommerce_products
SET images = '[
  {
    "id": 1,
    "src": "/lovable-uploads/multipurpose-box-1.jpg",
    "name": "multipurpose-box-1.jpg",
    "alt": "Multipurpose Box - Adjustable compartments for jewelry organization"
  },
  {
    "id": 2,
    "src": "/lovable-uploads/multipurpose-box-2.jpg",
    "name": "multipurpose-box-2.jpg",
    "alt": "Multipurpose Box - Large jewelry storage with customizable dividers"
  },
  {
    "id": 3,
    "src": "/lovable-uploads/multipurpose-box-3.jpg",
    "name": "multipurpose-box-3.jpg",
    "alt": "Multipurpose Box - Versatile organizer for bangles and accessories"
  }
]'::jsonb,
updated_at = now()
WHERE id = 25814133;