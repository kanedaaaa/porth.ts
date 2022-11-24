import CORE from "./core"
import OP from "./enums"
import fs from "fs"

class VM extends CORE {


    public constructor() {
        super()
    }

    public simulate(program: Array<([number, null] | [number, number])>): number | undefined {
        if (OP.COUNT != 4) throw "Missing an op maybe?"

        const stack: Array<number> = []

        for (let op of program) {
            if (op[0] == OP.PUSH && op[1] !== null) {
                stack.push(op[1])
            }

            else if (op[0] == OP.ADD) {
                let a = stack.pop()
                let b = stack.pop()

                if (a !== undefined && b !== undefined) stack.push(a + b)
            }

            else if (op[0] == OP.SUB) {
                let a = stack.pop()
                let b = stack.pop()

                if (a !== undefined && b !== undefined) stack.push(b - a)
            }

            else if (op[0] == OP.DUMP) {
                let a = stack.pop()

                if (a !== undefined) return a
            }

            else {
                throw "Wrong instruction provided!"
            }
        }
    }

    compile(program: Array<([number, null] | [number, number])>, path: string) {
        if (OP.COUNT != 4) throw "Missing an op maybe?"

        let header = `
        segment .text
        dump:
            push    rbp
            mov     rbp, rsp
            sub     rsp, 64
            mov     QWORD [rbp-56], rdi
            mov     QWORD [rbp-8], 1
            mov     eax, 32
            sub     rax, QWORD [rbp-8]
            mov     BYTE [rbp-48+rax], 10
        .L2:
            mov     rcx, QWORD [rbp-56]
            mov     rdx, -3689348814741910323
            mov     rax, rcx
            mul     rdx
            shr     rdx, 3
            mov     rax, rdx
            sal     rax, 2
            add     rax, rdx
            add     rax, rax
            sub     rcx, rax
            mov     rdx, rcx
            mov     eax, edx
            lea     edx, [rax+48]
            mov     eax, 31
            sub     rax, QWORD [rbp-8]
            mov     BYTE [rbp-48+rax], dl
            add     QWORD [rbp-8], 1
            mov     rax, QWORD [rbp-56]
            mov     rdx, -3689348814741910323
            mul     rdx
            mov     rax, rdx
            shr     rax, 3
            mov     QWORD [rbp-56], rax
            cmp     QWORD [rbp-56], 0
            jne     .L2
            mov     eax, 32
            sub     rax, QWORD [rbp-8]
            lea     rdx, [rbp-48]
            lea     rcx, [rdx+rax]
            mov     rax, QWORD [rbp-8]
            mov     rdx, rax
            mov     rsi, rcx
            mov     edi, 1
            mov     eax, 0
            mov     rax, 1
            syscall
            nop
            leave
            ret
        
        global _start
        _start:
        `
        fs.appendFileSync(path, header)
        for (let op of program) {
            if (op[0] == OP.PUSH && op[1] !== null) {
                let inst = `
                    push ${op[1]}
                `

                fs.appendFileSync(path, inst)
            }

            else if (op[0] == OP.ADD) {
                let inst = `
                    pop rax
                    pop rbx
                    add rax, rbx
                    push rax
                `

                fs.appendFileSync(path, inst)
            }

            else if (op[0] == OP.SUB) {
                let inst = `
                    pop rax
                    pop rbx
                    sub rbx, rax
                    push rbx
                `

                fs.appendFileSync(path, inst)
            }

            else if (op[0] == OP.DUMP) {
                let inst = `
                    pop rdi
                    call dump
                `

                fs.appendFileSync(path, inst)
            }

            else {
                throw "Wrong instruction provided!"
            }
        }
    }
}

export default VM