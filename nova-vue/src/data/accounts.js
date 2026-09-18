/**
 * 演示账号数据（真实项目中应由后端接口校验，此处仅做前端演示）
 */
export const ACCOUNTS = [
  { user: 'nova',        pass: '2026',   name: 'NOVA 管理员', role: 'SUPER ADMIN', tag: '创始人' },
  { user: 'admin',       pass: '123456', name: '系统管理员',  role: 'ADMIN',       tag: '运维' },
  { user: 'guest',       pass: 'guest',  name: '访客用户',    role: 'GUEST',       tag: '只读' },
  { user: '13800138000', pass: '8888',   name: '张 · 用户',   role: 'MEMBER',      tag: '会员' }
]

/**
 * 校验账号密码
 * @returns {({ok:true, account:object}) | ({ok:false, field:string, message:string})}
 */
export function verifyAccount(username, password) {
  const u = (username || '').trim()
  const p = password || ''

  if (!u) return { ok: false, field: 'user', message: '请输入用户名或邮箱' }
  if (!p) return { ok: false, field: 'pass', message: '请输入登录密码' }

  const account = ACCOUNTS.find(a => a.user.toLowerCase() === u.toLowerCase())
  if (!account) return { ok: false, field: 'user', message: '账号不存在，请检查后重试' }
  if (account.pass !== p) return { ok: false, field: 'pass', message: '密码错误，请重新输入' }

  return { ok: true, account }
}
