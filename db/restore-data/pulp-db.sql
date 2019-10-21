--
-- PostgreSQL database dump
--

-- Dumped from database version 11.4
-- Dumped by pg_dump version 11.4

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

SET default_with_oids = false;

--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auth_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auth_group_id_seq OWNED BY public.auth_group.id;


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auth_group_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auth_group_permissions_id_seq OWNED BY public.auth_group_permissions.id;


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auth_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;


--
-- Name: blogs_article; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blogs_article (
    title character varying(255) NOT NULL,
    permalink character varying(200) NOT NULL,
    date_published timestamp with time zone NOT NULL,
    author character varying(255) NOT NULL,
    file_link character varying(200) NOT NULL,
    blog_id integer NOT NULL,
    pdf_link character varying(200)
);


--
-- Name: blogs_article_magazine; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blogs_article_magazine (
    id integer NOT NULL,
    article_id character varying(200) NOT NULL,
    magazine_id character varying(200) NOT NULL
);


--
-- Name: blogs_article_magazine_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blogs_article_magazine_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blogs_article_magazine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blogs_article_magazine_id_seq OWNED BY public.blogs_article_magazine.id;


--
-- Name: blogs_blog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blogs_blog (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    last_polled_time timestamp with time zone,
    home_url character varying(200) NOT NULL,
    rss_url character varying(200) NOT NULL,
    scraped_old_posts boolean NOT NULL
);


--
-- Name: blogs_blog_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blogs_blog_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blogs_blog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blogs_blog_id_seq OWNED BY public.blogs_blog.id;


--
-- Name: blogs_blogblock; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blogs_blogblock (
    file_link character varying(200) NOT NULL,
    date_start timestamp with time zone NOT NULL,
    date_end timestamp with time zone NOT NULL,
    blog_id integer NOT NULL
);


--
-- Name: blogs_comment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blogs_comment (
    id integer NOT NULL,
    author character varying(100) NOT NULL,
    content character varying(100) NOT NULL,
    date_published character varying(8) NOT NULL,
    parent_comment_id integer NOT NULL,
    article_id character varying(200) NOT NULL
);


--
-- Name: blogs_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blogs_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blogs_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blogs_comment_id_seq OWNED BY public.blogs_comment.id;


--
-- Name: blogs_magazine; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blogs_magazine (
    date_start timestamp with time zone NOT NULL,
    date_end timestamp with time zone NOT NULL,
    file_link character varying(200) NOT NULL,
    owner_id integer NOT NULL
);


--
-- Name: blogs_subscription; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blogs_subscription (
    id integer NOT NULL,
    date_subscribed timestamp with time zone NOT NULL,
    blog_id integer NOT NULL,
    subscriber_id integer NOT NULL
);


--
-- Name: blogs_subscription_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blogs_subscription_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blogs_subscription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blogs_subscription_id_seq OWNED BY public.blogs_subscription.id;


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.django_admin_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;


--
-- Name: django_celery_beat_clockedschedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_clockedschedule (
    id integer NOT NULL,
    clocked_time timestamp with time zone NOT NULL,
    enabled boolean NOT NULL
);


--
-- Name: django_celery_beat_clockedschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.django_celery_beat_clockedschedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: django_celery_beat_clockedschedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.django_celery_beat_clockedschedule_id_seq OWNED BY public.django_celery_beat_clockedschedule.id;


--
-- Name: django_celery_beat_crontabschedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_crontabschedule (
    id integer NOT NULL,
    minute character varying(240) NOT NULL,
    hour character varying(96) NOT NULL,
    day_of_week character varying(64) NOT NULL,
    day_of_month character varying(124) NOT NULL,
    month_of_year character varying(64) NOT NULL,
    timezone character varying(63) NOT NULL
);


--
-- Name: django_celery_beat_crontabschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.django_celery_beat_crontabschedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: django_celery_beat_crontabschedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.django_celery_beat_crontabschedule_id_seq OWNED BY public.django_celery_beat_crontabschedule.id;


--
-- Name: django_celery_beat_intervalschedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_intervalschedule (
    id integer NOT NULL,
    every integer NOT NULL,
    period character varying(24) NOT NULL
);


--
-- Name: django_celery_beat_intervalschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.django_celery_beat_intervalschedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: django_celery_beat_intervalschedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.django_celery_beat_intervalschedule_id_seq OWNED BY public.django_celery_beat_intervalschedule.id;


--
-- Name: django_celery_beat_periodictask; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_periodictask (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    task character varying(200) NOT NULL,
    args text NOT NULL,
    kwargs text NOT NULL,
    queue character varying(200),
    exchange character varying(200),
    routing_key character varying(200),
    expires timestamp with time zone,
    enabled boolean NOT NULL,
    last_run_at timestamp with time zone,
    total_run_count integer NOT NULL,
    date_changed timestamp with time zone NOT NULL,
    description text NOT NULL,
    crontab_id integer,
    interval_id integer,
    solar_id integer,
    one_off boolean NOT NULL,
    start_time timestamp with time zone,
    priority integer,
    headers text NOT NULL,
    clocked_id integer,
    CONSTRAINT django_celery_beat_periodictask_priority_check CHECK ((priority >= 0)),
    CONSTRAINT django_celery_beat_periodictask_total_run_count_check CHECK ((total_run_count >= 0))
);


--
-- Name: django_celery_beat_periodictask_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.django_celery_beat_periodictask_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: django_celery_beat_periodictask_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.django_celery_beat_periodictask_id_seq OWNED BY public.django_celery_beat_periodictask.id;


--
-- Name: django_celery_beat_periodictasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_periodictasks (
    ident smallint NOT NULL,
    last_update timestamp with time zone NOT NULL
);


--
-- Name: django_celery_beat_solarschedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_celery_beat_solarschedule (
    id integer NOT NULL,
    event character varying(24) NOT NULL,
    latitude numeric(9,6) NOT NULL,
    longitude numeric(9,6) NOT NULL
);


--
-- Name: django_celery_beat_solarschedule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.django_celery_beat_solarschedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: django_celery_beat_solarschedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.django_celery_beat_solarschedule_id_seq OWNED BY public.django_celery_beat_solarschedule.id;


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.django_content_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_migrations (
    id integer NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.django_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


--
-- Name: payments_address; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments_address (
    id integer NOT NULL,
    line_1 character varying(500) NOT NULL,
    line_2 character varying(500),
    city character varying(100) NOT NULL,
    state character varying(100),
    zip character varying(100),
    country character varying(100) NOT NULL
);


--
-- Name: payments_address_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payments_address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_address_id_seq OWNED BY public.payments_address.id;


--
-- Name: payments_billinginfo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments_billinginfo (
    id integer NOT NULL,
    delivery_address_id integer,
    stripe_customer_id character varying(100),
    payment_tier_id integer,
    customer_id integer NOT NULL
);


--
-- Name: payments_billinginfo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_billinginfo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payments_billinginfo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_billinginfo_id_seq OWNED BY public.payments_billinginfo.id;


--
-- Name: payments_paymenttier; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments_paymenttier (
    id integer NOT NULL,
    tier_in_payment_option character varying(2) NOT NULL
);


--
-- Name: payments_paymenttier_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_paymenttier_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payments_paymenttier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_paymenttier_id_seq OWNED BY public.payments_paymenttier.id;


--
-- Name: users_customuser; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_customuser (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(30) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL,
    kindle_email_address character varying(254) NOT NULL
);


--
-- Name: users_customuser_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_customuser_groups (
    id integer NOT NULL,
    customuser_id integer NOT NULL,
    group_id integer NOT NULL
);


--
-- Name: users_customuser_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_customuser_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_customuser_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_customuser_groups_id_seq OWNED BY public.users_customuser_groups.id;


--
-- Name: users_customuser_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_customuser_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_customuser_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_customuser_id_seq OWNED BY public.users_customuser.id;


--
-- Name: users_customuser_user_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_customuser_user_permissions (
    id integer NOT NULL,
    customuser_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: users_customuser_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_customuser_user_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_customuser_user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_customuser_user_permissions_id_seq OWNED BY public.users_customuser_user_permissions.id;


--
-- Name: auth_group id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group ALTER COLUMN id SET DEFAULT nextval('public.auth_group_id_seq'::regclass);


--
-- Name: auth_group_permissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_group_permissions_id_seq'::regclass);


--
-- Name: auth_permission id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);


--
-- Name: blogs_article_magazine id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_article_magazine ALTER COLUMN id SET DEFAULT nextval('public.blogs_article_magazine_id_seq'::regclass);


--
-- Name: blogs_blog id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_blog ALTER COLUMN id SET DEFAULT nextval('public.blogs_blog_id_seq'::regclass);


--
-- Name: blogs_comment id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_comment ALTER COLUMN id SET DEFAULT nextval('public.blogs_comment_id_seq'::regclass);


--
-- Name: blogs_subscription id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_subscription ALTER COLUMN id SET DEFAULT nextval('public.blogs_subscription_id_seq'::regclass);


--
-- Name: django_admin_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);


--
-- Name: django_celery_beat_clockedschedule id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_clockedschedule ALTER COLUMN id SET DEFAULT nextval('public.django_celery_beat_clockedschedule_id_seq'::regclass);


--
-- Name: django_celery_beat_crontabschedule id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_crontabschedule ALTER COLUMN id SET DEFAULT nextval('public.django_celery_beat_crontabschedule_id_seq'::regclass);


--
-- Name: django_celery_beat_intervalschedule id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_intervalschedule ALTER COLUMN id SET DEFAULT nextval('public.django_celery_beat_intervalschedule_id_seq'::regclass);


--
-- Name: django_celery_beat_periodictask id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask ALTER COLUMN id SET DEFAULT nextval('public.django_celery_beat_periodictask_id_seq'::regclass);


--
-- Name: django_celery_beat_solarschedule id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_solarschedule ALTER COLUMN id SET DEFAULT nextval('public.django_celery_beat_solarschedule_id_seq'::regclass);


--
-- Name: django_content_type id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);


--
-- Name: django_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);


--
-- Name: payments_address id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments_address ALTER COLUMN id SET DEFAULT nextval('public.payments_address_id_seq'::regclass);


--
-- Name: payments_billinginfo id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments_billinginfo ALTER COLUMN id SET DEFAULT nextval('public.payments_billinginfo_id_seq'::regclass);


--
-- Name: payments_paymenttier id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments_paymenttier ALTER COLUMN id SET DEFAULT nextval('public.payments_paymenttier_id_seq'::regclass);


--
-- Name: users_customuser id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_customuser ALTER COLUMN id SET DEFAULT nextval('public.users_customuser_id_seq'::regclass);


--
-- Name: users_customuser_groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_customuser_groups ALTER COLUMN id SET DEFAULT nextval('public.users_customuser_groups_id_seq'::regclass);


--
-- Name: users_customuser_user_permissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_customuser_user_permissions ALTER COLUMN id SET DEFAULT nextval('public.users_customuser_user_permissions_id_seq'::regclass);


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	2	add_permission
6	Can change permission	2	change_permission
7	Can delete permission	2	delete_permission
8	Can view permission	2	view_permission
9	Can add group	3	add_group
10	Can change group	3	change_group
11	Can delete group	3	delete_group
12	Can view group	3	view_group
13	Can add content type	4	add_contenttype
14	Can change content type	4	change_contenttype
15	Can delete content type	4	delete_contenttype
16	Can view content type	4	view_contenttype
17	Can add session	5	add_session
18	Can change session	5	change_session
19	Can delete session	5	delete_session
20	Can view session	5	view_session
21	Can add comment	6	add_comment
22	Can change comment	6	change_comment
23	Can delete comment	6	delete_comment
24	Can view comment	6	view_comment
25	Can add article	7	add_article
26	Can change article	7	change_article
27	Can delete article	7	delete_article
28	Can view article	7	view_article
29	Can add blog	8	add_blog
30	Can change blog	8	change_blog
31	Can delete blog	8	delete_blog
32	Can view blog	8	view_blog
33	Can add subscription	9	add_subscription
34	Can change subscription	9	change_subscription
35	Can delete subscription	9	delete_subscription
36	Can view subscription	9	view_subscription
37	Can add payment tier	10	add_paymenttier
38	Can change payment tier	10	change_paymenttier
39	Can delete payment tier	10	delete_paymenttier
40	Can view payment tier	10	view_paymenttier
41	Can add transaction	11	add_transaction
42	Can change transaction	11	change_transaction
43	Can delete transaction	11	delete_transaction
44	Can view transaction	11	view_transaction
45	Can add billing info	12	add_billinginfo
46	Can change billing info	12	change_billinginfo
47	Can delete billing info	12	delete_billinginfo
48	Can view billing info	12	view_billinginfo
49	Can add user	13	add_customuser
50	Can change user	13	change_customuser
51	Can delete user	13	delete_customuser
52	Can view user	13	view_customuser
53	Can add magazine	14	add_magazine
54	Can change magazine	14	change_magazine
55	Can delete magazine	14	delete_magazine
56	Can view magazine	14	view_magazine
57	Can add blog block	15	add_blogblock
58	Can change blog block	15	change_blogblock
59	Can delete blog block	15	delete_blogblock
60	Can view blog block	15	view_blogblock
61	Can add address	16	add_address
62	Can change address	16	change_address
63	Can delete address	16	delete_address
64	Can view address	16	view_address
65	Can add stripe token	17	add_stripetoken
66	Can change stripe token	17	change_stripetoken
67	Can delete stripe token	17	delete_stripetoken
68	Can view stripe token	17	view_stripetoken
69	Can add crontab	18	add_crontabschedule
70	Can change crontab	18	change_crontabschedule
71	Can delete crontab	18	delete_crontabschedule
72	Can view crontab	18	view_crontabschedule
73	Can add interval	19	add_intervalschedule
74	Can change interval	19	change_intervalschedule
75	Can delete interval	19	delete_intervalschedule
76	Can view interval	19	view_intervalschedule
77	Can add periodic task	20	add_periodictask
78	Can change periodic task	20	change_periodictask
79	Can delete periodic task	20	delete_periodictask
80	Can view periodic task	20	view_periodictask
81	Can add periodic tasks	21	add_periodictasks
82	Can change periodic tasks	21	change_periodictasks
83	Can delete periodic tasks	21	delete_periodictasks
84	Can view periodic tasks	21	view_periodictasks
85	Can add solar event	22	add_solarschedule
86	Can change solar event	22	change_solarschedule
87	Can delete solar event	22	delete_solarschedule
88	Can view solar event	22	view_solarschedule
89	Can add clocked	23	add_clockedschedule
90	Can change clocked	23	change_clockedschedule
91	Can delete clocked	23	delete_clockedschedule
92	Can view clocked	23	view_clockedschedule
\.


