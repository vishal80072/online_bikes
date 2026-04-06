--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2026-04-06 12:33:26

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 847 (class 1247 OID 16456)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'user'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16469)
-- Name: bikes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bikes (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    brand character varying(100) NOT NULL,
    model character varying(100) NOT NULL,
    category character varying(50) NOT NULL,
    engine_cc integer,
    price_per_day double precision NOT NULL,
    price_purchase double precision,
    color character varying(50),
    mileage double precision,
    fuel_type character varying(30),
    description text,
    features text,
    image_url character varying(500),
    available boolean,
    stock integer,
    is_deleted boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.bikes OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16461)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying NOT NULL,
    hashed_password character varying NOT NULL,
    full_name character varying,
    role public.user_role NOT NULL,
    is_active boolean
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4908 (class 0 OID 16469)
-- Dependencies: 218
-- Data for Name: bikes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bikes VALUES ('a8be494e-6792-4c2a-a163-af5fb32429ce', 'Yamaha 350', 'Yamaha', 'Mar 2025', 'sport', 350, 100, 900000, 'Red', 20, 'petrol', '', '', 'https://bringatrailer.com/wp-content/uploads/2023/03/1982_yamaha_rd350-lc_1982_yamaha_rd350-lc_857569b3-180a-443e-aa37-2ec17bab2e55-fwvH2M-40306-40307-scaled.jpg', true, 5, false, '2026-04-06 10:44:14.940169+05:30', NULL);
INSERT INTO public.bikes VALUES ('e7d5fa61-8806-46e1-a473-7ce244bdbf27', 'Garden Vintage', 'TVS', 'Mar-2026', 'adventure', 220, 300, 600000, 'Black', 12, 'electric', '', '', 'https://i.pinimg.com/originals/6b/57/f2/6b57f25badecb30af1d39f2467cc79b1.jpg', true, 6, false, '2026-04-06 10:45:41.179988+05:30', '2026-04-06 11:00:18.074293+05:30');
INSERT INTO public.bikes VALUES ('5e2598cf-9c38-4afb-8acc-f27989f6293d', 'RX100-Vintage', 'Yamaha', 'RX100', 'cruiser', 150, 100, 100000, 'Green', 25, 'electric', '', '', 'https://wallpapercave.com/wp/wp4656628.jpg', true, 2, false, '2026-04-06 11:15:01.876532+05:30', '2026-04-06 11:19:30.693084+05:30');


--
-- TOC entry 4907 (class 0 OID 16461)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES ('d0d54559-0a46-486a-8206-b43bb27534df', 'admin@bikebook.com', '$argon2id$v=19$m=65536,t=3,p=4$plQKoXTOee+dkzImpPR+zw$664/Y21qgxVNMXqGww8roRTpAA6w9SYkZbnCE0hYyfE', 'Super Admin', 'admin', true);
INSERT INTO public.users VALUES ('a3ede18c-0363-4a38-bd51-359fa60eaa73', 'vishal@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$n/O+F0LImRPCmFNqbe2dkw$zyxykzV8bNy04lb/OQU7JWqFIPjon6s7Z82voN/A/zo', 'Vishal Surgade', 'user', true);


--
-- TOC entry 4758 (class 2606 OID 16476)
-- Name: bikes bikes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bikes
    ADD CONSTRAINT bikes_pkey PRIMARY KEY (id);


--
-- TOC entry 4756 (class 2606 OID 16467)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4759 (class 1259 OID 16479)
-- Name: ix_bikes_brand; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_bikes_brand ON public.bikes USING btree (brand);


--
-- TOC entry 4760 (class 1259 OID 16477)
-- Name: ix_bikes_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_bikes_category ON public.bikes USING btree (category);


--
-- TOC entry 4761 (class 1259 OID 16478)
-- Name: ix_bikes_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_bikes_name ON public.bikes USING btree (name);


--
-- TOC entry 4754 (class 1259 OID 16468)
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


-- Completed on 2026-04-06 12:33:26

--
-- PostgreSQL database dump complete
--

