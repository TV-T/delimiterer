import {expect, test} from '@oclif/test'
import * as clipboardy from 'clipboardy'
import * as os from 'os'
import cmd = require('../src');

describe('delimiterer', () => {
  describe('default', () => {
    before(async () => {
      await clipboardy.write('1\n2\n3\n4')
    })

    test
    .stdout()
    .do(() => cmd.run([]))
    .it('newline to comma', async ctx => {
      expect(await clipboardy.read()).to.equal('1,2,3,4')
      expect(ctx.stdout).to.contain('Modified clipboard content.')
    })
  })

  describe('args', () => {
    test
    .stdout()
    .do(() => cmd.run([',', '.']))
    .it('comma to period', async ctx => {
      expect(await clipboardy.read()).to.equal('1.2.3.4')
      expect(ctx.stdout).to.contain('Modified clipboard content.')
    })

    test
    .stdout()
    .do(() => cmd.run(['.', 'space']))
    .it('period to space', async ctx => {
      expect(await clipboardy.read()).to.equal('1 2 3 4')
      expect(ctx.stdout).to.contain('Modified clipboard content.')
    })

    test
    .stdout()
    .do(() => cmd.run(['space', 'newline']))
    .it('space to newline', async ctx => {
      expect(await clipboardy.read()).to.equal(['1', '2', '3', '4'].join(os.EOL))
      expect(ctx.stdout).to.contain('Modified clipboard content.')
    })
  })

  describe('flags', () => {
    test
    .stdout()
    .do(() => cmd.run(['newline', '.', '--output']))
    .it('outputs result to stdout instead of clipboard', async (ctx, done) => {
      expect(await clipboardy.read()).to.equal(['1', '2', '3', '4'].join(os.EOL))
      expect(ctx.stdout).to.contain('1.2.3.4')
      done()
    })
  })

  describe('errors', () => {
    before(async () => {
      await clipboardy.write('')
    })

    test
    .stdout()
    .do(() => cmd.run([]))
    .exit(100)
    .it('Exits with 100 on empty clipboard')
  })
})