--
-- Data for Name: blogs_article; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blogs_article (title, permalink, date_published, author, file_link, blog_id, pdf_link) FROM stdin;
Predictable Identities: 18 – Self-consistency	https://www.ribbonfarm.com/2019/10/02/predictable-identities-18-self-consistency/	2019-10-02 11:00:23-07	Jacob Falkovich	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/3956614653613951308.html	190	\N
Letter from a Pakistani Homeschooler, by Bryan Caplan	https://www.econlib.org/letter-from-a-pakistani-homeschooler/	2019-10-03 06:42:14-07	Bryan Caplan	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/bryan_caplan_econlib/-1691487123524057068.html	205	\N
Making a Bad Situation Worse: Where Lee’s Right and Where Lee’s Wrong, by Bryan Caplan	https://www.econlib.org/making-a-bad-situation-worse-where-lees-right-and-where-lees-wrong/	2019-10-02 07:55:44-07	Bryan Caplan	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/bryan_caplan_econlib/2707635732616402284.html	205	\N
Making the Best of a Bad Situation? Gary Lee on the Decline of Marriage, by Bryan Caplan	https://www.econlib.org/making-the-best-of-a-bad-situation-gary-lee-on-the-decline-of-marriage/	2019-10-01 08:14:15-07	Bryan Caplan	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/bryan_caplan_econlib/2602033147900642786.html	205	\N
The Not-So-Just World Hypothesis, by Bryan Caplan	https://www.econlib.org/the-not-so-just-world-hypothesis/	2019-09-30 05:24:28-07	Bryan Caplan	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/bryan_caplan_econlib/-5907108629289577785.html	205	\N
Upcoming Events, by Bryan Caplan	https://www.econlib.org/upcoming-events-2/	2019-09-25 05:46:29-07	Bryan Caplan	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/bryan_caplan_econlib/6677939508974307093.html	205	\N
Russ Roberts on CPI Bias, by Bryan Caplan	https://www.econlib.org/russ-roberts-on-cpi-bias/	2019-09-24 08:08:31-07	Bryan Caplan	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/bryan_caplan_econlib/-5356956853347334439.html	205	\N
Is That Cricket?, by Bryan Caplan	https://www.econlib.org/thats-cricket/	2019-09-24 06:20:01-07	Bryan Caplan	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/bryan_caplan_econlib/-4313070287181689118.html	205	\N
Terrorism vs. Just War Theory, by Bryan Caplan	https://www.econlib.org/terrorism-vs-just-war-theory/	2019-09-23 05:25:13-07	Bryan Caplan	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/bryan_caplan_econlib/1346129245380097868.html	205	\N
The Fault Is Not in Our Stuff But in Ourselves, by Bryan Caplan	https://www.econlib.org/sacerdote-on-cpi-bias/	2019-09-19 06:49:43-07	Bryan Caplan	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/bryan_caplan_econlib/8810160015080391953.html	205	\N
The Great Successor: Inside North Korea, by Bryan Caplan	https://www.econlib.org/the-great-successor-inside-north-korea/	2019-09-18 07:03:58-07	Bryan Caplan	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/bryan_caplan_econlib/1929793011854769704.html	205	\N
A Natural History of Beauty	https://meltingasphalt.com/a-natural-history-of-beauty/	2018-10-29 17:00:00-07	Kevin Simler	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/melting_asphalt/-918612143514924486.html	202	\N
The Elephant in the Brain	https://meltingasphalt.com/the-elephant-in-the-brain/	2018-01-02 16:00:00-08	Kevin Simler	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/melting_asphalt/1913167751886931575.html	202	\N
Here Be Sermons	https://meltingasphalt.com/here-be-sermons/	2017-09-10 17:00:00-07	Kevin Simler	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/melting_asphalt/-2890975368309066548.html	202	\N
Crony Beliefs	https://meltingasphalt.com/crony-beliefs/	2016-11-01 17:00:00-07	Kevin Simler	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/melting_asphalt/5744767703240424506.html	202	\N
A Nihilist's Guide to Meaning	https://meltingasphalt.com/a-nihilists-guide-to-meaning/	2016-07-10 17:00:00-07	Kevin Simler	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/melting_asphalt/-2813263987119178880.html	202	\N
Minimum Viable Superorganism	https://meltingasphalt.com/minimum-viable-superorganism/	2016-02-10 16:00:00-08	Kevin Simler	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/melting_asphalt/-6882832100152868521.html	202	\N
2015 Meta	https://meltingasphalt.com/2015-meta/	2016-01-10 16:00:00-08	Kevin Simler	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/melting_asphalt/-7985938840444125206.html	202	\N
Social Status II: Cults and Loyalty	https://meltingasphalt.com/social-status-ii-cults-and-loyalty/	2015-11-01 16:00:00-08	Kevin Simler	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/melting_asphalt/-6630287144929311390.html	202	\N
Social Status: Down the Rabbit Hole	https://meltingasphalt.com/social-status-down-the-rabbit-hole/	2015-10-12 17:00:00-07	Kevin Simler	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/melting_asphalt/-5743730319184666408.html	202	\N
Sunday assorted links	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/rvYqQ-vnmLk/sunday-assorted-links-233.html	2019-10-06 12:08:57-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/-5311033796127829039.html	187	\N
Hotel room hacks	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/IEQ8IyQlba4/hotel-room-hacks.html	2019-10-06 09:47:41-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/-3688786152943654326.html	187	\N
Learning from Night Lights	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/lB3o7Be-bIQ/learning-from-night-lights.html	2019-10-06 04:24:32-07	Alex Tabarrok	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/-5127630298132800058.html	187	\N
Does walkability boost economic mobility?	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/vbfUMv7TKt8/does-walkability-boost-economic-mobility.html	2019-10-05 22:00:43-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/-8899326399787817028.html	187	\N
Hypersonic is not always as fast as you think	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/M8rKG4GcLqE/hypersonic-is-not-always-as-fast-as-you-think.html	2019-10-05 12:15:47-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/-631914879979065269.html	187	\N
Open Thread 138	https://slatestarcodex.com/2019/10/06/open-thread-138/	2019-10-06 00:01:12-07	Scott Alexander	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/slatestarcodex/1176763721700858738.html	196	\N
The Arc of Collaboration	https://kwokchain.com/2019/08/16/the-arc-of-collaboration/	2019-08-15 17:49:59-07	Kevin Kwok	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/kwokchain/6098843796682180728.html	184	\N
Going Critical	https://meltingasphalt.com/going-critical/	2019-05-12 17:00:00-07	Kevin Simler	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/melting_asphalt/4579759462742917907.html	202	\N
Saturday assorted links	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/ZqeS4m7wTFA/saturday-assorted-links-229.html	2019-10-05 09:24:44-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/-499137990619794510.html	187	\N
Which thinker from the past would you resurrect?	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/juTb9GvsFYo/which-thinker-from-the-past-would-you-resurrect.html	2019-10-05 04:32:05-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/-5078394002163605862.html	187	\N
The Wage Penalty to Undocumented Immigration	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/Rj-QUz6mDAw/the-wage-penalty-to-undocumented-immigration.html	2019-10-04 22:00:07-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/-3729587496119287211.html	187	\N
Why firms stay private longer?	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/eb9aOWqttC8/why-firms-stay-private-longer.html	2019-10-04 10:40:27-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/2337773101908709919.html	187	\N
Andrew McAfee Places His Bets!	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/H04QwruHj_M/andrew-mcafee-places-his-bets.html	2019-10-04 10:27:57-07	Alex Tabarrok	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/-3615964779440411337.html	187	\N
Friday assorted links	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/269tML2Db8o/friday-assorted-links-230.html	2019-10-04 08:36:50-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/-4951392261204318615.html	187	\N
Robert Kagan has solved for the equilibrium	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/o3gazrBxjV0/robert-kagan-has-solved-for-the-equilibrium.html	2019-10-03 23:15:08-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/-4813593773133269257.html	187	\N
Does regulation have a role in the repo rise?	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/4Euu1sQpuYM/does-regulation-have-a-role-in-the-repo-rise.html	2019-10-03 21:21:12-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/7523405661176032220.html	187	\N
The ocean of Encedalus, moon of Saturn	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/-dmoX-q0XgQ/the-ocean-of-encedalus-moon-of-saturn.html	2019-10-03 18:31:32-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/7156502434446258765.html	187	\N
Thursday assorted links	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/dElCstoERVk/thursday-assorted-links-225.html	2019-10-03 11:03:26-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/-5194977945185040195.html	187	\N
Elderblog Sutra: 9	https://www.ribbonfarm.com/2019/09/25/elderblog-sutra-9/	2019-09-25 15:28:26-07	Venkatesh Rao	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/8471506175935969741.html	190	\N
Domestic Cozy: 8	https://www.ribbonfarm.com/2019/09/23/domestic-cozy-8/	2019-09-23 17:11:22-07	Venkatesh Rao	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/1135193575083773526.html	190	\N
Weirding Diary: 10	https://www.ribbonfarm.com/2019/09/17/weirding-diary-10/	2019-09-17 15:36:15-07	Venkatesh Rao	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/-6866468840259202878.html	190	\N
Mediocratopia: 8	https://www.ribbonfarm.com/2019/09/16/mediocratopia-8/	2019-09-16 13:41:07-07	Venkatesh Rao	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/3924375765792791174.html	190	\N
Predictable Identities: 17 – Midpoint Review	https://www.ribbonfarm.com/2019/09/11/predictable-identities-17-midpoint-review/	2019-09-11 11:00:34-07	Jacob Falkovich	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/2484507413512893122.html	190	\N
Elderblog Sutra: 8	https://www.ribbonfarm.com/2019/09/10/elderblog-sutra-8/	2019-09-10 11:27:19-07	Venkatesh Rao	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/-1534953141896447625.html	190	\N
Worlding Raga 7: Worlds of Worlds	https://www.ribbonfarm.com/2019/09/04/worlding-raga-7-worlds-of-worlds/	2019-09-04 14:16:17-07	Venkatesh Rao	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/-2793377102271387951.html	190	\N
Predictable Identities: 16 – Newcomblike, Part II	https://www.ribbonfarm.com/2019/08/28/predictable-identities-16-newcomblike-part-ii/	2019-08-28 11:00:22-07	Jacob Falkovich	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/6517948274520549352.html	190	\N
Multitemporality: 1	https://www.ribbonfarm.com/2019/08/16/multitemporality-1/	2019-08-16 16:25:23-07	Venkatesh Rao	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/3135829497702639779.html	190	\N
Meaning as Ambiguity	https://www.ribbonfarm.com/2019/08/15/meaning-as-ambiguity/	2019-08-15 13:04:21-07	Sarah Perry	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/1454369530630642595.html	190	\N
Predictable Identities: 15 – Newcomblike, Part I	https://www.ribbonfarm.com/2019/08/14/predictable-identities-15-newcomblike-part-i/	2019-08-14 23:00:21-07	Jacob Falkovich	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/4532976164224775442.html	190	\N
Domestic Cozy: 7	https://www.ribbonfarm.com/2019/08/05/domestic-cozy-7/	2019-08-05 17:54:21-07	Venkatesh Rao	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/2744006132876061316.html	190	\N
Mediocratopia: 7	https://www.ribbonfarm.com/2019/08/01/mediocratopia-7/	2019-08-01 10:38:44-07	Venkatesh Rao	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/-69197748317046302.html	190	\N
Predictable Identities: 14 – Frameworks are Fake	https://www.ribbonfarm.com/2019/07/24/predictable-identities-14-frameworks-are-fake/	2019-07-24 11:00:32-07	Jacob Falkovich	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/3831431696697877076.html	190	\N
Domestic Cozy: 6	https://www.ribbonfarm.com/2019/07/22/domestic-cozy-6/	2019-07-22 12:39:55-07	Venkatesh Rao	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/7577067678751252893.html	190	\N
Weirding Diary: 9	https://www.ribbonfarm.com/2019/07/17/weirding-diary-9/	2019-07-17 13:32:44-07	Venkatesh Rao	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/-9209812007681987412.html	190	\N
Mediocratopia: 6	https://www.ribbonfarm.com/2019/07/16/mediocratopia-6/	2019-07-16 15:23:20-07	Venkatesh Rao	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/3142672702541631416.html	190	\N
Pleasure as an Organizing Principle	https://www.ribbonfarm.com/2019/07/11/pleasure-as-an-organizing-principle/	2019-07-11 11:14:57-07	Tiago Forte	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/7318147157198824824.html	190	\N
Predictable Identities: 13 – Totalizing Ideologies	https://www.ribbonfarm.com/2019/07/10/predictable-identities-13-totalizing-ideologies/	2019-07-10 11:00:29-07	Jacob Falkovich	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/7538747226229498064.html	190	\N
A Framework for Moderation	https://stratechery.com/2019/a-framework-for-moderation/	2019-08-07 05:49:22-07	Ben Thompson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/stratechery/-1442796907159774525.html	193	\N
Fairbanks Meetup Update	https://slatestarcodex.com/2019/10/06/fairbanks-meetup-update/	2019-10-06 15:28:36-07	Scott Alexander	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/slatestarcodex/4830146804132087715.html	196	\N
Fairbanks Meetup This Sunday	https://slatestarcodex.com/2019/10/03/fairbanks-meetup-this-sunday/	2019-10-03 19:09:22-07	Scott Alexander	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/slatestarcodex/-5515547644559482969.html	196	\N
Seattle Meetup This Wednesday	https://slatestarcodex.com/2019/10/01/seattle-meetup-this-wednesday/	2019-10-01 20:00:28-07	Scott Alexander	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/slatestarcodex/-7290511497152080892.html	196	\N
Portland Meetup This Tuesday	https://slatestarcodex.com/2019/09/30/portland-meetup-this-tuesday/	2019-09-30 21:33:09-07	Scott Alexander	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/slatestarcodex/4345694711174050004.html	196	\N
Austin Meetup This Monday	https://slatestarcodex.com/2019/09/29/austin-meetup-this-monday/	2019-09-29 20:45:50-07	Scott Alexander	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/slatestarcodex/5281173229458193463.html	196	\N
Chicago Meetup This Saturday	https://slatestarcodex.com/2019/09/27/chicago-meetup-this-saturday/	2019-09-27 16:24:46-07	Scott Alexander	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/slatestarcodex/7064835126057710341.html	196	\N
Ann Arbor Meetup This Thursday	https://slatestarcodex.com/2019/09/25/ann-arbor-meetup-this-thursday/	2019-09-25 19:30:36-07	Scott Alexander	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/slatestarcodex/6147939972069954919.html	196	\N
Open Thread 137.25	https://slatestarcodex.com/2019/09/24/open-thread-137-25/	2019-09-24 21:08:33-07	Scott Alexander	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/slatestarcodex/9081397722399519880.html	196	\N
Washington DC Meetup This Tuesday	https://slatestarcodex.com/2019/09/23/washington-dc-meetup-this-tuesday/	2019-09-23 18:58:08-07	Scott Alexander	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/slatestarcodex/-497542620674517924.html	196	\N
What Does the Public Think About Markets, About Government, and About Corporate Favoritism?	https://www.mercatus.org/bridge/commentary/what-does-public-think-about-markets-about-government-and-about-corporate	2019-10-04 12:24:48-07	Matthew D. Mitchell	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/mercatus_center/5078745490859280632.html	199	\N
Comprehensive Jobless Rate Hits New All-Time Low	https://www.mercatus.org/bridge/commentary/comprehensive-jobless-rate-hits-new-all-time-low	2019-10-04 11:58:21-07	Michael D. Farren	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/mercatus_center/6865972495069973204.html	199	\N
US Trade Proves Resilient Despite President Trump’s Escalating Tariff War	https://www.mercatus.org/bridge/commentary/us-trade-proves-resilient-despite-president-trump%E2%80%99s-escalating-tariff-war	2019-10-04 11:32:15-07	Daniel Griswold	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/mercatus_center/1188711680569956908.html	199	\N
Reflections on Allan H. Meltzer’s Contributions to Monetary Economics and Public Policy	https://www.mercatus.org/publications/monetary-policy/reflections-allan-h-meltzer%E2%80%99s-contributions-monetary-economics	2019-10-02 08:45:02-07	David Beckworth	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/mercatus_center/4404348135265035782.html	199	\N
Facts About Nominal GDP Level Targeting	https://www.mercatus.org/bridge/commentary/facts-about-nominal-gdp-level-targeting	2019-10-01 10:59:36-07	Frank Fuhrig	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/mercatus_center/-9174225725666328272.html	199	\N
Public Perceptions of Markets, Government, and Favoritism	https://www.mercatus.org/publications/corporate-welfare/public-perceptions-markets-government-and-favoritism	2019-10-01 07:26:03-07	Matthew D. Mitchell	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/mercatus_center/-1911845901184873616.html	199	\N
Community Resilience through Mesh Networking	https://www.mercatus.org/bridge/commentary/community-resilience-through-mesh-networking	2019-09-30 12:32:01-07	Anne Hobson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/mercatus_center/-6549969088949548156.html	199	\N
When Wrigley Got Lights	https://www.mercatus.org/bridge/commentary/when-wrigley-got-lights	2019-09-27 10:41:37-07	Anne Philpot	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/mercatus_center/-7869384328210806076.html	199	\N
Get Government Out of the Construction Business	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/igwNKcgdSno/get-government-out-of-the-construction-business.html	2019-10-09 04:40:44-07	Alex Tabarrok	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/1002591836481473428.html	187	\N
Becoming the Internet	https://www.ribbonfarm.com/2019/10/08/becoming-the-internet/	2019-10-08 10:04:22-07	Venkatesh Rao	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/2230178493997700629.html	190	\N
What Is a Tech Company?	https://stratechery.com/2019/what-is-a-tech-company/	2019-09-03 08:09:22-07	Ben Thompson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/stratechery/-7116348115816501477.html	193	\N
Privacy Fundamentalism	https://stratechery.com/2019/privacy-fundamentalism/	2019-08-27 06:41:54-07	Ben Thompson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/stratechery/2593383380191539971.html	193	\N
The WeWork IPO	https://stratechery.com/2019/the-wework-ipo/	2019-08-20 06:41:11-07	Ben Thompson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/stratechery/7797471686060324488.html	193	\N
The China Cultural Clash	https://stratechery.com/2019/the-china-cultural-clash/	2019-10-08 09:32:01-07	Ben Thompson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/stratechery/7585666096375146408.html	193	\N
Beachheads and Obstacles	https://stratechery.com/2019/beachheads-and-obstacles/	2019-10-01 07:48:44-07	Ben Thompson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/stratechery/1771559510500409461.html	193	\N
Exponent Podcast: The Exponent IPO	https://stratechery.com/2019/exponent-podcast-the-exponent-ipo/	2019-09-20 09:00:43-07	Ben Thompson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/stratechery/-6648430585478114914.html	193	\N
Day Two to One Day	https://stratechery.com/2019/day-two-to-one-day/	2019-09-17 05:10:00-07	Ben Thompson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/stratechery/-4587541219116085499.html	193	\N
The iPhone and Apple’s Services Strategy	https://stratechery.com/2019/the-iphone-and-apples-services-strategy/	2019-09-11 04:19:23-07	Ben Thompson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/stratechery/-7275157731219480975.html	193	\N
Links 10/19	https://slatestarcodex.com/2019/10/07/links-10-19/	2019-10-07 21:53:46-07	Scott Alexander	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/slatestarcodex/3310124811927016993.html	196	\N
Poverty: A Ranking of What I’ve Been Reading, by Bryan Caplan	https://www.econlib.org/poverty-a-ranking-of-what-ive-been-reading/	2019-10-08 06:26:12-07	Bryan Caplan	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/bryan_caplan_econlib/6142780263690388763.html	205	\N
What should I ask Daron Acemoglu?	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/EQXESrwUvtc/what-should-i-ask-daron-acemoglu.html	2019-10-09 22:42:42-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/-1880380414966170412.html	187	\N
Why Information Grows	https://www.eugenewei.com/blog/2017/4/22/why-information-grows	2018-01-15 21:00:00-08	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/1153695124749759301.html	544	\N
My first podcast appearance	https://www.eugenewei.com/blog/2018/1/10/my-first-podcast-appearance	2018-01-10 14:03:39-08	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/6294817601699805628.html	544	\N
Comments on the Ex-Im Bank's Proposed Additionality Criteria	https://www.mercatus.org/publications/government-spending/comments-ex-im-banks-proposed-additionality-criteria	2019-10-09 14:16:22-07	Veronique de Rugy	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/mercatus_center/2915605252681066963.html	199	\N
Mao Is Murder, by Bryan Caplan	https://www.econlib.org/mao-is-murder/	2019-10-09 07:45:06-07	Bryan Caplan	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/bryan_caplan_econlib/-976869195001774544.html	205	\N
My education podcast with Can Olcer	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/PM7cJTA5nlE/my-education-podcast-with-can-olcer.html	2019-10-10 07:13:09-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/8502522865345698284.html	187	\N
Beware the lessons of growing up Galapagos	https://www.eugenewei.com/blog/2018/1/9/outdated-playbooks-from-the-age-of-scarcity	2018-01-10 13:50:00-08	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/6373073888358070051.html	544	\N
Drawing invisible boundaries in conversational interfaces	https://www.eugenewei.com/blog/2017/11/1/drawing-invisible-boundaries-in-conversational-interfaces	2017-12-06 13:07:00-08	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/5772337304018569453.html	544	\N
10 more browser tabs	https://www.eugenewei.com/blog/2017/11/19/10-more-browser-tabs	2017-12-04 18:53:00-08	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/-4355620369573549857.html	544	\N
Neither, and New: Lessons from Uber and Vision Fund	https://stratechery.com/2019/neither-and-new-lessons-from-uber-and-vision-fund/	2019-09-25 08:32:39-07	Ben Thompson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/stratechery/-9106385770108897868.html	193	\N
They Know Better, by Bryan Caplan	https://www.econlib.org/they-know-better/	2019-10-10 05:41:50-07	Bryan Caplan	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/bryan_caplan_econlib/-1170805991107584585.html	205	\N
Economics of LGBT talent bleg	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/UKGm0edeZ7c/economics-of-lgbt-talent-bleg.html	2019-10-10 11:12:48-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/6324328263161052690.html	187	\N
Policymakers Should Reevaluate the Premises That Led to an Overhaul of Regulation Z	https://www.mercatus.org/publications/financial-markets/policymakers-should-reevaluate-premises-led-overhaul-regulation-z	2019-10-10 10:44:19-07	Kevin Erdmann	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/mercatus_center/-4840199643126879158.html	199	\N
Berkeley Meetup This Thursday	https://slatestarcodex.com/2019/10/09/berkeley-meetup-this-thursday/	2019-10-09 22:35:08-07	Scott Alexander	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/slatestarcodex/5646275349548945720.html	196	\N
Invisible asymptotes	https://www.eugenewei.com/blog/2018/5/21/invisible-asymptotes	2018-05-22 10:17:00-07	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/-6962533683321942064.html	544	\N
What I learned from a Taipei alley	https://www.eugenewei.com/blog/2018/5/11/taipei-alley	2018-05-15 11:15:00-07	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/-9136891738480330690.html	544	\N
The inefficiency of large, infrequent transactions	https://www.eugenewei.com/blog/2018/4/6/the-inefficiency-of-infrequent-transactions	2018-04-14 19:06:00-07	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/3200483944288202643.html	544	\N
Catch up	https://www.eugenewei.com/blog/2018/3/19/catch-up	2018-03-19 22:59:04-07	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/1937625857002719270.html	544	\N
Revisionist commentary	https://www.eugenewei.com/blog/2018/1/15/revisionist-commentary	2018-01-21 13:31:00-08	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/-7881302546878701091.html	544	\N
Helpful tip for data series labels in Excel	https://www.eugenewei.com/blog/2017/11/15/helpful-tip-for-data-series-labels-in-excel	2017-11-20 18:09:00-08	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/-4552510445877521868.html	544	\N
Remove the legend to become one	https://www.eugenewei.com/blog/2017/11/13/remove-the-legend	2017-11-14 17:15:00-08	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/-2164704483103434400.html	544	\N
Revisiting The Odyssey	https://www.eugenewei.com/blog/2017/11/8/revisiting-the-odyssey	2017-11-08 20:34:09-08	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/8543846547350439658.html	544	\N
10 browser tabs	https://www.eugenewei.com/blog/2017/11/7/10-browser-tabs	2017-11-07 17:09:08-08	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/594844702766030736.html	544	\N
Chasm of comprehension	https://www.eugenewei.com/blog/2017/2/27/chasm-of-comprehension	2017-10-29 14:15:00-07	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/7067253370787081860.html	544	\N
Evaluating mobile map designs	https://www.eugenewei.com/blog/2017/5/31/evaluating-mobile-map-designs	2017-10-28 14:31:00-07	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/5486304686650713631.html	544	\N
Things I learned from The Defiant Ones	https://www.eugenewei.com/blog/2017/9/6/things-i-learned-from-the-defiant-ones	2017-10-26 15:15:00-07	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/3337811181149347537.html	544	\N
Exponent Podcast: Distracted at Facebook	https://stratechery.com/2019/exponent-podcast-distracted-at-facebook/	2019-10-05 10:51:36-07	Ben Thompson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/stratechery/-232963430419953991.html	193	\N
When you come to the 2^100 forks in the road...	https://www.eugenewei.com/blog/2017/9/13/when-you-come-to-the-2100-forks-in-the-road	2017-10-26 14:37:00-07	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/-6311596944597443389.html	544	\N
Selfies as a second language	https://www.eugenewei.com/blog/2017/9/14/selfies-as-a-second-language	2017-10-18 17:31:00-07	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugenewei/5112313427562625363.html	544	\N
Epstein’s Kompromat	https://elaineou.com/2019/09/11/epsteins-kompromat/	2019-09-11 14:30:00-07	Elaine	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/elaine_ou/-551123124061277665.html	710	\N
Chesterton’s Schoolhouse	https://elaineou.com/2019/09/06/chestertons-schoolhouse/	2019-09-06 12:29:17-07	Elaine	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/elaine_ou/-7860568045268889298.html	710	\N
Law is Money	https://elaineou.com/2019/08/26/law-is-money/	2019-08-26 20:47:44-07	Elaine	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/elaine_ou/4871193257908658105.html	710	\N
Investing in TVET would increase female labor force participation in Nepal	http://webfeeds.brookings.edu/~/607642626/0/brookingsrss/topfeeds/latestfrombrookings~Investing-in-TVET-would-increase-female-labor-force-participation-in-Nepal/	2019-10-10 13:03:41-07	Anil Paudel	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/brookings/-2984922050376856904.html	663	\N
Broadband adoption is on the rise, but states can do much more	http://webfeeds.brookings.edu/~/607641536/0/brookingsrss/topfeeds/latestfrombrookings~Broadband-adoption-is-on-the-rise-but-states-can-do-much-more/	2019-10-10 11:42:48-07	Lara Fishbane, Adie Tomer	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/brookings/-637004861000722496.html	663	\N
Hutchins Roundup: Taxing high earners, borrowing when unemployed, and more	http://webfeeds.brookings.edu/~/607633066/0/brookingsrss/topfeeds/latestfrombrookings~Hutchins-Roundup-Taxing-high-earners-borrowing-when-unemployed-and-more/	2019-10-10 08:00:48-07	Jeffrey Cheng, Louise Sheiner, Kadija Yilla	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/brookings/-5183798190137537725.html	663	\N
Turkey attacks Syria: Trump didn’t have to withdraw troops to fulfill campaign promises	http://webfeeds.brookings.edu/~/607632296/0/brookingsrss/topfeeds/latestfrombrookings~Turkey-attacks-Syria-Trump-didnt-have-to-withdraw-troops-to-fulfill-campaign-promises/	2019-10-10 07:35:31-07	Michael E. O'Hanlon, Ömer Taşpınar	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/brookings/8146946946717391216.html	663	\N
Around the halls: Brookings experts’ reactions to Turkey’s incursion into Syria	http://webfeeds.brookings.edu/~/607629514/0/brookingsrss/topfeeds/latestfrombrookings~Around-the-halls-Brookings-experts-reactions-to-Turkeys-incursion-into-Syria/	2019-10-10 06:05:02-07	Amanda Sloat, Kemal Kirişci, Michael E. O'Hanlon, Ömer Taşpınar, Jeffrey Feltman, Suzanne Maloney	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/brookings/-518517761919181810.html	663	\N
Double tipping points in 2019: When the world became mostly rich and largely old	http://webfeeds.brookings.edu/~/607608356/0/brookingsrss/topfeeds/latestfrombrookings~Double-tipping-points-in-When-the-world-became-mostly-rich-and-largely-old/	2019-10-09 14:01:03-07	Homi Kharas, Wolfgang Fengler	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/brookings/6446798093208859868.html	663	\N
The US played down Turkey’s concerns about Syrian Kurdish forces. That couldn’t last.	http://webfeeds.brookings.edu/~/607605484/0/brookingsrss/topfeeds/latestfrombrookings~The-US-played-down-Turkey%e2%80%99s-concerns-about-Syrian-Kurdish-forces-That-couldn%e2%80%99t-last/	2019-10-09 12:22:57-07	Amanda Sloat	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/brookings/8525161926098211186.html	663	\N
Did Zelenskiy give in to Moscow? It’s too early to tell	http://webfeeds.brookings.edu/~/607601196/0/brookingsrss/topfeeds/latestfrombrookings~Did-Zelenskiy-give-in-to-Moscow-Its-too-early-to-tell/	2019-10-09 09:50:59-07	Steven Pifer	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/brookings/253938945016901669.html	663	\N
Figure of the week: Foreign direct investment in Africa	http://webfeeds.brookings.edu/~/607600234/0/brookingsrss/topfeeds/latestfrombrookings~Figure-of-the-week-Foreign-direct-investment-in-Africa/	2019-10-09 09:21:38-07	Payce Madden	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/brookings/-6109344395039772112.html	663	\N
Navigating the complex politics of impeachment	http://webfeeds.brookings.edu/~/607600132/0/brookingsrss/topfeeds/latestfrombrookings~Navigating-the-complex-politics-of-impeachment/	2019-10-09 09:17:20-07	John Hudak	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/brookings/-8798348028690759710.html	663	\N
2018 Letter	https://danwang.co/2018-review/	2018-12-21 14:50:14-08	Dan Wang	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/dan_wang/4108463791389351893.html	592	\N
How Technology Grows (a restatement of definite optimism)	https://danwang.co/how-technology-grows/	2018-07-24 07:33:16-07	Dan Wang	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/dan_wang/6933128382879703068.html	592	\N
Chinese Cancel Culture	https://elaineou.com/2019/10/08/chinese-cancel-culture/	2019-10-08 09:52:18-07	Elaine	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/elaine_ou/6307174486323918803.html	710	\N
Intermediate All The Things!	https://elaineou.com/2019/09/23/intermediate-all-the-things/	2019-09-23 11:09:57-07	Elaine	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/elaine_ou/6247201589700124773.html	710	\N
Sound Money	https://elaineou.com/2019/07/25/sound-money/	2019-07-25 11:15:23-07	Elaine	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/elaine_ou/828615800395678844.html	710	\N
Hackers and Sphincters	https://elaineou.com/2019/06/28/hackers-and-sphincters/	2019-06-28 00:04:20-07	Elaine	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/elaine_ou/2557492356556976999.html	710	\N
A Very Racist Blog Post	https://elaineou.com/2019/06/11/a-very-racist-blog-post/	2019-06-11 11:34:30-07	Elaine	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/elaine_ou/-4963948844934082327.html	710	\N
San Francisco Squatters	https://elaineou.com/2019/06/08/san-francisco-squatters/	2019-06-08 00:30:16-07	Elaine	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/elaine_ou/-4344637878551300229.html	710	\N
Digital Squatter’s Rights	https://elaineou.com/2019/06/07/digital-squatters-rights/	2019-06-07 00:02:31-07	Elaine	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/elaine_ou/-9011471316311047635.html	710	\N
Imperial history and classical aesthetics	https://danwang.co/imperial-history-and-classical-aesthetics/	2018-04-17 06:49:43-07	Dan Wang	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/dan_wang/-5532977382540893276.html	592	\N
2017 Letter	https://danwang.co/2017-review/	2018-01-15 04:06:33-08	Dan Wang	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/dan_wang/-5984122850257654253.html	592	\N
Definite optimism as human capital	https://danwang.co/definite-optimism-as-human-capital/	2017-08-07 03:49:44-07	Dan Wang	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/dan_wang/5213215854533895980.html	592	\N
Violence and the Sacred: College as an incubator of Girardian terror	https://danwang.co/college-girardian-terror/	2017-06-25 07:44:36-07	Dan Wang	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/dan_wang/6961748505996052062.html	592	\N
Why do so few people major in computer science?	https://danwang.co/why-so-few-computer-science-majors/	2017-05-29 05:58:23-07	Dan Wang	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/dan_wang/-7341352071279386956.html	592	\N
What I’ve been reading	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/qXWaZCH2K8c/what-ive-been-reading-153.html	2019-10-12 22:04:29-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/7868790229325038703.html	187	\N
PermaPunk – Visionary Non/Fictions	https://www.ribbonfarm.com/2019/10/11/permapunk-visionary-non-fictions/	2019-10-11 10:09:49-07	Venkatesh Rao	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/1593207975359082004.html	190	\N
Irvine Meetup This Friday	https://slatestarcodex.com/2019/10/11/irvine-meetup-this-friday/	2019-10-11 01:07:18-07	Scott Alexander	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/slatestarcodex/-532049008841737115.html	196	\N
Status as a Service (StaaS)	https://www.eugenewei.com/blog/2019/2/19/status-as-a-service	2019-02-26 15:00:00-08	Eugene Wei	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/eugene_wei/120683688220493123.html	544	\N
Our Glorious Banana Republic	https://elaineou.com/2019/10/11/our-glorious-banana-republic/	2019-10-11 12:41:44-07	Elaine	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/elaine_ou/3329785487320319893.html	710	\N
Monday assorted links	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/FpSOot9I9t4/monday-assorted-links-225.html	2019-10-13 21:23:57-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/-4350598292269835531.html	187	\N
Interpretation Matrix: Free Trade Benefits Everyone	https://everythingstudies.com/2019/09/12/interpretation-matrix-free-trade-benefits-everyone/	2019-09-12 08:50:57-07	John Nerst		790	\N
The Prince and the Figurehead	https://everythingstudies.com/2019/08/19/the-prince-and-the-figurehead/	2019-08-19 08:40:39-07	John Nerst		790	\N
In Favor of Sometimes Sounding Like a Robot	https://everythingstudies.com/2019/07/24/in-favor-of-sometimes-sounding-like-a-robot/	2019-07-24 13:30:55-07	John Nerst		790	\N
A Disagreement About Disagreement	https://everythingstudies.com/2019/06/26/a-disagreement-about-disagreement/	2019-06-26 09:35:58-07	John Nerst		790	\N
A Defense of Erisology	https://everythingstudies.com/2019/05/13/a-defense-of-erisology/	2019-05-13 08:20:58-07	John Nerst		790	\N
The Tilted Political Compass, Part 2: Up and Down	https://everythingstudies.com/2019/03/25/the-tilted-political-compass-part-2-up-and-down/	2019-03-25 10:01:08-07	John Nerst		790	\N
The Tilted Political Compass, Part 1: Left and Right	https://everythingstudies.com/2019/03/01/the-tilted-political-compass-part-1-left-and-right/	2019-03-01 08:05:25-08	John Nerst		790	\N
Postscript to a Podcast	https://everythingstudies.com/2019/02/04/postscript-to-a-podcast/	2019-02-04 12:40:49-08	John Nerst		790	\N
A Meta-Meditation	https://everythingstudies.com/2019/01/23/a-meta-meditation/	2019-01-23 09:25:39-08	John Nerst		790	\N
2018 in Review	https://everythingstudies.com/2018/12/29/2018-in-review/	2018-12-29 08:01:10-08	John Nerst		790	\N
The Nobel Prize in Economic Science Goes to Banerjee, Duflo, and Kremer	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/kvx1135uIFI/the-nobel-prize-in-economic-science-goes-to-banerjee-duflo-and-kremer.html	2019-10-14 02:52:48-07	Alex Tabarrok	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/8276952933602717190.html	187	\N
When can companies force change by standing up to foreign governments	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/v2jtPQzN-RM/when-can-companies-force-change-by-standing-up-to-foreign-governments.html	2019-10-14 23:21:49-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/-2730030413881680781.html	187	\N
Book Review: Against The Grain	https://slatestarcodex.com/2019/10/14/book-review-against-the-grain/	2019-10-14 23:54:57-07	Scott Alexander	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/slatestarcodex/1883303571686148543.html	196	\N
Build, Barbara, Build: Reflections on Nickel and Dimed, by Bryan Caplan	https://www.econlib.org/build-barbara-build-reflections-on-nickel-and-dimed/	2019-10-14 08:04:03-07	Bryan Caplan	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/bryan_caplan_econlib/-2821877635337288400.html	205	\N
Tuesday assorted links	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/onAnSno_RHQ/tuesday-assorted-links-233.html	2019-10-15 08:38:42-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/5395660401033202654.html	187	\N
Exponent: The Abyss Stares Back	https://stratechery.com/2019/exponent-the-abyss-stares-back/	2019-10-15 09:00:19-07	Ben Thompson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/stratechery/-7291875910231247415.html	193	\N
Let Foreigners Speak	http://www.overcomingbias.com/2019/10/let-foreigners-speak.html	2019-10-10 16:30:27-07	Robin Hanson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/overcoming_bias/-8409840836423358435.html	858	\N
Separating Redistribution From Hardship Insurance	http://www.overcomingbias.com/2019/10/separating-redistribution-from-hardship-insurance.html	2019-10-04 02:00:21-07	Robin Hanson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/overcoming_bias/-6934486462129434234.html	858	\N
Dreamtime Social Games	http://www.overcomingbias.com/2019/09/dreamtime-games.html	2019-09-27 10:30:38-07	Robin Hanson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/overcoming_bias/6961698403143445467.html	858	\N
Status Apps Are Coming	http://www.overcomingbias.com/2019/09/status-apps-are-coming.html	2019-09-25 08:15:24-07	Robin Hanson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/overcoming_bias/5038724845420466273.html	858	\N
Who Vouches For You?	http://www.overcomingbias.com/2019/09/who-vouches-for-you.html	2019-09-21 05:00:19-07	Robin Hanson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/overcoming_bias/883874499445968886.html	858	\N
Quality Regs Say ‘High Is Good’	http://www.overcomingbias.com/2019/09/quality-regs-say-high-is-good.html	2019-09-19 15:50:25-07	Robin Hanson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/overcoming_bias/4585234868709831038.html	858	\N
Graziano on a World of Uploaded Minds	http://www.overcomingbias.com/2019/09/graziano-on-a-world-of-uploaded-minds.html	2019-09-17 11:30:35-07	Robin Hanson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/overcoming_bias/1849311046460554334.html	858	\N
Yay Democracy Dollars	http://www.overcomingbias.com/2019/09/yay-democracy-dollars.html	2019-09-14 08:00:10-07	Robin Hanson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/overcoming_bias/5108685168242735783.html	858	\N
Stamina Succeeds	http://www.overcomingbias.com/2019/09/stamina-succeeds.html	2019-09-10 11:10:59-07	Robin Hanson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/overcoming_bias/7459562882837941230.html	858	\N
Beware Multi-Monopolies	http://www.overcomingbias.com/2019/09/our-multi-monopoly-problem.html	2019-09-08 06:15:28-07	Robin Hanson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/overcoming_bias/5123715763877093568.html	858	\N
Why Kevin Williamson is wrong about poverty and bad behavior	http://noahpinionblog.blogspot.com/2019/08/why-kevin-williamson-is-wrong-about.html	2019-08-03 14:36:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/-2348809842682009379.html	891	\N
The Middle Eastern Thirty Years War?	http://noahpinionblog.blogspot.com/2019/06/the-middle-eastern-thirty-years-war.html	2019-06-19 17:17:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/650850573826059060.html	891	\N
Examining an MMT model in detail	http://noahpinionblog.blogspot.com/2019/03/examining-mmt-model-in-detail.html	2019-03-31 12:45:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/-4461559435168710937.html	891	\N
Where should Americans live if they live abroad?	http://noahpinionblog.blogspot.com/2019/03/where-should-americans-live-if-they.html	2019-03-30 15:45:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/260466994560314619.html	891	\N
Guest post: Roy Bahat on Uber, Lyft, and the future of work	http://noahpinionblog.blogspot.com/2019/03/guest-post-roy-bahat-on-uber-lyft-and.html	2019-03-28 11:08:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/-7416907846164821406.html	891	\N
A proposal for an Alternative Green New Deal	http://noahpinionblog.blogspot.com/2019/02/a-proposal-for-alternative-green-new.html	2019-02-28 16:09:00-08	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/1708759813734820592.html	891	\N
Book Review: The Revolt of the Public, by Martin Gurri	http://noahpinionblog.blogspot.com/2019/02/book-review-revolt-of-public-by-martin.html	2019-02-21 18:40:00-08	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/-6668872996170824821.html	891	\N
Book Review: "The Souls of Yellow Folk," by Wesley Yang	http://noahpinionblog.blogspot.com/2019/01/book-review-souls-of-yellow-folk-by.html	2019-01-30 17:42:00-08	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/2464244209642241508.html	891	\N
Book Review: "Stubborn Attachments", by Tyler Cowen	http://noahpinionblog.blogspot.com/2019/01/book-review-stubborn-attachments-by.html	2019-01-24 18:13:00-08	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/-4893407016933953647.html	891	\N
Yuppie Fishtanks: YIMBYism explained without "supply and demand"	http://noahpinionblog.blogspot.com/2018/07/yimbyism-explained-without-supply-and.html	2018-07-27 11:50:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/-1654702827324452231.html	891	\N
Noah Smith's Japan Travel Guide	http://noahpinionblog.blogspot.com/2018/06/noah-smiths-japan-travel-guide.html	2018-07-13 23:19:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/-7788516013875804870.html	891	\N
Book Review - "The Space Between Us"	http://noahpinionblog.blogspot.com/2018/06/book-review-space-between-us.html	2018-06-30 20:41:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/6426775891451677221.html	891	\N
DeLong vs. Krugman on globalization	http://noahpinionblog.blogspot.com/2018/04/delong-vs-krugman-on-globalization.html	2018-04-01 02:48:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/-4217644899530062155.html	891	\N
Sheepskin effects - signals without signaling	http://noahpinionblog.blogspot.com/2017/12/sheepskin-effects-signals-without.html	2017-12-18 15:01:00-08	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/-1861748344034076423.html	891	\N
The "cackling cartoon villain" defense of DSGE	http://noahpinionblog.blogspot.com/2017/11/the-cackling-cartoon-villain-defense-of.html	2017-11-15 10:27:00-08	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/8362112655579602019.html	891	\N
Defending Thaler from the guerrilla resistance	http://noahpinionblog.blogspot.com/2017/10/defending-thaler-from-guerrilla.html	2017-10-09 21:44:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/230855709782006120.html	891	\N
Handwaving on health care	http://noahpinionblog.blogspot.com/2017/09/handwaving-on-health-care.html	2017-09-27 19:14:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/9218873980964242772.html	891	\N
Speech on campus: A reply to Brad DeLong	http://noahpinionblog.blogspot.com/2017/09/speech-on-campus-reply-to-brad-delong.html	2017-09-23 12:04:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/-1699320813459563769.html	891	\N
What we didn't get	http://noahpinionblog.blogspot.com/2017/09/what-we-didnt-get.html	2017-09-21 20:04:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/353150247519046405.html	891	\N
The margin of stupid	http://noahpinionblog.blogspot.com/2017/09/the-margin-of-stupid.html	2017-09-20 22:51:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/2447947353089846512.html	891	\N
a16z podcast on trade	http://noahpinionblog.blogspot.com/2017/09/a16z-podcast-on-trade.html	2017-09-10 11:31:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/8795665507783794659.html	891	\N
Realism in macroeconomic modeling	http://noahpinionblog.blogspot.com/2017/09/realism-in-macroeconomic-modeling.html	2017-09-08 16:29:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/4855209035289654180.html	891	\N
An American Whitopia would be a dystopia	http://noahpinionblog.blogspot.com/2017/09/an-american-whitopia-would-be-dystopia.html	2017-09-07 13:48:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/-1324006513810342785.html	891	\N
The Market Power Story	http://noahpinionblog.blogspot.com/2017/08/the-market-power-story.html	2017-08-23 23:03:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/1121355894359424588.html	891	\N
"Theory vs. Data" in statistics too	http://noahpinionblog.blogspot.com/2017/08/theory-vs-data-in-statistics-too.html	2017-08-16 23:31:00-07	Noah Smith	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/noahpinion/1017583073990024191.html	891	\N
The O-Ring Model of Development	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/cDeX_ZkHwks/the-o-ring-model-of-development.html	2019-10-15 14:36:51-07	Alex Tabarrok	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/2025796668484797762.html	187	\N
Observability and Time	https://www.ribbonfarm.com/2019/10/15/observability-and-time/	2019-10-15 10:15:10-07	Venkatesh Rao	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/ribbonfarm/-452730012013265787.html	190	\N
Book summary: Unlocking the Emotional Brain	https://www.lesswrong.com/posts/i9xyZBS3qzA8nFXNQ/book-summary-unlocking-the-emotional-brain	2019-10-14 11:10:27-07	Kaj_Sotala	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/less_wrong/-7889219406885895438.html	972	\N
Asking Permission	https://srconstantin.wordpress.com/2019/08/02/permissions-in-governance/	2019-08-02 12:44:48-07	Sarah Constantin	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/otium/-3763136815478665507.html	975	\N
To My Fellow Billionaires …	https://www.epsilontheory.com/to-my-fellow-billionaires/	2019-10-15 13:14:55-07	Ben Hunt		978	\N
Why Data Is Not the New Oil	https://truthonthemarket.com/2019/10/08/why-data-is-not-the-new-oil/	2019-10-08 14:41:41-07	Alec Stapp	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/8436738706807277592.html	981	\N
List of resolved confusions about IDA	https://www.lesswrong.com/posts/FdfzFcRvqLf4k5eoQ/list-of-resolved-confusions-about-ida	2019-10-08 16:55:04-07	Wei_Dai	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/less_wrong/3407009346017058595.html	972	\N
Noticing Frame Differences	https://www.lesswrong.com/posts/f886riNJcArmpFahm/noticing-frame-differences	2019-10-04 19:19:55-07	Raemon	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/less_wrong/-97186043237630616.html	972	\N
Bioinfohazards	https://www.lesswrong.com/posts/ygFc4caQ6Nws62dSW/bioinfohazards	2019-10-02 11:27:13-07	Spiracular	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/less_wrong/6768449670767355546.html	972	\N
Heads I Win, Tails?—Never Heard of Her; Or, Selective Reporting and the Tragedy of the Green Rationalists	https://www.lesswrong.com/posts/DoPo4PDjgSySquHX8/heads-i-win-tails-never-heard-of-her-or-selective-reporting	2019-09-26 17:12:40-07	Zack_M_Davis	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/less_wrong/-7598437852766363034.html	972	\N
Subagents, neural Turing machines, thought selection, and blindspots	https://www.lesswrong.com/posts/7zQPYQB5EeaqLrhBh/subagents-neural-turing-machines-thought-selection-and	2019-09-21 21:20:46-07	Kaj_Sotala	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/less_wrong/-6170508890156545569.html	972	\N
How Specificity Works	https://www.lesswrong.com/posts/pFvZXFWbtvKvGiACJ/how-specificity-works	2019-09-16 15:59:23-07	Liron	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/less_wrong/-3348073278744266634.html	972	\N
Book Review: Secular Cycles	https://www.lesswrong.com/posts/2weRdcvqANDq3zdPH/book-review-secular-cycles	2019-09-09 15:17:06-07	Scott Alexander	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/less_wrong/-3910626809170547149.html	972	\N
The Real Rules Have No Exceptions	https://www.lesswrong.com/posts/duxy4Hby5qMsv42i8/the-real-rules-have-no-exceptions	2019-09-04 12:34:19-07	Said Achmiz	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/less_wrong/1559953561677480022.html	972	\N
Why Subagents?	https://www.lesswrong.com/posts/3xF66BNSC5caZuKyC/why-subagents	2019-09-01 14:21:30-07	johnswentworth	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/less_wrong/4760252887432797972.html	972	\N
The Costs of Reliability	https://srconstantin.wordpress.com/2019/07/20/the-costs-of-reliability/	2019-07-19 18:18:26-07	Sarah Constantin	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/otium/2053135782784803934.html	975	\N
Book Review: Why Are The Prices So Damn High?	https://srconstantin.wordpress.com/2019/06/28/book-review-why-are-the-prices-so-damn-high/	2019-06-28 12:30:54-07	Sarah Constantin	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/otium/6152463741756648250.html	975	\N
Circle Games	https://srconstantin.wordpress.com/2019/06/06/circle-games/	2019-06-06 09:36:08-07	Sarah Constantin	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/otium/1652077121664816496.html	975	\N
Pecking Order and Flight Leadership	https://srconstantin.wordpress.com/2019/04/29/pecking-order-and-flight-leadership/	2019-04-29 13:23:48-07	Sarah Constantin	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/otium/1764577249474638827.html	975	\N
Degrees of Freedom	https://srconstantin.wordpress.com/2019/04/02/degrees-of-freedom/	2019-04-02 14:09:00-07	Sarah Constantin	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/otium/-7338522362491274450.html	975	\N
Personalized Medicine For Real	https://srconstantin.wordpress.com/2019/03/04/personalized-medicine-for-real/	2019-03-04 14:32:18-08	Sarah Constantin	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/otium/-3663502742955928126.html	975	\N
The Tale of Alice Almost: Strategies for Dealing With Pretty Good People	https://srconstantin.wordpress.com/2019/02/27/the-tale-of-alice-almost-strategies-for-dealing-with-pretty-good-people/	2019-02-26 23:02:09-08	Sarah Constantin	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/otium/6726528505048541965.html	975	\N
Humans Who Are Not Concentrating Are Not General Intelligences	https://srconstantin.wordpress.com/2019/02/25/humans-who-are-not-concentrating-are-not-general-intelligences/	2019-02-25 12:32:58-08	Sarah Constantin	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/otium/8584677109722857339.html	975	\N
The Relationship Between Hierarchy and Wealth	https://srconstantin.wordpress.com/2019/01/23/the-relationship-between-hierarchy-and-wealth/	2019-01-22 17:58:12-08	Sarah Constantin	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/otium/-8848743275372131270.html	975	\N
ET Election Index (Candidates) – October 15, 2019	https://www.epsilontheory.com/et-election-index-candidates-october-15-2019/	2019-10-15 04:25:23-07	Rusty Guinn		978	\N
The Common Knowledge of Inflation	https://www.epsilontheory.com/the-common-knowledge-of-inflation/	2019-10-11 11:53:24-07	Ben Hunt		978	\N
US Recession Monitor – 9.30.2019	https://www.epsilontheory.com/us-recession-monitor-9-30-2019/	2019-10-10 14:51:06-07	Rusty Guinn		978	\N
US Fiscal Policy Monitor – 9.30.2019	https://www.epsilontheory.com/us-fiscal-policy-monitor-9-30-2019/	2019-10-10 14:33:41-07	Rusty Guinn		978	\N
Trade and Tariffs Monitor – 9.30.2019	https://www.epsilontheory.com/trade-and-tariffs-monitor-9-30-2019/	2019-10-10 14:10:14-07	Rusty Guinn		978	\N
Central Bank Omnipotence Monitors – 9.30.2019	https://www.epsilontheory.com/central-bank-omnipotence-monitors-9-30-2019/	2019-10-10 13:54:59-07	Rusty Guinn		978	\N
Inflation Monitor – 9.30.2019	https://www.epsilontheory.com/inflation-monitor-9-30-2019/	2019-10-10 12:55:55-07	Rusty Guinn		978	\N
In Chinese, the Emphasis is on the Second Syllable	https://www.epsilontheory.com/in-chinese-the-emphasis-is-on-the-second-syllable/	2019-10-09 12:06:40-07	Ben Hunt		978	\N
Coal Mine, Meet Canary	https://www.epsilontheory.com/coal-mine-meet-canary/	2019-10-08 08:15:16-07	Ben Hunt		978	\N
Any Way You Measure It, Warren Is Wrong to Claim “Facebook and Google Account for 70% of All Internet Traffic”	https://truthonthemarket.com/2019/10/01/any-way-you-measure-it-warren-is-wrong-to-claim-facebook-and-google-account-for-70-of-all-internet-traffic/	2019-10-01 17:33:38-07	Alec Stapp	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-8435465767121487713.html	981	\N
Debunking Elizabeth Warren’s Claim That “More Than 70% of All Internet Traffic Goes through Google or Facebook”	https://truthonthemarket.com/2019/09/27/debunking-elizabeth-warrens-claim-that-more-than-70-of-all-internet-traffic-goes-through-google-or-facebook/	2019-09-27 05:00:27-07	Alec Stapp	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/5532402483729774097.html	981	\N
Call for Papers and Proposals – Nebraska Rural Digital Divide Roundtable	https://truthonthemarket.com/2019/09/20/call-for-papers-and-proposals-nebraska-rural-digital-divide-roundtable/	2019-09-20 19:14:12-07	Kristian Stout	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/1008919663995576238.html	981	\N
Vertical Mergers: Fast Food, Folklore, and Fake News	https://truthonthemarket.com/2019/09/17/vertical-mergers-fast-food-folklore-and-fake-news/	2019-09-17 05:00:09-07	Eric Fruits	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/4939462066237125239.html	981	\N
The Real Story about Amazon, Counterfeit Listings, and Minimum Advertised Price (MAP) Policies	https://truthonthemarket.com/2019/09/13/the-real-story-about-amazon-counterfeit-listings-and-minimum-advertised-price-map-policies/	2019-09-13 10:42:47-07	Manne, Stout &#38; Stapp	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-4173930375640002564.html	981	\N
What’s the Harm of Targeted Ads on Children’s Content Anyway?	https://truthonthemarket.com/2019/09/12/whats-the-harm-of-targeted-ads-on-childrens-content-anyway/	2019-09-12 05:00:10-07	Ben Sperry	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/1134296715527799217.html	981	\N
The Digital Policy of the Next EU Commission: All roads Lead to Margrethe Vestager	https://truthonthemarket.com/2019/09/10/the-digital-policy-of-the-next-eu-commission-all-roads-lead-to-margrethe-vestager/	2019-09-10 12:27:35-07	Dirk Auer	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/6457507214228707394.html	981	\N
Kochland: An Inadvertent Paean to the Glories of the Free Market	https://truthonthemarket.com/2019/09/05/kochland-an-inadvertent-paean-to-the-glories-of-the-free-market/	2019-09-05 13:34:15-07	Kristian Stout	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/7387682283310725348.html	981	\N
The District Court’s FTC v. Qualcomm Decision Rests on Impermissible Inferences and Should Be Reversed	https://truthonthemarket.com/2019/09/03/the-district-courts-ftc-v-qualcomm-decision-rests-on-impermissible-inferences/	2019-09-03 05:22:42-07	Geoffrey Manne &#38; Ben Sperry	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-7673758391020063536.html	981	\N
In FTC v. Qualcomm, Judge Koh Gets Lost in the Weeds	https://truthonthemarket.com/2019/08/28/in-ftc-v-qualcomm-judge-koh-gets-lost-in-the-weeds/	2019-08-28 08:00:09-07	Dirk Auer	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-8214858660328483899.html	981	\N
7 Things Netflix’s ‘The Great Hack’ Gets Wrong About the Facebook–Cambridge Analytica Data Scandal	https://truthonthemarket.com/2019/08/27/7-things-netflixs-the-great-hack-gets-wrong-about-the-facebook-cambridge-analytica-data-scandal/	2019-08-27 11:14:23-07	Alec Stapp	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-493479654368727540.html	981	\N
The Capitalist Paradox: How Cooperation Enables Free Market Competition	https://truthonthemarket.com/2019/08/21/the-capitalist-paradox-how-cooperation-enables-free-market-competition/	2019-08-21 14:14:52-07	Paul H. Rubin	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-3591321995092001008.html	981	\N
A Regulatory Failure of Imagination	https://truthonthemarket.com/2019/08/21/a-regulatory-failure-of-imagination/	2019-08-21 12:08:18-07	Julian Morris and Kristian Stout	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-8408865914864345385.html	981	\N
Why Don’t People Talk About Breaking Up Microsoft?	https://truthonthemarket.com/2019/08/08/why-dont-people-talk-about-breaking-up-microsoft/	2019-08-08 11:43:47-07	Alec Stapp	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-5770449145643732512.html	981	\N
Should We Break Up Big Tech?  A Look Behind the (Political) Scenes	https://truthonthemarket.com/2019/08/05/should-we-break-up-big-tech-a-look-behind-the-political-scenes/	2019-08-05 12:26:49-07	Thibault Schrepel	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/859657110389558849.html	981	\N
Municipal Revenue Extraction Should Not Stand in the Way of Next Generation Broadband	https://truthonthemarket.com/2019/07/30/municipal-revenue-extraction-should-not-stand-in-the-way-of-next-generation-broadband/	2019-07-30 10:38:35-07	Kristian Stout	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-6714415605381285001.html	981	\N
Who’s the Real Destroyer of Retail	https://truthonthemarket.com/2019/07/26/whos-the-real-destroyer-of-retail/	2019-07-26 14:26:57-07	Julian Morris and Kristian Stout	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-2809813969854141935.html	981	\N
T-Mobile Sprints to the Finish Line: States Demand a Do-Over	https://truthonthemarket.com/2019/07/26/t-mobile-sprints-to-the-finish-line-states-demand-a-do-over/	2019-07-26 13:37:16-07	Eric Fruits	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/5185102984406369747.html	981	\N
Merger Lore: Dispelling the Myth of the Maverick	https://truthonthemarket.com/2019/07/24/merger-lore-dispelling-the-myth-of-the-maverick/	2019-07-24 11:04:33-07	Eric Fruits	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-486308484029983811.html	981	\N
Breaking up Facebook Would Be a Technical and Organizational Nightmare — and Would Almost Certainly Harm Consumers	https://truthonthemarket.com/2019/07/24/breaking-up-facebook-would-be-a-technical-and-organizational-nightmare-and-would-almost-certainly-harm-consumers/	2019-07-24 09:00:37-07	William Eric Rinehart	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/5437101723963521044.html	981	\N
The Unconstitutionality of the FCC’s Leased Access Rules	https://truthonthemarket.com/2019/07/24/the-unconstitutionality-of-the-fccs-leased-access-rules/	2019-07-24 08:03:03-07	Ben Sperry	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/5058295541540625677.html	981	\N
Separation without a Breakup	https://truthonthemarket.com/2019/07/22/separation-without-a-breakup/	2019-07-22 05:56:40-07	Pallavi Guniganti	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/7138173215669733502.html	981	\N
Big Tech and Antitrust	https://truthonthemarket.com/2019/07/19/big-tech-and-antitrust/	2019-07-19 08:18:29-07	John Lopatka	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/2702878024816457944.html	981	\N
Breaking Up:  “It’s Not You, It’s Me”, “Maybe We Should See Other People” and “with or without You”	https://truthonthemarket.com/2019/07/19/breaking-up-its-not-you-its-me-maybe-we-should-see-other-people-and-with-or-without-you/	2019-07-19 05:49:08-07	Philip Marsden	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/4214786024701841729.html	981	\N
Should Patent Hold-Out Concerns Trump Patent Hold-Up Misgivings?	https://truthonthemarket.com/2019/07/18/should-patent-hold-out-concerns-trump-patent-hold-up-misgivings/	2019-07-18 08:26:47-07	Llobet &#38; Padilla	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-7375320681119631544.html	981	\N
FTC v. Qualcomm: A Case of Regulatory Capture?	https://truthonthemarket.com/2019/07/18/ftc-v-qualcomm-a-case-of-regulatory-capture/	2019-07-18 07:51:31-07	Jonathan M. Barnett	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/806817355940310214.html	981	\N
Breaking up Amazon? Platforms, Private Labels and Entry	https://truthonthemarket.com/2019/07/17/breaking-up-amazon-platforms-private-labels-and-entry/	2019-07-17 16:14:06-07	Randal C. Picker	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/8440188683469350374.html	981	\N
The Third Circuit’s Oberdorf v. Amazon opinion offers a good approach to reining in the worst abuses of Section 230	https://truthonthemarket.com/2019/07/15/the-third-circuits-oberdorf-v-amazon-opinion-offers-a-good-approach-to-reining-in-the-worst-abuses-of-section-230/	2019-07-15 10:11:05-07	Gus Hurwitz	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/673503677364722486.html	981	\N
There’s nothing “conservative” about Trump’s views on free speech and the regulation of social media	https://truthonthemarket.com/2019/07/12/theres-nothing-conservative-about-trumps-views-on-free-speech/	2019-07-12 15:39:44-07	Ben Sperry	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-2621914601290357991.html	981	\N
Section 230 principles for lawmakers and a note of caution as Trump convenes his “social media summit”	https://truthonthemarket.com/2019/07/11/section-230-principles-for-lawmakers/	2019-07-11 04:30:34-07	Geoffrey Manne	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-7682009371493484788.html	981	\N
Economic Calculation in the Public Defender’s Office	https://truthonthemarket.com/2019/07/10/economic-calculation-in-the-public-defenders-office/	2019-07-10 07:28:26-07	Ben Sperry	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/9103083356178427898.html	981	\N
10 Reasons Why the California Consumer Privacy Act (CCPA) Is Going to Be a Dumpster Fire	https://truthonthemarket.com/2019/07/01/10-reasons-why-the-california-consumer-privacy-act-ccpa-is-going-to-be-a-dumpster-fire/	2019-07-01 13:46:18-07	Alec Stapp	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-4666012281461984927.html	981	\N
Reports of the press’s death are greatly … understated	https://truthonthemarket.com/2019/06/25/reports-of-the-presss-death-are-greatly-understated/	2019-06-25 09:19:53-07	Gus Hurwitz	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-8290051935938726866.html	981	\N
New Paper Reveals “Stealth” Consolidation But Competitive Effects Remain Hidden	https://truthonthemarket.com/2019/06/20/new-paper-reveals-stealth-consolidation-but-competitive-effects-remain-hidden/	2019-06-20 09:43:25-07	Alec Stapp	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/2912361536613259457.html	981	\N
The FTC’s Errors in 1-800 Contacts	https://truthonthemarket.com/2019/06/18/the-ftcs-errors-in-1-800-contacts/	2019-06-18 12:32:36-07	Thom Lambert	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-1127461758585209138.html	981	\N
Can Experts Structure Markets? Don’t Count On It.	https://truthonthemarket.com/2019/05/28/can-experts-structure-markets-dont-count-on-it/	2019-05-28 05:00:34-07	Corbin K. Barthold	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-8711834916919792293.html	981	\N
GDPR After One Year: Costs and Unintended Consequences	https://truthonthemarket.com/2019/05/24/gdpr-after-one-year-costs-and-unintended-consequences/	2019-05-24 05:00:14-07	Alec Stapp	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/1529594480311394199.html	981	\N
Balancing competition and innovation in the drug industry: An evaluation of current proposals.	https://truthonthemarket.com/2019/05/17/balancing-competition-and-innovation-in-the-drug-industry-an-evaluation-of-current-proposals/	2019-05-17 04:14:15-07	Joanna Shepherd	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-2845558912084943302.html	981	\N
A Bargaining Model v. Reality in FTC v. Qualcomm: A Reply to Kattan & Muris	https://truthonthemarket.com/2019/05/15/a-bargaining-model-v-reality-in-ftc-v-qualcomm-a-reply-to-kattan-muris/	2019-05-15 10:59:27-07	Ginsburg &#38; Wright	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-712178258737971336.html	981	\N
In Apple v Pepper, SCOTUS leaves home without its Amex	https://truthonthemarket.com/2019/05/13/dementia-sets-in-at-scotus-as-the-justices-collectively-mislay-amex/	2019-05-13 12:49:23-07	Geoffrey Manne &#38; Kristian Stout	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-4644123328062919505.html	981	\N
An Evidentiary Cornerstone of the FTC’s Antitrust Case Against Qualcomm May Have Rested on Manipulated Data	https://truthonthemarket.com/2019/05/13/an-evidentiary-cornerstone-of-the-ftcs-antitrust-case-against-qualcomm-may-have-rested-on-manipulated-data/	2019-05-13 10:54:41-07	Geoffrey Manne	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/7531333906476438594.html	981	\N
Is Amazon Guilty of Predatory Pricing?	https://truthonthemarket.com/2019/05/07/is-amazon-guilty-of-predatory-pricing/	2019-05-07 11:58:54-07	Kristian Stout &#38; Alec Stapp	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/8152660032162459109.html	981	\N
The ICANN Board’s Important Test of Independence: .Amazon	https://truthonthemarket.com/2019/05/02/the-icann-boards-important-test-of-independence-amazon/	2019-05-02 08:42:25-07	Kristian Stout	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/5878148696698977583.html	981	\N
Deadweight loss from no monopoly	https://truthonthemarket.com/2019/04/25/deadweight-loss-from-no-monopoly/	2019-04-25 08:36:27-07	Eric Fruits	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-6873452926305475336.html	981	\N
What Zoom can tell us about network effects and competition policy in digital markets	https://truthonthemarket.com/2019/04/24/what-zoom-can-tell-us-about-network-effects-and-competition-policy-in-digital-markets/	2019-04-24 14:15:17-07	Dirk Auer	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/2923543318817720284.html	981	\N
We need leaders that embrace complexity, not dumb it down	https://truthonthemarket.com/2019/04/16/we-need-leaders-that-embrace-complexity-not-dumb-it-down/	2019-04-16 03:30:20-07	Gus Hurwitz	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-4523687183995005573.html	981	\N
Is European Competition Law Protectionist? Unpacking the Commission’s Unflattering Track Record	https://truthonthemarket.com/2019/04/03/is-european-competition-law-protectionist-unpacking-the-commissions-unflattering-track-record/	2019-04-03 14:29:15-07	Dirk Auer	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/4521376406217428395.html	981	\N
Amazon is not essential	https://truthonthemarket.com/2019/04/02/amazon-is-not-essential/	2019-04-02 10:33:10-07	Kristian Stout	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/6782668074773403898.html	981	\N
This Too Shall Pass: Unassailable Monopolies That Were, in Hindsight, Eminently Assailable	https://truthonthemarket.com/2019/04/01/this-too-shall-pass-unassailable-monopolies-that-were-in-hindsight-eminently-assailable/	2019-04-01 11:37:00-07	Geoffrey Manne &#38; Alec Stapp	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/-6323228518538666666.html	981	\N
MacOS Tip of the Year: Turn Off Spotlight Suggestions in Look Up	https://twitter.com/craigmod/status/1177445871740305409	2019-10-10 18:15:44-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-2628922097334117115.html	1244	\N
What is the incidence of the corporate income tax?	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/Zv17y2v5sk8/what-is-the-incidence-of-the-corporate-income-tax.html	2019-10-16 21:31:04-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/714261357856359726.html	187	\N
Google and Ambient Computing	https://stratechery.com/2019/google-and-ambient-computing/	2019-10-16 07:51:10-07	Ben Thompson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/stratechery/6451910383344110107.html	193	\N
A Coupon for Kids, by Bryan Caplan	https://www.econlib.org/a-coupon-for-kids/	2019-10-16 07:33:04-07	Bryan Caplan	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/bryan_caplan_econlib/9102658419403733851.html	205	\N
State Rating Agencies	http://www.overcomingbias.com/2019/10/state-rating-agencies.html	2019-10-16 11:00:51-07	Robin Hanson	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/overcoming_bias/4002252424078508757.html	858	\N
Domino Theory	https://www.epsilontheory.com/domino-theory/	2019-10-15 20:12:15-07	Ben Hunt		978	\N
Does Apple’s “Discrimination” Against Rival Apps in the App Store harm Consumers?	https://truthonthemarket.com/2019/10/16/does-apples-discrimination-against-rival-apps-in-the-app-store-harm-consumers/	2019-10-16 13:59:56-07	Ben Sperry	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/truthonthemarket/6347521946115039239.html	981	\N
Those new service sector jobs	http://feedproxy.google.com/~r/marginalrevolution/feed/~3/nmORq4cfr4E/those-new-service-sector-jobs-3.html	2019-10-16 22:56:43-07	Tyler Cowen	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/marginal_revolution/5810885909957942747.html	187	\N
Is Enlightenment Compatible With Sex Scandals?	https://slatestarcodex.com/2019/10/16/is-enlightenment-compatible-with-sex-scandals/	2019-10-16 22:41:02-07	Scott Alexander	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/slatestarcodex/6635205728842913910.html	196	\N
Conformity and Perspective in Nickel and Dimed, by Bryan Caplan	https://www.econlib.org/conformity-and-perspective-in-nickel-and-dimed/	2019-10-17 07:28:03-07	Bryan Caplan	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/bryan_caplan_econlib/3007845024100334285.html	205	\N
The Long Now, Pt. 3 – Is This Normal? Asking for a Friend	https://www.epsilontheory.com/the-long-now-pt-3-is-this-normal-asking-for-a-friend/	2019-10-17 05:25:58-07	Ben Hunt		978	\N
The Time Signature of ‘The Terminator’ Score	https://slate.com/culture/2014/02/the-time-signature-of-the-terminator-score-is-a-mystery-for-the-ages.html	2019-10-17 09:03:12-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/4093409164321486696.html	1244	\N
Google’s Auto-Delete Data Tools Are Effectively Worthless	https://www.fastcompany.com/90416822/googles-auto-delete-tools-are-practically-worthless-for-privacy	2019-10-16 14:41:24-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-1859959120678049353.html	1244	\N
Bloomberg: ‘Apple’s 5G IPhone Delay Stings as Next-Gen Devices Hit Shelves’	https://www.bloomberg.com/news/articles/2019-10-15/apple-s-5g-iphone-delay-stings-as-next-gen-devices-hit-shelves	2019-10-15 20:36:47-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-945050181365469038.html	1244	\N
Wireless Pixel Buds: $180 and Not Coming Until Spring 2020	https://www.theverge.com/2019/10/15/20908079/google-pixel-buds-2-earbuds-hands-on-photo-video-wireless-features-bluetooth	2019-10-15 10:24:17-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/7515336831611966307.html	1244	\N
The Verge’s First Look at Pixel 4 and 4 XL	https://www.theverge.com/2019/10/15/20908071/google-pixel-4-xl-photos-video-hands-on-camera-screen-specs-price	2019-10-15 10:18:19-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-3535007725619154353.html	1244	\N
‘How Safe Is Apple’s Safe Browsing?’	https://blog.cryptographyengineering.com/2019/10/13/dear-apple-safe-browsing-might-not-be-that-safe/	2019-10-14 15:50:06-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/7562167368920179128.html	1244	\N
Trust but Verify, ‘Safari Fraudulent Website Warning’ Edition	https://twitter.com/dinodaizovi/status/1183527857974403073	2019-10-14 15:25:03-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-9113517873562026778.html	1244	\N
Safari’s Fraudulent Website Warning Feature Only Uses Tencent in Mainland China	https://www.imore.com/heres-apples-statement-safari-fraudulent-website-warning-and-tencent	2019-10-14 15:17:00-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-6487251213966893218.html	1244	\N
NYT: ‘Trump Followed His Gut on Syria. Calamity Came Fast.’	https://www.nytimes.com/2019/10/14/world/middleeast/trump-turkey-syria.html?smid=nytcore-ios-share	2019-10-14 15:16:26-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/3883436726025523101.html	1244	\N
[Sponsor] Addigy: Unified Apple Device Management	https://addigy.com/daringfireball/?utm_source=daringfireball&utm_medium=paid-display&utm_campaign=daringfireball101419	2019-10-14 15:40:45-07	Daring Fireball Department of Commerce	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/8713032222144463001.html	1244	\N
Kolide	https://kolide.com/?utm_source=df&utm_medium=talkshow&utm_campaign=launch	2019-10-12 13:07:26-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-1694830273816524440.html	1244	\N
BuzzFeed: ‘Apple Told Some Apple TV+ Show Developers Not to Anger China’	https://www.buzzfeednews.com/article/alexkantrowitz/apple-china-tv-protesters-hong-kong-tim-cook	2019-10-12 13:04:31-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-1553861764244758146.html	1244	\N
Apple Needs China	https://www.vox.com/recode/2019/10/10/20908480/apple-china-hkmap-app-censorship-hong-kong-protests-tim-cook	2019-10-11 18:53:52-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/7144904844239269230.html	1244	\N
What’s New in iOS 13.2 Beta 2: Siri Privacy and Video Settings in the Camera App	https://www.macrumors.com/2019/10/10/everything-new-in-ios-13-2-beta-2/	2019-10-11 17:29:27-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/453886645253354512.html	1244	\N
Ming-Chi Kuo Expects Apple to Launch AR Glasses in Second Quarter of 2020	https://www.macrumors.com/2019/10/09/kuo-apple-ar-headset-launch-q2-2020/	2019-10-11 15:54:32-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-1059668304598260124.html	1244	\N
BuzzFeed News: ‘Disgraced Google Exec Andy Rubin Quietly Left His Venture Firm Earlier This Year’	https://www.buzzfeednews.com/article/ryanmac/andy-rubin-playground-global-google-quiet-departure	2019-10-11 10:13:08-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-3344527778725148591.html	1244	\N
★ Gurman on Catalyst’s Shaky Debut	https://daringfireball.net/2019/10/gurman_on_catalysts_shaky_debut	2019-10-11 09:44:13-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/4615830645634888442.html	1244	\N
Crazy Apple Rumors Site: ‘Apple Revokes Panic Developer License’	http://crazyapplerumors.com/2019/10/10/apple-revokes-panic-developer-license/	2019-10-10 13:55:04-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/4864952465905184599.html	1244	\N
NYT: ‘China Blows Whistle on Nationalistic Protests Against the NBA’	https://www.nytimes.com/2019/10/10/business/china-blows-whistle-on-nationalist-protests-against-the-nba.html?smid=nytcore-ios-share	2019-10-10 13:40:13-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/7465491843778653641.html	1244	\N
Hong Kong Legislator Charles Mok Writes Open Letter to Tim Cook	https://twitter.com/charlesmok/status/1182336160611201024	2019-10-10 11:27:18-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/6414550024822752003.html	1244	\N
Tim Cook’s Company-Wide Memo on HKmap.live Doesn’t Add Up	https://twitter.com/Pinboard/status/1182348757360234497	2019-10-10 11:06:38-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-4709419119848662327.html	1244	\N
Hong Kong Officials on Why HKmap.live Should Be Removed From App Store: Ask Apple	https://twitter.com/TMclaughlin3/status/1182301330339184641	2019-10-10 10:37:12-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-6692730324799808302.html	1244	\N
Apple Removes HKmap.live From App Store	https://www.nytimes.com/2019/10/09/technology/apple-hong-kong-app.html	2019-10-09 22:04:54-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/4774872367267496935.html	1244	\N
Apple Removes Quartz News App in China Over Hong Kong Coverage	https://www.theverge.com/2019/10/9/20907228/apple-quartz-app-store-china-removal-hong-kong-protests-censorship	2019-10-09 21:57:09-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/3578938086288702311.html	1244	\N
‘The Making of Operator 41’	https://www.youtube.com/watch?v=MGxcmBfZktQ	2019-10-09 18:22:36-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-2158612319172696012.html	1244	\N
Bloomberg: ‘Trump Urged Tillerson to Help Giuliani Client Facing DOJ Charges’	https://www.bloomberg.com/news/articles/2019-10-09/trump-urged-top-aide-to-help-giuliani-client-facing-doj-charges	2019-10-09 17:35:46-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/8253713608668056523.html	1244	\N
Blizzard Sets Off Backlash for Penalizing Hong Kong Gamer Who Expressed Support for Protesters	https://www.nytimes.com/2019/10/09/world/asia/blizzard-hearthstone-hong-kong.html	2019-10-09 17:03:52-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/3204233988939206312.html	1244	\N
Fox News Poll: 51 Percent of Voters Want Trump Impeached and Removed From Office	https://www.foxnews.com/politics/fox-news-poll-record-support-for-trump-impeachment	2019-10-09 17:02:31-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-4244078935881024816.html	1244	\N
On the Disposability of AirPods	https://www.washingtonpost.com/technology/2019/10/08/everyones-airpods-will-die-weve-got-trick-replacing-them/	2019-10-09 15:36:41-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-1768214299038157252.html	1244	\N
Why the HKmap.live App Is Important to Hongkongers	https://twitter.com/Pinboard/status/1181790019943452675	2019-10-09 12:31:04-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-272122728480258300.html	1244	\N
‘ESPN Forbids Discussion of Chinese Politics When Discussing Daryl Morey’s Tweet About Chinese Politics’	https://deadspin.com/internal-memo-espn-forbids-discussion-of-chinese-polit-1838881032	2019-10-09 12:26:01-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-7666872181392075926.html	1244	\N
Apple Under Fire From Chinese State Media Over HKmap.live App	https://www.scmp.com/news/article/3032081/apple-draws-fire-china-selling-app-maps-police-activity-hong-kong	2019-10-09 12:16:32-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/8297453573053233536.html	1244	\N
Sixers Fans Ejected From Exhibition Game in Philadelphia After Supporting Hong Kong	https://whyy.org/articles/a-sixers-fan-brought-a-free-hong-kong-sign-to-tuesdays-game-heres-what-happened-next/	2019-10-09 12:14:06-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-6880204612765148509.html	1244	\N
Drexel to Pay Back $190,000 Former Professor Used for Strip Clubs, Other Purchases Over 10 Years	https://www.cnn.com/2019/10/08/us/pennsylvania-drexel-professor-strip-club-money/index.html	2019-10-09 10:04:47-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-8121059258603359360.html	1244	\N
The Talk Show: ‘Thompson’s Razor’	https://daringfireball.net/thetalkshow/2019/10/08/ep-265	2019-10-08 19:37:27-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/8030498054498917348.html	1244	\N
Andy Rubin Teases Long, Skinny Form Factor for New Essential Phone	https://twitter.com/Arubin/status/1181688540540764160	2019-10-08 15:52:12-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-298198635961679379.html	1244	\N
Catalyst’s Glaring Shortcomings	https://tla.systems/blog/2019/10/08/catalytic-converter/	2019-10-08 14:58:28-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-5082063320622302615.html	1244	\N
DragThing Officially End-of-Lifed	https://dragthing.com/	2019-10-08 10:47:40-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/7386175468948034929.html	1244	\N
BBEdit 13	https://www.barebones.com/products/bbedit/bbedit13.html	2019-10-08 10:19:35-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/4370175344977012946.html	1244	\N
Apple Delays iCloud Drive File Sharing Until ‘Next Spring’	https://www.cultofmac.com/657594/apple-delays-icloud-drive-file-sharing-until-next-spring/	2019-10-08 09:44:55-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-4522471978581286414.html	1244	\N
★ Correction: Regarding an Erroneous Allegation in ‘Richard Stallman’s Disgrace’	https://daringfireball.net/2019/10/correction_regarding_an_erroneous_allegation	2019-10-07 15:44:54-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-438019797404034343.html	1244	\N
★ Apple and Hong Kong	https://daringfireball.net/2019/10/apple_hong_kong_map	2019-10-04 06:38:54-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-3302394896743645805.html	1244	\N
★ Turns Out the Telephoto Camera on the iPhone 11 Pro Does Not Support Night Mode	https://daringfireball.net/2019/10/night_mode_telephoto	2019-10-01 17:02:31-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-1493929264463096086.html	1244	\N
★ Richard Stallman’s Disgrace	https://daringfireball.net/2019/09/richard_stallmans_disgrace	2019-09-27 12:02:29-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/-6697344767896172367.html	1244	\N
★ iOS 13 Autocorrect Is Drunk	https://daringfireball.net/2019/09/ios_13_autocorrect_is_drunk	2019-09-26 11:18:14-07	John Gruber	https://s3-us-west-1.amazonaws.com/pulpscrapedarticlestest/daring_fireball/6857956935787812890.html	1244	\N
\.


