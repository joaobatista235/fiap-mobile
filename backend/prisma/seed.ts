import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const USERS = [
  { name: "Admin",            email: "admin@admin.com",       password: "admin",  role: "ADMIN" },
  { name: "Carlos Mendonça",  email: "carlos@fiap.com.br",    password: "fiap123", role: "ADMIN" },
  { name: "Letícia Souza",    email: "leticia@aluno.fiap.com", password: "fiap123", role: "USER"  },
];

const POSTS = [
  {
    title: "O Futuro da Inteligência Artificial Generativa",
    content:
      "A inteligência artificial generativa está redefinindo os limites do que as máquinas são capazes de criar. Ferramentas como grandes modelos de linguagem e geradores de imagens já transformam setores como publicidade, design, medicina e educação, automatizando tarefas antes exclusivamente humanas. À medida que os modelos evoluem e se tornam mais eficientes, a tendência é que a IA generativa deixe de ser um diferencial competitivo para se tornar infraestrutura básica das empresas, exigindo que profissionais de todas as áreas desenvolvam literacia em IA para se manterem relevantes no mercado de trabalho.",
  },
  {
    title: "Modelos de Linguagem e a Revolução no Desenvolvimento de Software",
    content:
      "Os modelos de linguagem de grande escala estão mudando profundamente a forma como o software é desenvolvido. Assistentes de código baseados em IA já são capazes de sugerir funções completas, identificar bugs, gerar testes automatizados e até documentar sistemas inteiros a partir de comentários em linguagem natural. Essa mudança não elimina o papel do desenvolvedor, mas o desloca: o foco passa a ser a revisão crítica, a arquitetura de sistemas e a definição de requisitos, enquanto a IA cuida da produção mecânica de código — aumentando exponencialmente a produtividade individual.",
  },
  {
    title: "IA na Saúde: Diagnósticos Mais Rápidos e Precisos",
    content:
      "A aplicação da inteligência artificial na área da saúde está gerando resultados expressivos, especialmente no diagnóstico por imagem e na descoberta de medicamentos. Algoritmos treinados com milhões de exames conseguem identificar tumores, lesões e anomalias com precisão comparável — e em alguns casos superior — à de especialistas humanos, além de processar resultados em segundos em vez de horas. Mais do que substituir médicos, a IA atua como um segundo par de olhos altamente treinado, permitindo que profissionais de saúde concentrem sua atenção nos casos mais complexos e nas decisões que exigem empatia e julgamento clínico.",
  },
  {
    title: "Edge Computing e IA: Processamento Onde os Dados Nascem",
    content:
      "A combinação de computação de borda com inteligência artificial representa um dos avanços mais significativos da infraestrutura tecnológica atual. Em vez de enviar todos os dados para a nuvem, dispositivos como câmeras, sensores industriais e smartphones passam a executar modelos de IA localmente, reduzindo a latência, o consumo de banda e os riscos de privacidade. Essa arquitetura é essencial para aplicações em tempo real, como veículos autônomos, monitoramento industrial e assistentes de voz offline, e deve se intensificar com a popularização do 5G e a miniaturização dos chips dedicados a inferência de IA.",
  },
  {
    title: "Ética e Regulação da IA: O Debate que Define Nossa Década",
    content:
      "À medida que sistemas de inteligência artificial ganham autonomia e penetram decisões críticas — concessão de crédito, seleção de candidatos, sentenças judiciais e diagnósticos médicos —, o debate sobre ética e regulação torna-se urgente e inevitável. Organizações como a União Europeia já avançam com legislações específicas para IA de alto risco, enquanto empresas de tecnologia publicam princípios internos de uso responsável. O desafio está em equilibrar inovação e proteção: regras excessivamente rígidas podem frear o desenvolvimento, mas a ausência de limites abre espaço para discriminação algorítmica, desinformação e concentração de poder tecnológico nas mãos de poucos.",
  },
];

async function main() {
  console.log("Seed: iniciando...");

  // ── Usuários ──────────────────────────────────────────────────────────────
  const createdUsers: Record<string, string> = {};

  for (const u of USERS) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      console.log(`Seed: usuário já existe — ${u.email}`);
      createdUsers[u.email] = existing.id;
      continue;
    }
    const hashed = await bcrypt.hash(u.password, 10);
    const created = await prisma.user.create({
      data: { name: u.name, email: u.email, password: hashed, role: u.role },
    });
    createdUsers[u.email] = created.id;
    console.log(`Seed: criado ${u.role.padEnd(5)} — ${u.email} / ${u.password}`);
  }

  // ── Posts (autor = Carlos Mendonça) ───────────────────────────────────────
  const authorId = createdUsers["carlos@fiap.com.br"];
  const existingPosts = await prisma.post.count();

  if (existingPosts > 0) {
    console.log("Seed: posts já existem, pulando.");
  } else {
    for (const p of POSTS) {
      await prisma.post.create({ data: { ...p, authorId } });
      console.log(`Seed: post criado — "${p.title}"`);
    }
  }

  console.log("\nSeed concluído! Credenciais:");
  console.log("  Admin     → admin@admin.com       / admin");
  console.log("  Professor → carlos@fiap.com.br    / fiap123");
  console.log("  Aluno     → leticia@aluno.fiap.com / fiap123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
