const checkSystem = (server: string, client: string) => {
  return `${server}, & ${client} are a great combination 😇`
}

const the_server = "Node.js RESTful API";
const the_client = "React Storefront";
const combination = checkSystem(the_server, the_client);

console.log('Wow! 👉', combination);