--
-- Data for Name: blogs_article_magazine; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blogs_article_magazine (id, article_id, magazine_id) FROM stdin;
\.


--
-- Data for Name: blogs_blog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blogs_blog (id, name, last_polled_time, home_url, rss_url, scraped_old_posts) FROM stdin;
202	melting_asphalt	2019-10-20 07:30:41.672032-07	https://meltingasphalt.com/	https://meltingasphalt.com/feed	t
196	slatestarcodex	2019-10-17 08:59:45.55104-07	https://slatestarcodex.com/	https://slatestarcodex.com/feed	t
184	kwokchain	2019-10-20 07:30:43.828112-07	https://kwokchain.com	https://kwokchain.com/feed	t
205	bryan_caplan_econlib	2019-10-17 08:59:46.395407-07	https://www.econlib.org/author/bcaplan/	http://www.econlib.org/feed/indexCaplan_xml	t
199	mercatus_center	2019-10-10 19:18:17.676693-07	https://www.mercatus.org/	https://www.mercatus.org/feed	t
544	eugene_wei	2019-10-17 08:59:47.017808-07	https://www.eugenewei.com/	https://eugene-wei.squarespace.com/blog?format=rss	t
592	dan_wang	2019-10-17 08:59:47.447071-07	https://danwang.co/	https://danwang.co/feed/	t
710	elaine_ou	2019-10-17 08:59:48.026922-07	https://elaineou.com/	https://elaineou.com/feed/	t
187	marginal_revolution	2019-10-17 08:59:43.718415-07	https://marginalrevolution.com/	http://feeds.feedburner.com/marginalrevolution/feed	t
663	brookings	2019-10-10 19:18:21.290468-07	https://www.brookings.edu/	http://webfeeds.brookings.edu/brookingsrss/topfeeds/latestfrombrookings?format=xml	t
190	ribbonfarm	2019-10-17 08:59:44.999682-07	https://www.ribbonfarm.com	https://www.ribbonfarm.com/feed/	t
193	stratechery	2019-10-17 08:59:45.275513-07	https://stratechery.com	https://stratechery.com/feed/	t
790	everything_studies	2019-10-17 08:59:48.564343-07	https://everythingstudies.com/	https://everythingstudies.com/feed/	t
858	overcoming_bias	2019-10-17 08:59:48.650288-07	http://www.overcomingbias.com/	http://www.overcomingbias.com/feed	t
891	noahpinion	2019-10-17 08:59:48.791951-07	http://noahpinionblog.blogspot.com	http://noahpinionblog.blogspot.com/feeds/posts/default	t
972	less_wrong	2019-10-17 08:59:49.222479-07	https://www.lesswrong.com/	https://www.lesswrong.com/feed.xml?view=curated-rss	t
975	otium	2019-10-17 08:59:49.483467-07	https://srconstantin.wordpress.com/	https://srconstantin.wordpress.com/feed/	t
978	epsilon_theory	2019-10-17 08:59:49.594254-07	https://www.epsilontheory.com/	https://www.epsilontheory.com/feed/	t
981	truthonthemarket	2019-10-17 08:59:49.941061-07	https://truthonthemarket.com/	https://truthonthemarket.com/feed/	t
1244	daring_fireball	2019-10-13 09:48:09.2377-07	https://daringfireball.net/	https://daringfireball.net/feeds/main	t
\.


