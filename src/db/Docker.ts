import Docker from "dockerode"

export async function startDocker(containerId: string) {
  const docker = new Docker({ socketPath: "/var/run/docker.sock" })
  const container = docker.getContainer(containerId)
  const alreadyStarted = await containerIsStarted(container)
  if (!alreadyStarted) {
    await startContainer(container)
    // dockerode holds onto the socket, causing mongoose to fail. Not sure how to avoid this, so get user to re-run :'(
    // tslint:disable-next-line: no-console
    console.log("Started docker. Please run again.")
    process.exit(1)
  }
}

async function containerIsStarted(
  container: Docker.Container,
): Promise<boolean> {
  const info = await containerInfo(container)
  return info.State.Running
}

async function containerInfo(
  container: Docker.Container,
): Promise<Docker.ContainerInspectInfo> {
  return new Promise((resolve, reject) => {
    container.inspect((err, data) => {
      if (err) {
        reject(err)
        return
      }
      resolve(data)
    })
  })
}

async function startContainer(container: Docker.Container) {
  await new Promise((resolve, reject) => {
    container.start((err, data) => {
      if (err) {
        reject(err)
        return
      }
      resolve(data)
    })
  })
}
