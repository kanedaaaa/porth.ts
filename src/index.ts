import VM from "./vm"
import CORE from "./core"
import { ICore, IVM } from "./interfaces/global"
import process from "process"
import { exec } from "child_process"

const formatPath = (path: string): string => {
    const r = new RegExp('/(?!.*/).*');
    const n = path.replace(r, "/output.o")

    return n
}

const main = (): number | undefined => {
    const core: ICore = new CORE()
    const vm: IVM = new VM()

    if (process.argv.length < 3) {
        console.log("Usage: index.ts <SUBCOMMAND> [ARGS]")
        console.log("Supported args: 'sim'")
        return 1
    }

    if (process.argv[2] == "sim") {
        console.log(vm.simulate([core.push(20), core.push(20), core.add(), core.dump()]))
    }

    else if (process.argv[2] == "compile" && process.argv[3] !== undefined) {
        vm.compile([core.push(20), core.push(20), core.add(), core.push(1), core.sub(), core.dump()], process.argv[3])
        exec(`nasm -felf64 ${process.argv[3]}`, (err: any, stdout: string, stderr: string) => {
            if (err) {
                console.log(err)
            } else {
                console.log(stdout)
            }
        })

        exec(`ld -o output ${formatPath(process.argv[3])}`, (err: any, stdout: string) => {
            if (err) {
                console.log(err)
            } else {
                console.log(stdout)
            }
        })
    }

    else {
        throw "Wrong argument provided"
    }
}

main()