--
-- Data for Name: blogs_blogblock; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blogs_blogblock (file_link, date_start, date_end, blog_id) FROM stdin;
\.


--
-- Data for Name: blogs_comment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blogs_comment (id, author, content, date_published, parent_comment_id, article_id) FROM stdin;
\.


--
-- Data for Name: blogs_magazine; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blogs_magazine (date_start, date_end, file_link, owner_id) FROM stdin;
\.


--
-- Data for Name: blogs_subscription; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blogs_subscription (id, date_subscribed, blog_id, subscriber_id) FROM stdin;
44	2019-10-15 08:14:10.025929-07	202	2
45	2019-10-15 08:14:11.550126-07	190	2
47	2019-10-15 08:14:17.801695-07	184	2
48	2019-10-15 08:14:19.0881-07	193	2
49	2019-10-15 08:15:23.471457-07	790	2
50	2019-10-15 09:05:26.45406-07	858	2
51	2019-10-17 09:59:26.663025-07	975	2
52	2019-10-17 09:59:34.661106-07	981	2
53	2019-10-17 09:59:37.151107-07	978	2
54	2019-10-17 09:59:59.638121-07	205	2
55	2019-10-17 10:00:39.082631-07	1244	2
56	2019-10-17 10:00:41.619462-07	710	2
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: django_celery_beat_clockedschedule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_clockedschedule (id, clocked_time, enabled) FROM stdin;
\.


