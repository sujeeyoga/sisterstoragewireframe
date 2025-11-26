import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProductData {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  regular_price?: number;
  sale_price?: number;
  stock_quantity?: number;
  manage_stock?: boolean;
  in_stock?: boolean;
  visible?: boolean;
  images?: any[];
  categories?: any[];
  attributes?: any[];
  meta_data?: any;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  package_value?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, product } = await req.json() as { 
      action: 'create' | 'update' | 'delete',
      product: ProductData 
    };

    console.log('Product management request:', { action, productId: product?.id, productName: product?.name });

    // Validate required fields for create/update
    if ((action === 'create' || action === 'update') && !product) {
      return new Response(
        JSON.stringify({ error: 'Product data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if ((action === 'create' || action === 'update')) {
      if (!product.name || !product.slug || product.price === undefined) {
        return new Response(
          JSON.stringify({ error: 'Name, slug, and price are required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    let result;

    switch (action) {
      case 'create': {
        // Generate ID if not provided
        const productId = product.id || Math.floor(Date.now() / 1000);
        
        const { data, error } = await supabaseClient
          .from('woocommerce_products')
          .insert({
            id: productId,
            name: product.name,
            slug: product.slug,
            description: product.description || '',
            short_description: product.short_description || '',
            price: product.price,
            regular_price: product.regular_price || product.price,
            sale_price: product.sale_price || null,
            stock_quantity: product.stock_quantity ?? 50,
            manage_stock: product.manage_stock ?? true,
            in_stock: product.in_stock ?? true,
            visible: product.visible ?? true,
            images: product.images || [],
            categories: product.categories || [],
            attributes: product.attributes || [],
            meta_data: product.meta_data || {},
            weight: product.weight || 0,
            length: product.length || 0,
            width: product.width || 0,
            height: product.height || 0,
            package_value: product.package_value || product.price,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating product:', error);
          return new Response(
            JSON.stringify({ error: `Failed to create product: ${error.message}` }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        result = data;
        console.log('Product created successfully:', result.id);
        break;
      }

      case 'update': {
        if (!product.id) {
          return new Response(
            JSON.stringify({ error: 'Product ID is required for update' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const updateData: any = {};
        if (product.name !== undefined) updateData.name = product.name;
        if (product.slug !== undefined) updateData.slug = product.slug;
        if (product.description !== undefined) updateData.description = product.description;
        if (product.short_description !== undefined) updateData.short_description = product.short_description;
        if (product.price !== undefined) updateData.price = product.price;
        if (product.regular_price !== undefined) updateData.regular_price = product.regular_price;
        if (product.sale_price !== undefined) updateData.sale_price = product.sale_price;
        if (product.stock_quantity !== undefined) updateData.stock_quantity = product.stock_quantity;
        if (product.manage_stock !== undefined) updateData.manage_stock = product.manage_stock;
        if (product.in_stock !== undefined) updateData.in_stock = product.in_stock;
        if (product.visible !== undefined) updateData.visible = product.visible;
        if (product.images !== undefined) updateData.images = product.images;
        if (product.categories !== undefined) updateData.categories = product.categories;
        if (product.attributes !== undefined) updateData.attributes = product.attributes;
        if (product.meta_data !== undefined) updateData.meta_data = product.meta_data;
        if (product.weight !== undefined) updateData.weight = product.weight;
        if (product.length !== undefined) updateData.length = product.length;
        if (product.width !== undefined) updateData.width = product.width;
        if (product.height !== undefined) updateData.height = product.height;
        if (product.package_value !== undefined) updateData.package_value = product.package_value;

        const { data, error } = await supabaseClient
          .from('woocommerce_products')
          .update(updateData)
          .eq('id', product.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating product:', error);
          return new Response(
            JSON.stringify({ error: `Failed to update product: ${error.message}` }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        result = data;
        console.log('Product updated successfully:', result.id);
        break;
      }

      case 'delete': {
        if (!product.id) {
          return new Response(
            JSON.stringify({ error: 'Product ID is required for delete' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error } = await supabaseClient
          .from('woocommerce_products')
          .delete()
          .eq('id', product.id);

        if (error) {
          console.error('Error deleting product:', error);
          return new Response(
            JSON.stringify({ error: `Failed to delete product: ${error.message}` }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        result = { success: true, id: product.id };
        console.log('Product deleted successfully:', product.id);
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action. Must be create, update, or delete' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in manage-product function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});