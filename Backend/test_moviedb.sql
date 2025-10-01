drop table if exists group_invites;
drop table if exists group_members;
drop table if exists group_movies;
drop table if exists groups;
drop table if exists user_ratings;
drop table if exists user_reviews;
drop table if exists user_watchlist;
drop table if exists users;

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: group_invites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_invites (
    id integer NOT NULL,
    groupid integer NOT NULL,
    user_id integer NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.group_invites OWNER TO postgres;

--
-- Name: group_invites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.group_invites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.group_invites_id_seq OWNER TO postgres;

--
-- Name: group_invites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.group_invites_id_seq OWNED BY public.group_invites.id;


--
-- Name: group_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_members (
    id integer NOT NULL,
    user_id integer NOT NULL,
    memberof integer NOT NULL,
    joined timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.group_members OWNER TO postgres;

--
-- Name: group_members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.group_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.group_members_id_seq OWNER TO postgres;

--
-- Name: group_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.group_members_id_seq OWNED BY public.group_members.id;


--
-- Name: group_movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_movies (
    id integer NOT NULL,
    group_id integer NOT NULL,
    theatername character varying NOT NULL,
    auditoriumname character varying,
    title character varying NOT NULL,
    show_start_time timestamp without time zone NOT NULL,
    runtime integer,
    year integer,
    finnkinourl character varying,
    imageurl character varying
);


ALTER TABLE public.group_movies OWNER TO postgres;

--
-- Name: group_movies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.group_movies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.group_movies_id_seq OWNER TO postgres;

--
-- Name: group_movies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.group_movies_id_seq OWNED BY public.group_movies.id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    owner integer NOT NULL,
    description text
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.groups_id_seq OWNER TO postgres;

--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- Name: user_ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_ratings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    movie_id character varying(255) NOT NULL,
    rating integer NOT NULL,
    CONSTRAINT user_ratings_rating_check CHECK (((rating >= 0) AND (rating <= 10)))
);


ALTER TABLE public.user_ratings OWNER TO postgres;

--
-- Name: user_ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_ratings_id_seq OWNER TO postgres;

--
-- Name: user_ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_ratings_id_seq OWNED BY public.user_ratings.id;


--
-- Name: user_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_reviews (
    id integer NOT NULL,
    user_id integer NOT NULL,
    movie_id character varying(255) NOT NULL,
    review_text text,
    created timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_reviews OWNER TO postgres;

--
-- Name: user_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_reviews_id_seq OWNER TO postgres;

--
-- Name: user_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_reviews_id_seq OWNED BY public.user_reviews.id;


--
-- Name: user_watchlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_watchlist (
    id integer NOT NULL,
    user_id integer NOT NULL,
    movie_id character varying(255) NOT NULL,
    status character varying(50) DEFAULT 'planned'::character varying NOT NULL,
    favorite boolean DEFAULT false NOT NULL
);


ALTER TABLE public.user_watchlist OWNER TO postgres;

--
-- Name: user_watchlist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_watchlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_watchlist_id_seq OWNER TO postgres;

--
-- Name: user_watchlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_watchlist_id_seq OWNED BY public.user_watchlist.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    user_uuid uuid NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    hashed_password text NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: group_invites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_invites ALTER COLUMN id SET DEFAULT nextval('public.group_invites_id_seq'::regclass);


--
-- Name: group_members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members ALTER COLUMN id SET DEFAULT nextval('public.group_members_id_seq'::regclass);


--
-- Name: group_movies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_movies ALTER COLUMN id SET DEFAULT nextval('public.group_movies_id_seq'::regclass);


--
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- Name: user_ratings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_ratings ALTER COLUMN id SET DEFAULT nextval('public.user_ratings_id_seq'::regclass);


--
-- Name: user_reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_reviews ALTER COLUMN id SET DEFAULT nextval('public.user_reviews_id_seq'::regclass);


--
-- Name: user_watchlist id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_watchlist ALTER COLUMN id SET DEFAULT nextval('public.user_watchlist_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: group_invites; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: group_members; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: group_movies; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_watchlist; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, 'c81a239c-1fc9-4c86-9860-6281164a754e', 'testuser', 'testuser@example.com', 'testpasswordhash', '2025-09-04 16:49:58.673996');
INSERT INTO public.users VALUES (3, '7ab03233-3c6e-4d60-9057-594e83aec2a2', 'testiuser1234', 'foo@foo.com', '$2b$10$r7o3BzCWgGz9kg2Bq9lE8.cl/Gg7lKyIIlU.7HNM0NCjG8ZGCBLv.', '2025-09-06 15:56:25.887593');
INSERT INTO public.users VALUES (4, 'be8a972d-d556-4b76-987c-1315a38168f8', 'testiuser12345', 'foo2@foo.com', '$2b$10$68/mQgeXdtDYGtPi4tUZDeVP071taq.mdkQYY4Ka2P7lrBqeNpu5W', '2025-09-06 16:01:12.037344');
INSERT INTO public.users VALUES (5, '9639091f-72b6-4917-87cf-dc7f49f2d1bf', 'testiusdder12345', 'foo4@foo.com', '$2b$10$R3W0zJHU3mh0DQ.935SB.OLbSnFFW2.eEd6tG2mZN9UC0aDXhigj.', '2025-09-06 16:05:08.393695');
INSERT INTO public.users VALUES (6, '25807c06-eadd-47e3-a559-adf814c9b1b8', 'testiusdsdsder12345', 'foo5@foo.com', '$2b$10$5tewLTPFDKDVB6Z.NfGh3e8IcXnPF1k22FYvGjIvTyE0SptNtqmcK', '2025-09-07 15:02:30.46849');
INSERT INTO public.users VALUES (7, '8df36af4-313e-4c78-a370-37224e59c6cb', 'testder12345', 'foo235@foo.com', '$2b$10$OVwODxcBuKtr71XikaTneeDlPbm1N2Sc.4cTgVIfz1LaanXazyxtO', '2025-09-07 15:05:45.980646');


--
-- Name: group_invites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.group_invites_id_seq', 1, false);


--
-- Name: group_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.group_members_id_seq', 1, false);


--
-- Name: group_movies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.group_movies_id_seq', 1, false);


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groups_id_seq', 1, false);


--
-- Name: user_ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_ratings_id_seq', 1, false);


--
-- Name: user_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_reviews_id_seq', 1, false);


--
-- Name: user_watchlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_watchlist_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: group_invites group_invites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_invites
    ADD CONSTRAINT group_invites_pkey PRIMARY KEY (id);


--
-- Name: group_members group_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_pkey PRIMARY KEY (id);


--
-- Name: group_movies group_movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_movies
    ADD CONSTRAINT group_movies_pkey PRIMARY KEY (id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: group_members unique_member; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT unique_member UNIQUE (user_id, memberof);


--
-- Name: user_watchlist unique_watchlist; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_watchlist
    ADD CONSTRAINT unique_watchlist UNIQUE (user_id, movie_id);


--
-- Name: user_ratings user_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_ratings
    ADD CONSTRAINT user_ratings_pkey PRIMARY KEY (id);


--
-- Name: user_reviews user_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_reviews
    ADD CONSTRAINT user_reviews_pkey PRIMARY KEY (id);


--
-- Name: user_watchlist user_watchlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_watchlist
    ADD CONSTRAINT user_watchlist_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: group_invites group_invites_groupid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_invites
    ADD CONSTRAINT group_invites_groupid_fkey FOREIGN KEY (groupid) REFERENCES public.groups(id) ON DELETE CASCADE;


--
-- Name: group_invites group_invites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_invites
    ADD CONSTRAINT group_invites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: group_members group_members_memberof_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_memberof_fkey FOREIGN KEY (memberof) REFERENCES public.groups(id) ON DELETE CASCADE;


--
-- Name: group_members group_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: group_movies group_movies_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_movies
    ADD CONSTRAINT group_movies_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: groups groups_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_owner_fkey FOREIGN KEY (owner) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_ratings user_ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_ratings
    ADD CONSTRAINT user_ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_reviews user_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_reviews
    ADD CONSTRAINT user_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_watchlist user_watchlist_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_watchlist
    ADD CONSTRAINT user_watchlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