--
-- Data for Name: django_celery_beat_crontabschedule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_crontabschedule (id, minute, hour, day_of_week, day_of_month, month_of_year, timezone) FROM stdin;
1	0	4	*	*	*	UTC
\.


--
-- Data for Name: django_celery_beat_intervalschedule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_intervalschedule (id, every, period) FROM stdin;
1	3600	seconds
2	5	seconds
\.


--
-- Data for Name: django_celery_beat_periodictask; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_periodictask (id, name, task, args, kwargs, queue, exchange, routing_key, expires, enabled, last_run_at, total_run_count, date_changed, description, crontab_id, interval_id, solar_id, one_off, start_time, priority, headers, clocked_id) FROM stdin;
1	celery.backend_cleanup	celery.backend_cleanup	[]	{}	\N	\N	\N	\N	t	2019-10-08 13:10:12.214201-07	2	2019-10-08 13:16:11.358249-07		1	\N	\N	f	\N	\N	{}	\N
2	poll-blogs	find_latest	[]	{}	\N	\N	\N	\N	t	2019-10-08 13:10:12.274316-07	12	2019-10-08 13:16:11.379334-07		\N	1	\N	f	\N	\N	{}	\N
3	send-summary	summary	[]	{}	\N	\N	\N	\N	t	2019-10-08 13:16:21.432042-07	25	2019-10-08 13:16:26.122325-07		\N	2	\N	f	\N	\N	{}	\N
\.


