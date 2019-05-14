require("dotenv").config({ silent: true }), ({ readFileSync } = require("fs"));
let CONFIG = {};

CONFIG.main_port = process.env.MAIN_PORT || 8080;

CONFIG.main_ip_address =
  process.env.IP || process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

CONFIG.https_key = process.env.HTTPS_KEY || "./encrypt/privkey.pem";
CONFIG.https_cert = process.env.HTTPS_CERT || "./encrypt/cert.pem";
CONFIG.https_fullChain =
  process.env.HTTPS_FULLCHAIN || "./encrypt/fullchain.pem";
CONFIG.https_passphrase =
  process.env.HTTPS_PASSPHRASE ||
  "nL8SHekGXA7vOxOOT4raQajIG9LWHiKekzbQTo7l0hSPrFgNt946eWtW5ukW0rD4puI0hBGIaVhdKEWP9AnIT7NPWhMy";

CONFIG.db_host = process.env.MYSQL_SERVICE_HOST || "localhost";
CONFIG.db_port = process.env.MYSQL_SERVICE_PORT || "3306";

CONFIG.db_user_main = process.env.MYSQL_USER || "2018dataUser";
CONFIG.db_password_main =
  process.env.MYSQL_PASSWORD || "WR2%,(!4Ys9r35P6dc)<+vhT`G7u:_Q?-Z;J#V&`DMmK";
CONFIG.db_name_main = process.env.MYSQL_DATABASE_T || "2018Tmdatab";
CONFIG.db_name_api = process.env.MYSQL_DATABASE_A || "TMData_app";
CONFIG.db_name_arch = process.env.MYSQL_DATABASE_ARCH || "archivedData";
CONFIG.db_arch_user = process.env.DB_ARCH_USER || "archUser";
CONFIG.db_arch_pass =
  process.env.DB_ARCH_PASS ||
  "aeYEk6M5wnQFPnjJkgJTaXgwhtsAT8vZkAMyB2mpHWtTrvnS";
CONFIG.db_password_root = process.env.MYSQL_ROOT_PASSWORD || "";

// WEATHER API KEYS
CONFIG.darksky_apiKey =
  process.env.DARKSKY_APIKEY || "2a2bb1a23412ba674c70371ad55bb58a";
CONFIG.weather_api_current =
  process.env.WEATHER_API_CURRENT || "/api/weather/current";
CONFIG.weather_api_past = process.env.WEATHER_API_PAST || "/api/weather/past";
CONFIG.weather_api_url = process.env.WEATHER_API_URL || "70.78.150.187:5000";

// CONFIG.db_name_main = process.env.MYSQL_DATABASE || "techData";

// CONFIG.db_user_api = process.env.MYSQL_USER || "tr3tmentB4tchUzr";
// CONFIG.db_password_api = process.env.MYSQL_PASSWORD || "LOt6faVG8H3n3xcqKJuBW8XDePFTNUc9NCmjtcbvWa";
// CONFIG.db_name_api = process.env.MYSQL_DATABASE_A || "TMData_app";

CONFIG.sendgrid_api_key =
  process.env.SENDGRID_KEY ||
  "SG.hyPULfrGTUW9ZY3e-hLA0g.ysICNz-x1qai4WIOpsUNII2cNTFG1sElQRFHMht5AgIsendGridKey";
CONFIG.base_url = process.env.BASE_URL || "http://localhost:8080";

CONFIG.batchUpload_token =
  process.env.BATCHUPLOAD_TOKEN ||
  "3u=WD4?Tcr9@HE2c;MoFWaaqfr~1|3tWFx23S-Y]$p)3WFL";
CONFIG.default_password = process.env.DEFAULT_PASSWORD || "password";

// CONFIG.technet_srv_Address = process.env.TECHNET_SRV_ADDRESS;

CONFIG.session_secret =
  process.env.SESSION_SECRET || 'P4a("hWjx3G}E,R!mTXQ#Hydpw[Zke+F^9;J';
CONFIG.session_key = process.env.SESSION_KEY || "session_technet";

CONFIG.crypto_key =
  process.env.CRYPTO_KEY || "b2df428b9929d3ace7c598bbf4e496b2";
CONFIG.crypto_encoding = process.env.CRYPTO_ENCODING || "hex";
CONFIG.crypto_password =
  process.env.CRYPTO_PASSWORD || "yCUjUDp,3Uf!&@9sx{?]/e";

