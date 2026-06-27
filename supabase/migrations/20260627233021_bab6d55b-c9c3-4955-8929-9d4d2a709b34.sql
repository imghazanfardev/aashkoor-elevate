
-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Valves','Industrial Insulation')),
  featured_image TEXT,
  gallery_images TEXT[] NOT NULL DEFAULT '{}',
  short_description TEXT,
  full_description TEXT,
  specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  features TEXT[] NOT NULL DEFAULT '{}',
  applications TEXT[] NOT NULL DEFAULT '{}',
  datasheet_url TEXT,
  related_product_ids UUID[] NOT NULL DEFAULT '{}',
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published products"
  ON public.products FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins read all products"
  ON public.products FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins insert products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins update products"
  ON public.products FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins delete products"
  ON public.products FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- Blog posts
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT,
  featured_image TEXT,
  excerpt TEXT,
  content TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins read all posts"
  ON public.blog_posts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins insert posts"
  ON public.blog_posts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins update posts"
  ON public.blog_posts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins delete posts"
  ON public.blog_posts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER products_touch_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER blog_posts_touch_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed existing products
INSERT INTO public.products (slug, name, category, featured_image, short_description, full_description, specifications, applications, status, sort_order) VALUES
('stainless-steel-ball-valve-dn50','Stainless Steel Ball Valve – DN50','Valves','https://ik.imagekit.io/tn3yztqzbb/AASHKOOR%20VALVES%20FOLDER/Stainless-Steel-Ball-Valve-_-DN50.png','Three-piece SS316 ball valve, mirror polished.','Three-piece SS316 ball valve enabling in-line service. Mirror-polished body with PTFE seats — ideal for hygienic, chemical and process applications.','[{"label":"Body","value":"SS316"},{"label":"Pressure","value":"PN40"},{"label":"Seat","value":"PTFE"},{"label":"Connection","value":"Threaded BSP"},{"label":"Operation","value":"Lever / Actuator-ready"}]'::jsonb, ARRAY['Oil, gas & petrochemical facilities','Water treatment and desalination','Industrial HVAC and district cooling','Power generation','Marine & offshore'],'published',1),
('wafer-butterfly-valve-dn200','Wafer Butterfly Valve – DN200','Valves','https://ik.imagekit.io/tn3yztqzbb/AASHKOOR%20VALVES%20FOLDER/Wafer-Butterfly-Valve-_-DN200.png','EPDM-lined wafer butterfly with ductile body.','Lightweight wafer-type butterfly valve with EPDM liner. Excellent throttling and bubble-tight shut-off in water and HVAC applications.','[{"label":"Body","value":"Ductile iron GGG40"},{"label":"Liner","value":"EPDM"},{"label":"Pressure","value":"PN16"},{"label":"Disc","value":"SS316"},{"label":"Operation","value":"Handwheel / Gear"}]'::jsonb, ARRAY['Water treatment and desalination','Industrial HVAC and district cooling','Power generation'],'published',2),
('globe-valve-dn80','Globe Valve – DN80','Valves','https://ik.imagekit.io/tn3yztqzbb/AASHKOOR%20VALVES%20FOLDER/Globe-Valve-_-DN80.png','Precision flow regulation in steam service.','Cast steel globe valve engineered for precise flow control under high temperature and pressure — a workhorse for steam and process plants.','[{"label":"Body","value":"ASTM A216 WCB"},{"label":"Pressure","value":"CL300"},{"label":"Service","value":"Steam · Hot water · Oil"},{"label":"Connection","value":"Flanged RF"}]'::jsonb, ARRAY['Oil, gas & petrochemical facilities','Power generation','Industrial HVAC and district cooling'],'published',3),
('industrial-gate-valve-dn100','Industrial Gate Valve – DN100','Valves','https://ik.imagekit.io/tn3yztqzbb/AASHKOOR%20VALVES%20FOLDER/Industrial-Gate-Valve-_-DN100.png','API 600 cast steel gate valve with rising stem.','Engineered for full-bore isolation in high-pressure pipeline service. Forged steel body, bolted bonnet, and back-seat design for in-line maintenance.','[{"label":"Standard","value":"API 600"},{"label":"Body","value":"Cast steel ASTM A216 WCB"},{"label":"Pressure","value":"PN40 · CL300"},{"label":"Connection","value":"Flanged RF"},{"label":"Temperature","value":"−29°C to 425°C"}]'::jsonb, ARRAY['Oil, gas & petrochemical facilities','Power generation','Marine & offshore'],'published',4),
('swing-check-valve-dn150','Swing Check Valve – DN150','Valves','https://ik.imagekit.io/tn3yztqzbb/AASHKOOR%20VALVES%20FOLDER/Swing-Check-Valve-_-DN150.png','Low-pressure-drop reverse-flow prevention.','Cast iron swing check valve with bolted cover. Prevents reverse flow in pump discharge and pipeline systems while keeping pressure drop low.','[{"label":"Body","value":"Cast iron GG25"},{"label":"Pressure","value":"PN16"},{"label":"Connection","value":"Flanged RF"}]'::jsonb, ARRAY['Water treatment and desalination','Oil, gas & petrochemical facilities'],'published',5);

-- Insulation seed (loop via SQL)
INSERT INTO public.products (slug, name, category, featured_image, short_description, full_description, specifications, applications, status, sort_order)
SELECT
  lower(regexp_replace(regexp_replace(n, '[()]', '', 'g'), '[^a-zA-Z0-9]+', '-', 'g')),
  n,
  'Industrial Insulation',
  'https://ik.imagekit.io/tn3yztqzbb/AASHKOOR%20INSULATION%20FOLDER/' || replace(replace(replace(n,'(',''),')',''),' ','-') || '.png',
  n || ' — high-performance industrial insulation system.',
  n || ' is part of the AASHKOOR insulation range — engineered for thermal, acoustic and fire performance across industrial, commercial and HVAC applications. Suitable for pipes, ducts, equipment and building envelopes.',
  '[{"label":"Category","value":"Insulation Products"},{"label":"Application","value":"Industrial · HVAC · Building"},{"label":"Service","value":"Thermal · Acoustic · Fire"}]'::jsonb,
  ARRAY['Industrial HVAC and district cooling','Power generation','Oil, gas & petrochemical facilities'],
  'published',
  100 + row_number() OVER ()
FROM (VALUES
  ('Rock Proof H'),('Rock One'),('Rock Plus'),('Supreme Flex Pipes'),('Rock Seal 777'),
  ('Supreme Flex Rolls'),('Rock Plast'),('Rock Seal 777 Mix'),('Rock Torch'),
  ('Mineral Wool Blankets (Rolls)'),('Mineral Wool Pipe Sections'),('Rock Seal 777 Elastic'),
  ('Mineral Wool Boards (Slabs)'),('Rock Shield'),('Rock Proof'),('Rock Star'),
  ('Rock Flex'),('Rock Pro')
) AS t(n);