--
-- Data for Name: django_celery_beat_periodictasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_periodictasks (ident, last_update) FROM stdin;
1	2019-10-08 13:16:11.384885-07
\.


--
-- Data for Name: django_celery_beat_solarschedule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_celery_beat_solarschedule (id, event, latitude, longitude) FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	permission
3	auth	group
4	contenttypes	contenttype
5	sessions	session
6	blogs	comment
7	blogs	article
8	blogs	blog
9	blogs	subscription
10	payments	paymenttier
11	payments	transaction
12	payments	billinginfo
13	users	customuser
14	blogs	magazine
15	blogs	blogblock
16	payments	address
17	payments	stripetoken
18	django_celery_beat	crontabschedule
19	django_celery_beat	intervalschedule
20	django_celery_beat	periodictask
21	django_celery_beat	periodictasks
22	django_celery_beat	solarschedule
23	django_celery_beat	clockedschedule
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2019-08-07 18:20:32.526002-07
7	contenttypes	0002_remove_content_type_name	2019-08-07 18:29:59.792681-07
9	auth	0001_initial	2019-08-07 18:32:24.077299-07
10	auth	0002_alter_permission_name_max_length	2019-08-07 18:32:24.099362-07
11	auth	0003_alter_user_email_max_length	2019-08-07 18:32:24.10664-07
12	auth	0004_alter_user_username_opts	2019-08-07 18:32:24.11338-07
13	auth	0005_alter_user_last_login_null	2019-08-07 18:32:24.121193-07
14	auth	0006_require_contenttypes_0002	2019-08-07 18:32:24.123366-07
15	auth	0007_alter_validators_add_error_messages	2019-08-07 18:32:24.129398-07
16	auth	0008_alter_user_username_max_length	2019-08-07 18:32:24.13603-07
17	auth	0009_alter_user_last_name_max_length	2019-08-07 18:32:24.142777-07
18	auth	0010_alter_group_name_max_length	2019-08-07 18:32:24.152445-07
19	auth	0011_update_proxy_permissions	2019-08-07 18:32:24.162884-07
21	payments	0001_initial	2019-08-07 18:33:50.236263-07
22	users	0001_initial	2019-08-07 18:33:50.271196-07
23	admin	0001_initial	2019-08-07 18:33:50.305093-07
24	admin	0002_logentry_remove_auto_add	2019-08-07 18:33:50.320606-07
25	admin	0003_logentry_add_action_flag_choices	2019-08-07 18:33:50.330336-07
26	sessions	0001_initial	2019-08-07 18:33:50.336871-07
27	users	0002_auto_20190808_0533	2019-08-07 22:34:04.238727-07
28	blogs	0001_initial	2019-08-11 22:14:23.854373-07
29	blogs	0002_auto_20190813_0406	2019-08-12 21:06:29.174966-07
30	blogs	0003_blog_scraped_old_posts	2019-08-12 22:55:41.111658-07
31	blogs	0004_auto_20190817_0721	2019-08-17 00:21:34.0308-07
32	blogs	0005_auto_20190817_0755	2019-08-17 00:55:53.120929-07
33	blogs	0006_auto_20190829_0304	2019-08-28 20:04:31.051165-07
34	blogs	0007_article_pdf_link	2019-08-28 20:04:54.215583-07
35	blogs	0008_auto_20190903_1706	2019-09-03 10:06:52.806187-07
36	blogs	0009_auto_20190907_0047	2019-09-06 17:47:46.862875-07
37	blogs	0010_auto_20190907_0049	2019-09-06 17:49:29.031538-07
38	blogs	0011_auto_20190911_2212	2019-09-11 15:12:14.900533-07
39	payments	0002_billinginfo_customer	2019-09-11 15:12:14.946011-07
40	users	0003_remove_customuser_billing_information	2019-09-11 15:12:15.059287-07
41	blogs	0012_auto_20190911_2224	2019-09-11 15:24:54.283836-07
42	payments	0003_auto_20190911_2224	2019-09-11 15:24:54.345311-07
43	blogs	0013_auto_20190911_2225	2019-09-11 15:25:51.535656-07
44	payments	0004_auto_20190911_2225	2019-09-11 15:25:51.583144-07
45	blogs	0014_auto_20190913_0445	2019-09-12 21:45:42.902146-07
46	payments	0005_auto_20190913_0445	2019-09-12 21:45:43.010638-07
47	blogs	0015_auto_20190915_2255	2019-09-15 15:55:45.726788-07
48	payments	0006_auto_20190915_2255	2019-09-15 15:55:45.796964-07
49	blogs	0016_auto_20190917_1435	2019-09-17 07:35:33.923294-07
50	payments	0007_stripetoken	2019-09-17 07:35:34.033305-07
51	blogs	0017_auto_20190917_1753	2019-09-17 10:53:57.083742-07
52	payments	0008_delete_stripetoken	2019-09-17 10:53:57.102325-07
53	blogs	0018_auto_20190917_2257	2019-09-17 15:57:53.85746-07
54	payments	0009_auto_20190917_2257	2019-09-17 15:57:53.955466-07
55	blogs	0019_auto_20190917_2307	2019-09-17 16:16:17.983896-07
56	payments	0010_auto_20190917_2307	2019-09-17 16:16:17.997056-07
57	blogs	0020_auto_20190921_0532	2019-09-20 22:32:23.290814-07
58	payments	0011_delete_transaction	2019-09-20 22:32:23.354092-07
59	django_celery_beat	0001_initial	2019-10-06 17:55:10.756037-07
60	django_celery_beat	0002_auto_20161118_0346	2019-10-06 17:55:10.787714-07
61	django_celery_beat	0003_auto_20161209_0049	2019-10-06 17:55:10.803775-07
62	django_celery_beat	0004_auto_20170221_0000	2019-10-06 17:55:10.810688-07
63	django_celery_beat	0005_add_solarschedule_events_choices	2019-10-06 17:55:10.816098-07
64	django_celery_beat	0006_auto_20180322_0932	2019-10-06 17:55:10.842335-07
65	django_celery_beat	0007_auto_20180521_0826	2019-10-06 17:55:10.855674-07
66	django_celery_beat	0008_auto_20180914_1922	2019-10-06 17:55:10.876058-07
67	django_celery_beat	0006_auto_20180210_1226	2019-10-06 17:55:10.889375-07
68	django_celery_beat	0006_periodictask_priority	2019-10-06 17:55:10.898441-07
69	django_celery_beat	0009_periodictask_headers	2019-10-06 17:55:10.908805-07
70	django_celery_beat	0010_auto_20190429_0326	2019-10-06 17:55:11.06304-07
71	django_celery_beat	0011_auto_20190508_0153	2019-10-06 17:55:11.080155-07
72	blogs	0021_auto_20191007_0055	2019-10-06 17:55:42.711879-07
73	blogs	0022_auto_20191007_0055	2019-10-06 17:57:00.810199-07
74	blogs	0023_auto_20191007_0056	2019-10-06 17:57:00.828662-07
75	blogs	0024_auto_20191007_0057	2019-10-06 17:57:59.373038-07
76	blogs	0025_auto_20191016_0144	2019-10-15 18:45:03.621233-07
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
ufh9arzpz6l9s0l7rj3m0bt5ig6t36bx	OGQ5YzVjZWU2ZGIzZGRiNDA0ZTIzZTE1N2Q4YzJkZDBhNGNmNjgwMTp7Il9hdXRoX3VzZXJfaWQiOiIyIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIyNTRmYWNhZTI2MWM1N2IyMmNhODBlOTI0NjZjZWM5OWNlZDBlNWRlIn0=	2019-09-06 12:17:33.808209-07
r5yckd7clpdqxu5nn8pytvk9iqdgy3b7	OGQ5YzVjZWU2ZGIzZGRiNDA0ZTIzZTE1N2Q4YzJkZDBhNGNmNjgwMTp7Il9hdXRoX3VzZXJfaWQiOiIyIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIyNTRmYWNhZTI2MWM1N2IyMmNhODBlOTI0NjZjZWM5OWNlZDBlNWRlIn0=	2019-09-24 17:43:15.731903-07
qdw1e2sh3a38o7nd13psdjich4xcz654	OGQ5YzVjZWU2ZGIzZGRiNDA0ZTIzZTE1N2Q4YzJkZDBhNGNmNjgwMTp7Il9hdXRoX3VzZXJfaWQiOiIyIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIyNTRmYWNhZTI2MWM1N2IyMmNhODBlOTI0NjZjZWM5OWNlZDBlNWRlIn0=	2019-09-25 12:53:18.940267-07
9ie27thfhlgf655ffn5970gbf48imk2p	OGQ5YzVjZWU2ZGIzZGRiNDA0ZTIzZTE1N2Q4YzJkZDBhNGNmNjgwMTp7Il9hdXRoX3VzZXJfaWQiOiIyIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIyNTRmYWNhZTI2MWM1N2IyMmNhODBlOTI0NjZjZWM5OWNlZDBlNWRlIn0=	2019-10-15 15:12:47.884867-07
rl7w590lqyg4h07t8lr2fiixcatvy3jw	OGQ5YzVjZWU2ZGIzZGRiNDA0ZTIzZTE1N2Q4YzJkZDBhNGNmNjgwMTp7Il9hdXRoX3VzZXJfaWQiOiIyIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIyNTRmYWNhZTI2MWM1N2IyMmNhODBlOTI0NjZjZWM5OWNlZDBlNWRlIn0=	2019-10-15 20:59:17.563165-07
6z7zhpmg4nnz7gr6krhuwzxgx9n3hx7o	OGQ5YzVjZWU2ZGIzZGRiNDA0ZTIzZTE1N2Q4YzJkZDBhNGNmNjgwMTp7Il9hdXRoX3VzZXJfaWQiOiIyIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIyNTRmYWNhZTI2MWM1N2IyMmNhODBlOTI0NjZjZWM5OWNlZDBlNWRlIn0=	2019-10-18 21:17:37.088157-07
guidg18hp0fz45bg5gpz7wonzg5bb75n	OGQ5YzVjZWU2ZGIzZGRiNDA0ZTIzZTE1N2Q4YzJkZDBhNGNmNjgwMTp7Il9hdXRoX3VzZXJfaWQiOiIyIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIyNTRmYWNhZTI2MWM1N2IyMmNhODBlOTI0NjZjZWM5OWNlZDBlNWRlIn0=	2019-10-19 17:42:40.685887-07
hya82llk4ly826gg7zjecwraoq332cv6	OGQ5YzVjZWU2ZGIzZGRiNDA0ZTIzZTE1N2Q4YzJkZDBhNGNmNjgwMTp7Il9hdXRoX3VzZXJfaWQiOiIyIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIyNTRmYWNhZTI2MWM1N2IyMmNhODBlOTI0NjZjZWM5OWNlZDBlNWRlIn0=	2019-10-30 06:40:53.801728-07
1c4ofofrqh1rrp8ctesaukgnhlnrxlsp	OGQ5YzVjZWU2ZGIzZGRiNDA0ZTIzZTE1N2Q4YzJkZDBhNGNmNjgwMTp7Il9hdXRoX3VzZXJfaWQiOiIyIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIyNTRmYWNhZTI2MWM1N2IyMmNhODBlOTI0NjZjZWM5OWNlZDBlNWRlIn0=	2019-11-02 12:20:13.410812-07
ke6c6uw6hdq0wu1te5bw0pw0z18q9m4n	OGQ5YzVjZWU2ZGIzZGRiNDA0ZTIzZTE1N2Q4YzJkZDBhNGNmNjgwMTp7Il9hdXRoX3VzZXJfaWQiOiIyIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIyNTRmYWNhZTI2MWM1N2IyMmNhODBlOTI0NjZjZWM5OWNlZDBlNWRlIn0=	2019-11-02 15:43:22.086168-07
k9kvuxhnuqdihpndqknlu2s9yl9aaj2f	OGQ5YzVjZWU2ZGIzZGRiNDA0ZTIzZTE1N2Q4YzJkZDBhNGNmNjgwMTp7Il9hdXRoX3VzZXJfaWQiOiIyIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiZGphbmdvLmNvbnRyaWIuYXV0aC5iYWNrZW5kcy5Nb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2hhc2giOiIyNTRmYWNhZTI2MWM1N2IyMmNhODBlOTI0NjZjZWM5OWNlZDBlNWRlIn0=	2019-11-02 17:48:45.693282-07
\.


