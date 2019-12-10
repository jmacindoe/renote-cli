import Docker from "dockerode"

export async function startDocker(containerId: string) {
  const docker = new Docker({ socketPath: "/var/run/docker.sock" })
  const container = docker.getContainer(containerId)
  const alreadyStarted = await containerIsStarted(container)
  if (!alreadyStarted) {
    await startContainer(container)
    await sleep(1000) // Wait for mongo to start up
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

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
