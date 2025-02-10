const endpoints = ["serverstate", "backups", "systeminfo"];

const fetchInfo = async (ip: string, port: number) => {
  const data = await Promise.all(
    endpoints.map((endpoint) =>
      fetch(`http://${ip}:${port}/api/v1/${endpoint}`)
        .then((res) => res.json())
        .catch((err) => {
          console.error(err);
          return null;
        })
    )
  );

  return data;
};

export { fetchInfo };