--
-- Data for Name: payments_address; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments_address (id, line_1, line_2, city, state, zip, country) FROM stdin;
\.


--
-- Data for Name: payments_billinginfo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments_billinginfo (id, delivery_address_id, stripe_customer_id, payment_tier_id, customer_id) FROM stdin;
15	\N	cus_FtJJ2yMb1ZUi46	\N	2
\.


--
-- Data for Name: payments_paymenttier; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments_paymenttier (id, tier_in_payment_option) FROM stdin;
\.


--
-- Data for Name: users_customuser; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users_customuser (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined, kindle_email_address) FROM stdin;
2	pbkdf2_sha256$150000$SUt3PfDuPlMf$eAJFf39zip1yrzfdtWCwc0jjUZjVrnTGuutaI4hrrrU=	2019-10-19 17:48:45.685865-07	t	rahul			rahul@sarathy.org	t	t	2019-08-07 22:36:20.032129-07	
\.


--
-- Data for Name: users_customuser_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users_customuser_groups (id, customuser_id, group_id) FROM stdin;
\.


--
-- Data for Name: users_customuser_user_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users_customuser_user_permissions (id, customuser_id, permission_id) FROM stdin;
\.


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 92, true);


--
-- Name: blogs_article_magazine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blogs_article_magazine_id_seq', 1, false);


