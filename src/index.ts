import VM from './vm'
import CORE from './core'
import { ICore, IVM } from './interfaces/global'
import process from 'process'
import { exec } from 'child_process'
import fs from 'fs'

const formatPath = (path: string, add: string): string => {
	const r = new RegExp('/(?!.*/).*')
	const n = path.replace(r, add)

	return n
}

const main = (): number | undefined => {
	const core: ICore = new CORE()
	const vm: IVM = new VM()

	if (process.argv.length < 3) {
		console.log('Usage: index.ts <SUBCOMMAND> [ARGS]')
		console.log("Supported args: 'sim' | 'compile'")
		return 1
	}

	if (process.argv[2] == 'sim') {
		fs.writeFileSync(`${process.argv[3]}`, '')
		console.log(
			vm.simulate([
				core.push(20),
				core.push(20),
				core.add(),
				core.push(1),
				core.sub(),
				core.dump()
			])
		)
	} else if (process.argv[2] == 'compile' && process.argv[3] !== undefined) {
		if (fs.existsSync(process.argv[3])) {
			fs.unlink(process.argv[3], (err: any) => {
				if (err) throw err
			})
		}

		vm.compile(
			[
				core.push(20),
				core.push(20),
				core.add(),
				core.push(1),
				core.sub(),
				core.dump()
			],
			process.argv[3]
		)
		exec(
			`nasm -felf64 ${process.argv[3]}`,
			(err: any, stdout: string, stderr: string) => {
				if (err) {
					console.log(err)
				} else {
					console.log(stdout)
				}
			}
		)

		exec(
			`ld -o ${formatPath(process.argv[3], '/output')} ${formatPath(
				process.argv[3],
				'/output.o'
			)}`,
			(err: any, stdout: string) => {
				if (err) {
					console.log(err)
				} else {
					console.log(stdout)
				}
			}
		)
	} else {
		throw 'Wrong argument provided'
	}
}

main()