// CARBON STANDARDS
CONFIG.c_standard_id = process.env.C_STANDERD_ID || "carbonstandardvalues";
CONFIG.c_standard_secret =
  process.env.C_STANDERD_SECRET ||
  "BZWcF2PikZNSYutZG45PgOZBHVW30qy64NT0znW0UIkT72iRna2Smtxd9DLHDSmc";
CONFIG.c_standard_app_id = process.env.C_STANDERD_APP_ID || "21807322";
CONFIG.c_standard_app_token =
  process.env.C_STANDERD_APP_TOKEN || "6aa556d7a23b41319f3f49d59eb80df6";

// CONTACTS
CONFIG.contacts_id = process.env.CONTACTS_ID || "customercontacts";
CONFIG.contacts_secret =
  process.env.CONTACTS_SECRET ||
  "k7uLvY5zIRKDqbfnsL4uVMZPGnYvim7Iob8d2qXsXmpNaEgI51C0dKa5PhyEIqDK";
CONFIG.contacts_app_id = process.env.CONTACTS_APP_ID || "22187804";
CONFIG.contacts_app_token =
  process.env.CONTACTS_APP_TOKEN || "3f7ddca0fba64dd7962eb0b3fbdd3a78";

// CUSTOMERS
CONFIG.customer_id = process.env.CUSTOMER_ID || "tecmistcustomers";
CONFIG.customer_secret =
  process.env.CUSTOMER_SECRET ||
  "mwJt8WBDDe1SHXf7SniDeo3lQsygTQX1jlQ22sHuy9XwodprzgBUZ6DAC2R1n9CE";
CONFIG.customer_app_id = process.env.CUSTOMER_APP_ID || "22428318";
CONFIG.customer_app_token =
  process.env.CUSTOMER_APP_TOKEN || "ca30bc12bcbd42c0bd1c3b90cbf8b16e";

// GREENHOUSE JOBS
CONFIG.jobs_greenhouse_id = process.env.JOBS_GREENHOUSE_ID || "jobsgreenhouse";
CONFIG.jobs_greenhouse_secret =
  process.env.JOBS_GREENHOUSE_SECRET ||
  "f8CRFg7qvxAMOfd0MyoY69alESlfpMN7EhQKe48DxuHh98Z9rBFWlLdRJ71Ith6J";
CONFIG.jobs_greenhouse_app_id =
  process.env.JOBS_GREENHOUSE_APP_ID || "22305277";
CONFIG.jobs_greenhouse_app_token =
  process.env.JOBS_GREENHOUSE_APP_TOKEN || "3279e041619945a3b765dc2b0bfad757";

// TREATMENT_LOCATIONS
CONFIG.treatment_id = process.env.TREATMENT_ID || "treatmentsites";
CONFIG.treatment_secret =
  process.env.TREATMENT_SECRET ||
  "BQqnKxfE7KV88tOgGloUdl78bHPS3AVKdwa3tz6S9ST8iPuFocoacbpNV1rFksAr";
CONFIG.treatemnt_app_id = process.env.TREATMENT_APP_ID || "22191377";
CONFIG.treatemnt_app_token =
  process.env.TREATMENT_APP_TOKEN || "65eaa16583fe449aa845030bd3908b1a";
// CONFIG.teatment_app_view = process.env.treatment_app_VIEWS || '39489083';

// POULTRY JOBS
CONFIG.jobs_poultry_id = process.env.JOBS_POULTRY_ID || "jobspoultry";
CONFIG.jobs_poultry_secret =
  process.env.JOBS_POULTRY_SECRET ||
  "xGhn5Mt8jEvmxLz9KmA5SpZ1VMFwt6aCmg5F2FY7oZOrDq6N0Np1CpXffZSUXwG7";
CONFIG.jobs_poultry_app_id = process.env.JOBS_POULTRY_APP_ID || "22191394";
CONFIG.jobs_poultry_app_token =
  process.env.JOBS_POULTRY_APP_TOKEN || "cf409abca4db400eb528a68ef8252f26";

// TECH
CONFIG.tech_id = process.env.TECH_ID || "treatmenttechnicians";
CONFIG.tech_secret =
  process.env.TECH_SECRET ||
  "kLvL5HQAgS6seNlV5SJwow5Re5DMNMWXO6kYI5znW7gGb3sBGeDMKMYaZYo5fcoA";
CONFIG.tech_app_id = process.env.TECH_APP_ID || "22167038";
CONFIG.tech_app_token =
  process.env.TECH_APP_TOKEN || "fc78173b50b54d01b90ad1640fcf228f";

module.exports = CONFIG;