--
-- Name: blogs_blog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blogs_blog_id_seq', 1339, true);


--
-- Name: blogs_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blogs_comment_id_seq', 1, false);


--
-- Name: blogs_subscription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blogs_subscription_id_seq', 56, true);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- Name: django_celery_beat_clockedschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_celery_beat_clockedschedule_id_seq', 1, false);


--
-- Name: django_celery_beat_crontabschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_celery_beat_crontabschedule_id_seq', 1, true);


--
-- Name: django_celery_beat_intervalschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_celery_beat_intervalschedule_id_seq', 2, true);


--
-- Name: django_celery_beat_periodictask_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_celery_beat_periodictask_id_seq', 3, true);


--
-- Name: django_celery_beat_solarschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_celery_beat_solarschedule_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 23, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 76, true);


--
-- Name: payments_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payments_address_id_seq', 44, true);


--
-- Name: payments_billinginfo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payments_billinginfo_id_seq', 15, true);


--
-- Name: payments_paymenttier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payments_paymenttier_id_seq', 1, false);


--
-- Name: users_customuser_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_customuser_groups_id_seq', 1, false);


--
-- Name: users_customuser_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_customuser_id_seq', 2, true);


--
-- Name: users_customuser_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_customuser_user_permissions_id_seq', 1, false);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: blogs_article_magazine blogs_article_magazine_article_id_magazine_id_132a8ce1_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_article_magazine
    ADD CONSTRAINT blogs_article_magazine_article_id_magazine_id_132a8ce1_uniq UNIQUE (article_id, magazine_id);


--
-- Name: blogs_article_magazine blogs_article_magazine_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_article_magazine
    ADD CONSTRAINT blogs_article_magazine_pkey PRIMARY KEY (id);


--
-- Name: blogs_article blogs_article_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_article
    ADD CONSTRAINT blogs_article_pkey PRIMARY KEY (permalink);


--
-- Name: blogs_blog blogs_blog_name_716fb83c_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_blog
    ADD CONSTRAINT blogs_blog_name_716fb83c_uniq UNIQUE (name);


--
-- Name: blogs_blog blogs_blog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_blog
    ADD CONSTRAINT blogs_blog_pkey PRIMARY KEY (id);


--
-- Name: blogs_blogblock blogs_blogblock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_blogblock
    ADD CONSTRAINT blogs_blogblock_pkey PRIMARY KEY (file_link);


--
-- Name: blogs_comment blogs_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_comment
    ADD CONSTRAINT blogs_comment_pkey PRIMARY KEY (id);


--
-- Name: blogs_magazine blogs_magazine_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_magazine
    ADD CONSTRAINT blogs_magazine_pkey PRIMARY KEY (file_link);


--
-- Name: blogs_subscription blogs_subscription_blog_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_subscription
    ADD CONSTRAINT blogs_subscription_blog_id_key UNIQUE (blog_id);


--
-- Name: blogs_subscription blogs_subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_subscription
    ADD CONSTRAINT blogs_subscription_pkey PRIMARY KEY (id);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_clockedschedule django_celery_beat_clockedschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_clockedschedule
    ADD CONSTRAINT django_celery_beat_clockedschedule_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_crontabschedule django_celery_beat_crontabschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_crontabschedule
    ADD CONSTRAINT django_celery_beat_crontabschedule_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_intervalschedule django_celery_beat_intervalschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_intervalschedule
    ADD CONSTRAINT django_celery_beat_intervalschedule_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_periodictask django_celery_beat_periodictask_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_periodictask_name_key UNIQUE (name);


--
-- Name: django_celery_beat_periodictask django_celery_beat_periodictask_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_periodictask_pkey PRIMARY KEY (id);


--
-- Name: django_celery_beat_periodictasks django_celery_beat_periodictasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictasks
    ADD CONSTRAINT django_celery_beat_periodictasks_pkey PRIMARY KEY (ident);


--
-- Name: django_celery_beat_solarschedule django_celery_beat_solar_event_latitude_longitude_ba64999a_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_solarschedule
    ADD CONSTRAINT django_celery_beat_solar_event_latitude_longitude_ba64999a_uniq UNIQUE (event, latitude, longitude);


--
-- Name: django_celery_beat_solarschedule django_celery_beat_solarschedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_solarschedule
    ADD CONSTRAINT django_celery_beat_solarschedule_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: payments_address payments_address_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments_address
    ADD CONSTRAINT payments_address_pkey PRIMARY KEY (id);


--
-- Name: payments_billinginfo payments_billinginfo_delivery_address_id_a1e61c0d_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments_billinginfo
    ADD CONSTRAINT payments_billinginfo_delivery_address_id_a1e61c0d_uniq UNIQUE (delivery_address_id);


--
-- Name: payments_billinginfo payments_billinginfo_payment_tier_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments_billinginfo
    ADD CONSTRAINT payments_billinginfo_payment_tier_id_key UNIQUE (payment_tier_id);


--
-- Name: payments_billinginfo payments_billinginfo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments_billinginfo
    ADD CONSTRAINT payments_billinginfo_pkey PRIMARY KEY (id);


--
-- Name: payments_paymenttier payments_paymenttier_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments_paymenttier
    ADD CONSTRAINT payments_paymenttier_pkey PRIMARY KEY (id);


--
-- Name: users_customuser_groups users_customuser_groups_customuser_id_group_id_76b619e3_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_customuser_groups
    ADD CONSTRAINT users_customuser_groups_customuser_id_group_id_76b619e3_uniq UNIQUE (customuser_id, group_id);


--
-- Name: users_customuser_groups users_customuser_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_customuser_groups
    ADD CONSTRAINT users_customuser_groups_pkey PRIMARY KEY (id);


--
-- Name: users_customuser users_customuser_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_customuser
    ADD CONSTRAINT users_customuser_pkey PRIMARY KEY (id);


--
-- Name: users_customuser_user_permissions users_customuser_user_pe_customuser_id_permission_7a7debf6_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_customuser_user_permissions
    ADD CONSTRAINT users_customuser_user_pe_customuser_id_permission_7a7debf6_uniq UNIQUE (customuser_id, permission_id);


--
-- Name: users_customuser_user_permissions users_customuser_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_customuser_user_permissions
    ADD CONSTRAINT users_customuser_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: users_customuser users_customuser_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_customuser
    ADD CONSTRAINT users_customuser_username_key UNIQUE (username);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: blogs_article_blog_id_9aef899f; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_article_blog_id_9aef899f ON public.blogs_article USING btree (blog_id);


--
-- Name: blogs_article_magazine_article_id_1fdc4175; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_article_magazine_article_id_1fdc4175 ON public.blogs_article_magazine USING btree (article_id);


--
-- Name: blogs_article_magazine_article_id_1fdc4175_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_article_magazine_article_id_1fdc4175_like ON public.blogs_article_magazine USING btree (article_id varchar_pattern_ops);


--
-- Name: blogs_article_magazine_magazine_id_8cfe1fe1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_article_magazine_magazine_id_8cfe1fe1 ON public.blogs_article_magazine USING btree (magazine_id);


--
-- Name: blogs_article_magazine_magazine_id_8cfe1fe1_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_article_magazine_magazine_id_8cfe1fe1_like ON public.blogs_article_magazine USING btree (magazine_id varchar_pattern_ops);


--
-- Name: blogs_article_permalink_a71c20dc_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_article_permalink_a71c20dc_like ON public.blogs_article USING btree (permalink varchar_pattern_ops);


--
-- Name: blogs_blog_name_716fb83c_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_blog_name_716fb83c_like ON public.blogs_blog USING btree (name varchar_pattern_ops);


--
-- Name: blogs_blogblock_blog_id_f575285f; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_blogblock_blog_id_f575285f ON public.blogs_blogblock USING btree (blog_id);


--
-- Name: blogs_blogblock_file_link_e1ad12b2_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_blogblock_file_link_e1ad12b2_like ON public.blogs_blogblock USING btree (file_link varchar_pattern_ops);


--
-- Name: blogs_comment_article_id_d0d2cf5a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_comment_article_id_d0d2cf5a ON public.blogs_comment USING btree (article_id);


--
-- Name: blogs_comment_article_id_d0d2cf5a_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_comment_article_id_d0d2cf5a_like ON public.blogs_comment USING btree (article_id varchar_pattern_ops);


--
-- Name: blogs_magazine_file_link_11be946b_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_magazine_file_link_11be946b_like ON public.blogs_magazine USING btree (file_link varchar_pattern_ops);


--
-- Name: blogs_magazine_owner_id_aca1b7be; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_magazine_owner_id_aca1b7be ON public.blogs_magazine USING btree (owner_id);


--
-- Name: blogs_subscription_subscriber_id_014de7ec; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX blogs_subscription_subscriber_id_014de7ec ON public.blogs_subscription USING btree (subscriber_id);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_celery_beat_periodictask_clocked_id_47a69f82; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_celery_beat_periodictask_clocked_id_47a69f82 ON public.django_celery_beat_periodictask USING btree (clocked_id);


--
-- Name: django_celery_beat_periodictask_crontab_id_d3cba168; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_celery_beat_periodictask_crontab_id_d3cba168 ON public.django_celery_beat_periodictask USING btree (crontab_id);


--
-- Name: django_celery_beat_periodictask_interval_id_a8ca27da; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_celery_beat_periodictask_interval_id_a8ca27da ON public.django_celery_beat_periodictask USING btree (interval_id);


--
-- Name: django_celery_beat_periodictask_name_265a36b7_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_celery_beat_periodictask_name_265a36b7_like ON public.django_celery_beat_periodictask USING btree (name varchar_pattern_ops);


--
-- Name: django_celery_beat_periodictask_solar_id_a87ce72c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_celery_beat_periodictask_solar_id_a87ce72c ON public.django_celery_beat_periodictask USING btree (solar_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: payments_billinginfo_customer_id_853a5cba; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payments_billinginfo_customer_id_853a5cba ON public.payments_billinginfo USING btree (customer_id);


--
-- Name: users_customuser_groups_customuser_id_958147bf; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_customuser_groups_customuser_id_958147bf ON public.users_customuser_groups USING btree (customuser_id);


--
-- Name: users_customuser_groups_group_id_01390b14; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_customuser_groups_group_id_01390b14 ON public.users_customuser_groups USING btree (group_id);


--
-- Name: users_customuser_user_permissions_customuser_id_5771478b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_customuser_user_permissions_customuser_id_5771478b ON public.users_customuser_user_permissions USING btree (customuser_id);


--
-- Name: users_customuser_user_permissions_permission_id_baaa2f74; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_customuser_user_permissions_permission_id_baaa2f74 ON public.users_customuser_user_permissions USING btree (permission_id);


--
-- Name: users_customuser_username_80452fdf_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_customuser_username_80452fdf_like ON public.users_customuser USING btree (username varchar_pattern_ops);


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: blogs_article blogs_article_blog_id_9aef899f_fk_blogs_blog_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_article
    ADD CONSTRAINT blogs_article_blog_id_9aef899f_fk_blogs_blog_id FOREIGN KEY (blog_id) REFERENCES public.blogs_blog(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: blogs_article_magazine blogs_article_magazi_article_id_1fdc4175_fk_blogs_art; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_article_magazine
    ADD CONSTRAINT blogs_article_magazi_article_id_1fdc4175_fk_blogs_art FOREIGN KEY (article_id) REFERENCES public.blogs_article(permalink) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: blogs_article_magazine blogs_article_magazi_magazine_id_8cfe1fe1_fk_blogs_mag; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_article_magazine
    ADD CONSTRAINT blogs_article_magazi_magazine_id_8cfe1fe1_fk_blogs_mag FOREIGN KEY (magazine_id) REFERENCES public.blogs_magazine(file_link) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: blogs_blogblock blogs_blogblock_blog_id_f575285f_fk_blogs_blog_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_blogblock
    ADD CONSTRAINT blogs_blogblock_blog_id_f575285f_fk_blogs_blog_id FOREIGN KEY (blog_id) REFERENCES public.blogs_blog(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: blogs_comment blogs_comment_article_id_d0d2cf5a_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_comment
    ADD CONSTRAINT blogs_comment_article_id_d0d2cf5a_fk FOREIGN KEY (article_id) REFERENCES public.blogs_article(permalink) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: blogs_magazine blogs_magazine_owner_id_aca1b7be_fk_users_customuser_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_magazine
    ADD CONSTRAINT blogs_magazine_owner_id_aca1b7be_fk_users_customuser_id FOREIGN KEY (owner_id) REFERENCES public.users_customuser(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: blogs_subscription blogs_subscription_blog_id_7e92dddb_fk_blogs_blog_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_subscription
    ADD CONSTRAINT blogs_subscription_blog_id_7e92dddb_fk_blogs_blog_id FOREIGN KEY (blog_id) REFERENCES public.blogs_blog(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: blogs_subscription blogs_subscription_subscriber_id_014de7ec_fk_users_cus; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blogs_subscription
    ADD CONSTRAINT blogs_subscription_subscriber_id_014de7ec_fk_users_cus FOREIGN KEY (subscriber_id) REFERENCES public.users_customuser(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_users_customuser_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_users_customuser_id FOREIGN KEY (user_id) REFERENCES public.users_customuser(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_celery_beat_periodictask django_celery_beat_p_clocked_id_47a69f82_fk_django_ce; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_p_clocked_id_47a69f82_fk_django_ce FOREIGN KEY (clocked_id) REFERENCES public.django_celery_beat_clockedschedule(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_celery_beat_periodictask django_celery_beat_p_crontab_id_d3cba168_fk_django_ce; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_p_crontab_id_d3cba168_fk_django_ce FOREIGN KEY (crontab_id) REFERENCES public.django_celery_beat_crontabschedule(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_celery_beat_periodictask django_celery_beat_p_interval_id_a8ca27da_fk_django_ce; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_p_interval_id_a8ca27da_fk_django_ce FOREIGN KEY (interval_id) REFERENCES public.django_celery_beat_intervalschedule(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_celery_beat_periodictask django_celery_beat_p_solar_id_a87ce72c_fk_django_ce; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_celery_beat_periodictask
    ADD CONSTRAINT django_celery_beat_p_solar_id_a87ce72c_fk_django_ce FOREIGN KEY (solar_id) REFERENCES public.django_celery_beat_solarschedule(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: payments_billinginfo payments_billinginfo_customer_id_853a5cba_fk_users_cus; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments_billinginfo
    ADD CONSTRAINT payments_billinginfo_customer_id_853a5cba_fk_users_cus FOREIGN KEY (customer_id) REFERENCES public.users_customuser(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: payments_billinginfo payments_billinginfo_delivery_address_id_a1e61c0d_fk_payments_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments_billinginfo
    ADD CONSTRAINT payments_billinginfo_delivery_address_id_a1e61c0d_fk_payments_ FOREIGN KEY (delivery_address_id) REFERENCES public.payments_address(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: payments_billinginfo payments_billinginfo_payment_tier_id_f14b83f5_fk_payments_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments_billinginfo
    ADD CONSTRAINT payments_billinginfo_payment_tier_id_f14b83f5_fk_payments_ FOREIGN KEY (payment_tier_id) REFERENCES public.payments_paymenttier(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_customuser_groups users_customuser_gro_customuser_id_958147bf_fk_users_cus; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_customuser_groups
    ADD CONSTRAINT users_customuser_gro_customuser_id_958147bf_fk_users_cus FOREIGN KEY (customuser_id) REFERENCES public.users_customuser(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_customuser_groups users_customuser_groups_group_id_01390b14_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_customuser_groups
    ADD CONSTRAINT users_customuser_groups_group_id_01390b14_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_customuser_user_permissions users_customuser_use_customuser_id_5771478b_fk_users_cus; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_customuser_user_permissions
    ADD CONSTRAINT users_customuser_use_customuser_id_5771478b_fk_users_cus FOREIGN KEY (customuser_id) REFERENCES public.users_customuser(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_customuser_user_permissions users_customuser_use_permission_id_baaa2f74_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_customuser_user_permissions
    ADD CONSTRAINT users_customuser_use_permission_id_baaa2f74_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- PostgreSQL database dump complete
--

