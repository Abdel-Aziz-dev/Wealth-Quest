import { LanguageCode } from '../types';

const TRANSLATIONS: Record<LanguageCode, any> = {
  en: {
    app: {
      title: "Wealth Quest",
      netWorth: "Net Worth",
      cash: "Cash",
      debt: "Total Debt",
      iq: "Financial IQ",
      logs: "Activity Log",
      close: "Close"
    },
    dashboard: {
      monthlyCashflow: "Monthly Cashflow",
      income: "Income",
      expenses: "Living & Lifestyle",
      debtPayments: "Debt Min Payments",
      net: "Net",
      nextMonth: "Next Month",
      age: "Age: {years}y {months}m"
    },
    tabs: {
      career: "CAREER",
      debt: "DEBT",
      invest: "INVEST",
      skills: "SKILLS"
    },
    actions: {
      currentJob: "Current Job",
      careerPath: "Career Path",
      active: "Active",
      promote: "Promote",
      locked: "Locked",
      future: "Future",
      reqIq: "Req IQ",
      managePay: "Manage & Pay",
      borrowCash: "Borrow Cash",
      totalPrincipal: "Total Principal",
      monthlyOb: "Monthly Obligation",
      strategy: "Strategy",
      avalanche: "Avalanche (Rate)",
      snowball: "Snowball (Size)",
      debtHint: "Min payments are deducted automatically. Use buttons below for **extra** principal payments.",
      debtFree: "Debt Free!",
      debtFreeSub: "You're building wealth efficiently.",
      extra: "Extra",
      payOff: "Pay Off",
      borrowWarning: "⚠️ Taking debt provides instant cash but reduces your monthly cashflow. High interest debt can quickly spiral out of control.",
      borrow: "Borrow",
      holdings: "Holdings",
      price: "Price",
      risk: "Risk",
      buy: "Buy",
      learn: "Learn",
      maxed: "Maxed",
      tip: "💡 Tip:",
      investTip: "Diversify to lower risk. Stocks grow fast but crash hard. Bonds are safer."
    },
    chart: {
      title: "Wealth Trajectory",
      noData: "No Data"
    },
    jobs: {
      barista: { title: "Barista" },
      intern: { title: "Office Intern" },
      junior_dev: { title: "Junior Developer" },
      senior_dev: { title: "Senior Developer" },
      manager: { title: "Product Manager" },
      cto: { title: "Startup CTO" }
    },
    assets: {
      index_fund: "Global Index Fund",
      bond_fund: "Safe Gov Bonds",
      crypto_coin: "Speculative Coin"
    },
    loans: {
      student_loan: "Student Loan",
      credit_card: "Credit Card",
      personal_loan: "Personal Loan",
      shark_loan: "Quick Cash"
    },
    logs: {
        welcome: "Welcome to Wealth Quest!",
        yearComplete: "Year {year} Complete. Net Worth: {nw}",
        bought: "Bought {asset}",
        promoted: "Promoted to {job}!",
        paidOff: "🎉 Paid Off {debt}!",
        paidOffAuto: "🎉 Paid Off {debt} (Auto-pay)",
        extraPay: "Extra Payment: {debt} ({amt})",
        borrowed: "Borrowed: {debt} (+{amt})",
        debtPayments: "Debt Payments: {details}",
        overdraft: "Warning: Overdraft! High stress."
    },
    tutorial: {
        welcome_title: "Welcome, Wealth Builder! 🚀",
        welcome_desc: "Your journey to financial freedom starts here. Let's create your strategy.",
        lang_title: "Polyglot Mode 🗣️",
        lang_desc: "Prefer a different language? Click here to switch between 6 different languages.",
        currency_title: "Money Changer 💱",
        currency_desc: "Play in your local currency. We handle the exchange rates automatically.",
        stats_title: "Vital Signs 📊",
        stats_desc: "Keep your eye on the prize. Your goal is to increase Net Worth while keeping Cash positive and Debt low.",
        chart_title: "The Long Game 📈",
        chart_desc: "This chart tracks your progress over the years. Watch it grow (hopefully) as you invest and save!",
        cashflow_title: "Cashflow is King 💸",
        cashflow_desc: "This shows exactly how much money you keep every month after expenses. If this is red, you're in trouble!",
        advance_title: "Time Travel ⏳",
        advance_desc: "Click this button to advance 1 month. You'll get paid, bills will be deducted, and investments will grow.",
        actions_title: "Command Center ⚡",
        actions_desc: "This is where you make moves. You have 4 main areas to manage.",
        tab_career_title: "Career Ladder 💼",
        tab_career_desc: "View your current job and requirements for promotion. Higher income = faster wealth.",
        tab_debt_title: "Debt Crusher 💳",
        tab_debt_desc: "Manage loans here. High-interest debt destroys wealth. Pay it off fast!",
        tab_invest_title: "Asset Market 🏦",
        tab_invest_desc: "Buy Stocks, Bonds, or Crypto. Assets put money in your pocket via growth and dividends.",
        tab_skills_title: "Skill Tree 🧠",
        tab_skills_desc: "Spend XP (Financial IQ) to learn skills. Skills unlock better jobs and improve investment returns.",
        advisor_title: "AI Coach 🧠",
        advisor_desc: "Stuck? Need a strategy? Click here to chat with your personal AI Financial Advisor anytime.",
        finish_title: "You're Ready! 🎉",
        finish_desc: "Here is a $500 bonus to kickstart your journey. Good luck!",
        next: "Next",
        finish: "Collect Reward",
        skip: "Skip Tutorial"
    }
  },
  pt: {
    app: {
      title: "Jornada da Riqueza",
      netWorth: "Patrimônio",
      cash: "Dinheiro",
      debt: "Dívida Total",
      iq: "QI Financeiro",
      logs: "Registro",
      close: "Fechar"
    },
    dashboard: {
      monthlyCashflow: "Fluxo Mensal",
      income: "Renda",
      expenses: "Custo de Vida",
      debtPayments: "Pag. Mínimo Dívida",
      net: "Líquido",
      nextMonth: "Próximo Mês",
      age: "Idade: {years}a {months}m"
    },
    tabs: {
      career: "CARREIRA",
      debt: "DÍVIDAS",
      invest: "INVESTIR",
      skills: "HABILIDADES"
    },
    actions: {
      currentJob: "Emprego Atual",
      careerPath: "Plano de Carreira",
      active: "Atual",
      promote: "Promover",
      locked: "Bloq.",
      future: "Futuro",
      reqIq: "QI Nec.",
      managePay: "Gerenciar",
      borrowCash: "Empréstimos",
      totalPrincipal: "Principal Total",
      monthlyOb: "Obrigação Mensal",
      strategy: "Estratégia",
      avalanche: "Avalanche (Juros)",
      snowball: "Bola de Neve (Valor)",
      debtHint: "O pagamento mínimo é automático. Use os botões abaixo para pagamentos **extras**.",
      debtFree: "Livre de Dívidas!",
      debtFreeSub: "Você está construindo riqueza com eficiência.",
      extra: "Extra",
      payOff: "Quitar",
      borrowWarning: "⚠️ Dívidas dão dinheiro rápido, mas reduzem seu fluxo mensal. Juros altos podem sair do controle.",
      borrow: "Pegar",
      holdings: "Posição",
      price: "Preço",
      risk: "Risco",
      buy: "Comprar",
      learn: "Aprender",
      maxed: "Máx.",
      tip: "💡 Dica:",
      investTip: "Diversifique para baixar o risco. Ações crescem rápido mas oscilam. Renda fixa é mais segura."
    },
    chart: {
      title: "Trajetória",
      noData: "Sem Dados"
    },
    jobs: {
      barista: { title: "Barista" },
      intern: { title: "Estagiário" },
      junior_dev: { title: "Dev Júnior" },
      senior_dev: { title: "Dev Sênior" },
      manager: { title: "Gerente de Produto" },
      cto: { title: "CTO de Startup" }
    },
    assets: {
      index_fund: "Fundo Global",
      bond_fund: "Tesouro Direto",
      crypto_coin: "Criptomoeda"
    },
    loans: {
      student_loan: "Empréstimo Estudantil",
      credit_card: "Cartão de Crédito",
      personal_loan: "Empréstimo Pessoal",
      shark_loan: "Agiota (Risco)"
    },
    logs: {
        welcome: "Bem-vindo à Jornada da Riqueza!",
        yearComplete: "Ano {year} Completo. Patrimônio: {nw}",
        bought: "Comprou {asset}",
        promoted: "Promovido a {job}!",
        paidOff: "🎉 Quitou {debt}!",
        paidOffAuto: "🎉 Quitou {debt} (Auto)",
        extraPay: "Pagamento Extra: {debt} ({amt})",
        borrowed: "Empréstimo: {debt} (+{amt})",
        debtPayments: "Pag. Dívidas: {details}",
        overdraft: "Aviso: Cheque Especial! Estresse alto."
    },
    tutorial: {
        welcome_title: "Bem-vindo! 🚀",
        welcome_desc: "Sua jornada para a liberdade financeira começa aqui. Vamos aprender como jogar.",
        stats_title: "Sinais Vitais 📊",
        stats_desc: "Fique de olho nos seus números. Aumente seu Patrimônio enquanto mantém o Caixa positivo.",
        chart_title: "Longo Prazo 📈",
        chart_desc: "Este gráfico mostra seu progresso. Veja-o crescer conforme você investe!",
        cashflow_title: "Fluxo de Caixa 💸",
        cashflow_desc: "Isso mostra quanto dinheiro sobra todo mês. Se estiver vermelho, cuidado!",
        advance_title: "Viajar no Tempo ⏳",
        advance_desc: "Clique para avançar 1 mês. Você receberá salário e pagará contas.",
        actions_title: "Central de Comando ⚡",
        actions_desc: "Aqui você gerencia sua carreira, dívidas, investimentos e habilidades.",
        tab_career_title: "Carreira 💼",
        tab_career_desc: "Veja seu emprego atual e requisitos para promoção. Renda maior = riqueza mais rápida.",
        tab_debt_title: "Dívidas 💳",
        tab_debt_desc: "Gerencie empréstimos aqui. Dívidas de juros altos destroem riqueza. Pague rápido!",
        tab_invest_title: "Investimentos 🏦",
        tab_invest_desc: "Compre Ações, Títulos ou Cripto. Ativos colocam dinheiro no seu bolso.",
        tab_skills_title: "Habilidades 🧠",
        tab_skills_desc: "Gaste XP para aprender habilidades. Elas desbloqueiam melhores empregos.",
        advisor_title: "Coach IA 🧠",
        advisor_desc: "Precisa de ajuda? Clique aqui para conversar com seu consultor financeiro IA.",
        finish_title: "Tudo Pronto! 🎉",
        finish_desc: "Aqui está um bônus de $500 para começar. Boa sorte!",
        next: "Próximo",
        finish: "Pegar Recompensa",
        skip: "Pular"
    }
  },
  es: {
    app: {
      title: "Búsqueda de Riqueza",
      netWorth: "Patrimonio",
      cash: "Efectivo",
      debt: "Deuda Total",
      iq: "IQ Financiero",
      logs: "Registro",
      close: "Cerrar"
    },
    dashboard: {
      monthlyCashflow: "Flujo Mensual",
      income: "Ingresos",
      expenses: "Gastos",
      debtPayments: "Pagos Mínimos",
      net: "Neto",
      nextMonth: "Siguiente Mes",
      age: "Edad: {years}a {months}m"
    },
    tabs: {
      career: "CARRERA",
      debt: "DEUDA",
      invest: "INVERTIR",
      skills: "HABILIDADES"
    },
    actions: {
      currentJob: "Trabajo Actual",
      careerPath: "Carrera",
      active: "Activo",
      promote: "Ascender",
      locked: "Bloq.",
      future: "Futuro",
      reqIq: "IQ Req.",
      managePay: "Pagar",
      borrowCash: "Préstamos",
      totalPrincipal: "Principal Total",
      monthlyOb: "Obligación Mensual",
      strategy: "Estrategia",
      avalanche: "Avalancha (Interés)",
      snowball: "Bola de Nieve (Monto)",
      debtHint: "Los pagos mínimos son automáticos. Usa los botones para pagos **extra**.",
      debtFree: "¡Libre de Deudas!",
      debtFreeSub: "Estás construyendo riqueza eficientemente.",
      extra: "Extra",
      payOff: "Liquidar",
      borrowWarning: "⚠️ La deuda reduce tu flujo mensual. Los intereses altos son peligrosos.",
      borrow: "Pedir",
      holdings: "Tenencia",
      price: "Precio",
      risk: "Riesgo",
      buy: "Comprar",
      learn: "Aprender",
      maxed: "Max",
      tip: "💡 Consejo:",
      investTip: "Diversifica para bajar el riesgo. Las acciones crecen rápido pero caen fuerte."
    },
    chart: {
      title: "Trayectoria",
      noData: "Sin Datos"
    },
    jobs: {
      barista: { title: "Barista" },
      intern: { title: "Pasante" },
      junior_dev: { title: "Dev Junior" },
      senior_dev: { title: "Dev Senior" },
      manager: { title: "Gerente de Producto" },
      cto: { title: "CTO de Startup" }
    },
    assets: {
      index_fund: "Fondo Global",
      bond_fund: "Bonos Gobierno",
      crypto_coin: "Criptomoneda"
    },
    loans: {
      student_loan: "Préstamo Estudiantil",
      credit_card: "Tarjeta de Crédito",
      personal_loan: "Préstamo Personal",
      shark_loan: "Dinero Rápido"
    },
    logs: {
        welcome: "¡Bienvenido a Wealth Quest!",
        yearComplete: "Año {year} Completo. Patrimonio: {nw}",
        bought: "Compró {asset}",
        promoted: "¡Ascendido a {job}!",
        paidOff: "🎉 ¡Pagó {debt}!",
        paidOffAuto: "🎉 Pagó {debt} (Auto)",
        extraPay: "Pago Extra: {debt} ({amt})",
        borrowed: "Prestado: {debt} (+{amt})",
        debtPayments: "Pagos Deuda: {details}",
        overdraft: "Aviso: ¡Sobregiro! Alto estrés."
    },
    tutorial: {
        welcome_title: "¡Bienvenido! 🚀",
        welcome_desc: "Tu viaje hacia la libertad financiera comienza aquí.",
        stats_title: "Signos Vitales 📊",
        stats_desc: "Vigila tu Patrimonio y mantén el Efectivo positivo.",
        chart_title: "Largo Plazo 📈",
        chart_desc: "Este gráfico rastrea tu progreso a lo largo de los años.",
        cashflow_title: "Flujo de Caja 💸",
        cashflow_desc: "Muestra cuánto dinero te queda cada mes. ¡Evita los números rojos!",
        advance_title: "Viaje en el Tiempo ⏳",
        advance_desc: "Avanza 1 mes para recibir tu salario y pagar facturas.",
        actions_title: "Centro de Mando ⚡",
        actions_desc: "Aquí gestionas tu carrera, deudas e inversiones.",
        tab_career_title: "Carrera 💼",
        tab_career_desc: "Mira los requisitos para ascender. Más ingresos = más riqueza.",
        tab_debt_title: "Deudas 💳",
        tab_debt_desc: "Gestiona préstamos. Las deudas altas destruyen riqueza.",
        tab_invest_title: "Inversiones 🏦",
        tab_invest_desc: "Compra acciones o bonos. Los activos ponen dinero en tu bolsillo.",
        tab_skills_title: "Habilidades 🧠",
        tab_skills_desc: "Usa XP para aprender habilidades y desbloquear mejores empleos.",
        advisor_title: "Coach IA 🧠",
        advisor_desc: "¿Atascado? Habla con tu asesor financiero IA.",
        finish_title: "¡Listo! 🎉",
        finish_desc: "Aquí tienes un bono de $500 para empezar.",
        next: "Siguiente",
        finish: "Recoger Recompensa",
        skip: "Saltar"
    }
  },
  de: {
    app: {
      title: "Vermögens-Quest",
      netWorth: "Reinvermögen",
      cash: "Bargeld",
      debt: "Schulden",
      iq: "Finanz-IQ",
      logs: "Protokoll",
      close: "Schließen"
    },
    dashboard: {
      monthlyCashflow: "Monatlicher Cashflow",
      income: "Einkommen",
      expenses: "Lebenshaltung",
      debtPayments: "Mindestraten",
      net: "Netto",
      nextMonth: "Nächster Monat",
      age: "Alter: {years}J {months}M"
    },
    tabs: {
      career: "KARRIERE",
      debt: "SCHULDEN",
      invest: "INVESTIEREN",
      skills: "SKILLS"
    },
    actions: {
      currentJob: "Aktueller Job",
      careerPath: "Karrierepfad",
      active: "Aktiv",
      promote: "Befördern",
      locked: "Gesperrt",
      future: "Zukunft",
      reqIq: "Benöt. IQ",
      managePay: "Verwalten",
      borrowCash: "Leihen",
      totalPrincipal: "Gesamtschuld",
      monthlyOb: "Monatl. Rate",
      strategy: "Strategie",
      avalanche: "Lawine (Zins)",
      snowball: "Schneeball (Betrag)",
      debtHint: "Mindestzahlungen sind automatisch. Nutzen Sie Buttons für **Sonderzahlungen**.",
      debtFree: "Schuldenfrei!",
      debtFreeSub: "Sie bauen effizient Vermögen auf.",
      extra: "Extra",
      payOff: "Abbezahlen",
      borrowWarning: "⚠️ Schulden reduzieren Ihren Cashflow. Hohe Zinsen sind gefährlich.",
      borrow: "Nehmen",
      holdings: "Bestand",
      price: "Preis",
      risk: "Risiko",
      buy: "Kaufen",
      learn: "Lernen",
      maxed: "Max",
      tip: "💡 Tipp:",
      investTip: "Diversifizieren Sie. Aktien wachsen schnell, schwanken aber stark."
    },
    chart: {
      title: "Vermögensverlauf",
      noData: "Keine Daten"
    },
    jobs: {
      barista: { title: "Barista" },
      intern: { title: "Praktikant" },
      junior_dev: { title: "Junior Entwickler" },
      senior_dev: { title: "Senior Entwickler" },
      manager: { title: "Produktmanager" },
      cto: { title: "Startup CTO" }
    },
    assets: {
      index_fund: "Welt-Indexfonds",
      bond_fund: "Staatsanleihen",
      crypto_coin: "Kryptowährung"
    },
    loans: {
      student_loan: "Studienkredit",
      credit_card: "Kreditkarte",
      personal_loan: "Privatkredit",
      shark_loan: "Schnelles Geld"
    },
    logs: {
        welcome: "Willkommen bei Wealth Quest!",
        yearComplete: "Jahr {year} Beendet. Vermögen: {nw}",
        bought: "{asset} gekauft",
        promoted: "Befördert zum {job}!",
        paidOff: "🎉 {debt} abbezahlt!",
        paidOffAuto: "🎉 {debt} abbezahlt (Auto)",
        extraPay: "Sonderzahlung: {debt} ({amt})",
        borrowed: "Geliehen: {debt} (+{amt})",
        debtPayments: "Schuldenzahlungen: {details}",
        overdraft: "Warnung: Dispo! Hoher Stress."
    },
    tutorial: {
        welcome_title: "Willkommen! 🚀",
        welcome_desc: "Ihre Reise zur finanziellen Freiheit beginnt hier.",
        stats_title: "Vitalwerte 📊",
        stats_desc: "Behalten Sie Ihr Reinvermögen im Auge.",
        chart_title: "Langzeit 📈",
        chart_desc: "Dieses Diagramm verfolgt Ihren Fortschritt.",
        cashflow_title: "Cashflow 💸",
        cashflow_desc: "Zeigt, wie viel Geld jeden Monat übrig bleibt.",
        advance_title: "Zeitreise ⏳",
        advance_desc: "Klicken Sie hier, um 1 Monat vorzuspulen.",
        actions_title: "Kommandozentrale ⚡",
        actions_desc: "Verwalten Sie hier Karriere, Schulden und Investitionen.",
        tab_career_title: "Karriere 💼",
        tab_career_desc: "Prüfen Sie Anforderungen für Beförderungen.",
        tab_debt_title: "Schulden 💳",
        tab_debt_desc: "Managen Sie Kredite. Hohe Zinsen sind Gift.",
        tab_invest_title: "Investieren 🏦",
        tab_invest_desc: "Kaufen Sie Aktien oder Anleihen für Wachstum.",
        tab_skills_title: "Skills 🧠",
        tab_skills_desc: "Lernen Sie Skills für bessere Jobs.",
        advisor_title: "KI-Coach 🧠",
        advisor_desc: "Stecken Sie fest? Fragen Sie Ihren KI-Finanzberater.",
        finish_title: "Bereit! 🎉",
        finish_desc: "Hier ist ein $500 Bonus für den Start.",
        next: "Weiter",
        finish: "Belohnung",
        skip: "Überspringen"
    }
  },
  jp: {
    app: {
      title: "ウェルスクエスト",
      netWorth: "純資産",
      cash: "現金",
      debt: "総負債",
      iq: "金融IQ",
      logs: "活動履歴",
      close: "閉じる"
    },
    dashboard: {
      monthlyCashflow: "月次キャッシュフロー",
      income: "収入",
      expenses: "生活費",
      debtPayments: "借金返済（最小）",
      net: "純利益",
      nextMonth: "翌月へ",
      age: "{years}歳 {months}ヶ月"
    },
    tabs: {
      career: "キャリア",
      debt: "借金",
      invest: "投資",
      skills: "スキル"
    },
    actions: {
      currentJob: "現在の仕事",
      careerPath: "キャリアパス",
      active: "現職",
      promote: "昇進",
      locked: "ロック",
      future: "将来",
      reqIq: "必要IQ",
      managePay: "返済管理",
      borrowCash: "借入",
      totalPrincipal: "元本合計",
      monthlyOb: "月々の義務",
      strategy: "戦略",
      avalanche: "アバランチ (金利順)",
      snowball: "スノーボール (残高順)",
      debtHint: "最低支払額は自動的に引き落とされます。**繰り上げ返済**には下のボタンを使用してください。",
      debtFree: "借金完済！",
      debtFreeSub: "効率的に資産を構築しています。",
      extra: "追加",
      payOff: "完済",
      borrowWarning: "⚠️ 借金は即座に現金を得られますが、月々のキャッシュフローを減少させます。高金利の借金は危険です。",
      borrow: "借りる",
      holdings: "保有額",
      price: "価格",
      risk: "リスク",
      buy: "買う",
      learn: "学ぶ",
      maxed: "最大",
      tip: "💡 ヒント:",
      investTip: "分散投資でリスクを下げましょう。株式は成長が早いですが暴落もあります。債券は安全です。"
    },
    chart: {
      title: "資産推移",
      noData: "データなし"
    },
    jobs: {
      barista: { title: "バリスタ" },
      intern: { title: "インターン" },
      junior_dev: { title: "ジュニアエンジニア" },
      senior_dev: { title: "シニアエンジニア" },
      manager: { title: "プロダクトマネージャー" },
      cto: { title: "スタートアップCTO" }
    },
    assets: {
      index_fund: "世界株インデックス",
      bond_fund: "安全国債",
      crypto_coin: "暗号資産"
    },
    loans: {
      student_loan: "奨学金",
      credit_card: "クレジットカード",
      personal_loan: "個人ローン",
      shark_loan: "高金利ローン"
    },
    logs: {
        welcome: "ウェルスクエストへようこそ！",
        yearComplete: "{year}年目完了。純資産: {nw}",
        bought: "{asset}を購入",
        promoted: "{job}に昇進しました！",
        paidOff: "🎉 {debt}を完済しました！",
        paidOffAuto: "🎉 {debt}を完済 (自動)",
        extraPay: "繰上返済: {debt} ({amt})",
        borrowed: "借入: {debt} (+{amt})",
        debtPayments: "借金返済: {details}",
        overdraft: "警告: 当座貸越！ストレス増。"
    },
    tutorial: {
        welcome_title: "ようこそ！ 🚀",
        welcome_desc: "経済的自由への旅が始まります。",
        stats_title: "重要指標 📊",
        stats_desc: "純資産と現金のバランスに注目しましょう。",
        chart_title: "長期視点 📈",
        chart_desc: "資産の成長をこのグラフで確認できます。",
        cashflow_title: "キャッシュフロー 💸",
        cashflow_desc: "毎月の手取り額です。赤字にならないように！",
        advance_title: "時間経過 ⏳",
        advance_desc: "1ヶ月進めて、給料を受け取りましょう。",
        actions_title: "司令室 ⚡",
        actions_desc: "キャリア、借金、投資はここで管理します。",
        tab_career_title: "キャリア 💼",
        tab_career_desc: "昇進条件を確認しましょう。",
        tab_debt_title: "借金 💳",
        tab_debt_desc: "高金利の借金は資産形成の敵です。",
        tab_invest_title: "投資 🏦",
        tab_invest_desc: "株や債券を買って資産を増やしましょう。",
        tab_skills_title: "スキル 🧠",
        tab_skills_desc: "IQを高めて高収入の職に就きましょう。",
        advisor_title: "AIコーチ 🧠",
        advisor_desc: "困ったらAIアドバイザーに相談しましょう。",
        finish_title: "準備完了！ 🎉",
        finish_desc: "開始ボーナス$500をプレゼントします。",
        next: "次へ",
        finish: "報酬を受け取る",
        skip: "スキップ"
    }
  },
  fr: {
    app: {
      title: "Quête de Richesse",
      netWorth: "Valeur Nette",
      cash: "Cash",
      debt: "Dette Totale",
      iq: "QI Financier",
      logs: "Journal",
      close: "Fermer"
    },
    dashboard: {
      monthlyCashflow: "Cashflow Mensuel",
      income: "Revenus",
      expenses: "Vie & Style",
      debtPayments: "Paiements Dette",
      net: "Net",
      nextMonth: "Mois Suivant",
      age: "Âge: {years}a {months}m"
    },
    tabs: {
      career: "CARRIÈRE",
      debt: "DETTES",
      invest: "INVESTIR",
      skills: "COMPÉTENCES"
    },
    actions: {
      currentJob: "Poste Actuel",
      careerPath: "Parcours",
      active: "Actif",
      promote: "Promouvoir",
      locked: "Verr.",
      future: "Futur",
      reqIq: "QI Req.",
      managePay: "Gérer",
      borrowCash: "Emprunter",
      totalPrincipal: "Principal Total",
      monthlyOb: "Obligation Mensuelle",
      strategy: "Stratégie",
      avalanche: "Avalanche (Taux)",
      snowball: "Boule de Neige (Montant)",
      debtHint: "Les paiements minimums sont automatiques. Utilisez les boutons pour payer **en plus**.",
      debtFree: "Sans Dettes !",
      debtFreeSub: "Vous bâtissez votre richesse efficacement.",
      extra: "Extra",
      payOff: "Solder",
      borrowWarning: "⚠️ La dette réduit votre cashflow. Les taux élevés sont dangereux.",
      borrow: "Prendre",
      holdings: "Avoirs",
      price: "Prix",
      risk: "Risque",
      buy: "Acheter",
      learn: "Apprendre",
      maxed: "Max",
      tip: "💡 Conseil:",
      investTip: "Diversifiez pour réduire le risque. Les actions grimpent vite mais chutent fort."
    },
    chart: {
      title: "Trajectoire",
      noData: "Aucune Donnée"
    },
    jobs: {
      barista: { title: "Barista" },
      intern: { title: "Stagiaire" },
      junior_dev: { title: "Développeur Junior" },
      senior_dev: { title: "Développeur Senior" },
      manager: { title: "Product Manager" },
      cto: { title: "CTO Startup" }
    },
    assets: {
      index_fund: "Fonds Mondial",
      bond_fund: "Obligations État",
      crypto_coin: "Cryptoonnaie"
    },
    loans: {
      student_loan: "Prêt Étudiant",
      credit_card: "Carte Crédit",
      personal_loan: "Prêt Perso",
      shark_loan: "Crédit Rapide"
    },
    logs: {
        welcome: "Bienvenue dans Wealth Quest !",
        yearComplete: "Année {year} Terminée. Valeur: {nw}",
        bought: "Acheté {asset}",
        promoted: "Promu à {job} !",
        paidOff: "🎉 {debt} Soldée !",
        paidOffAuto: "🎉 {debt} Soldée (Auto)",
        extraPay: "Paiement Extra: {debt} ({amt})",
        borrowed: "Emprunté: {debt} (+{amt})",
        debtPayments: "Paiements Dettes: {details}",
        overdraft: "Alerte: Découvert ! Stress élevé."
    },
    tutorial: {
        welcome_title: "Bienvenue ! 🚀",
        welcome_desc: "Votre voyage vers la liberté financière commence ici.",
        stats_title: "Signes Vitaux 📊",
        stats_desc: "Surveillez votre Valeur Nette et votre Cash.",
        chart_title: "Long Terme 📈",
        chart_desc: "Ce graphique suit votre progression.",
        cashflow_title: "Cashflow 💸",
        cashflow_desc: "Montre combien il vous reste chaque mois.",
        advance_title: "Avancer ⏳",
        advance_desc: "Cliquez pour avancer d'un mois et être payé.",
        actions_title: "Centre de Commande ⚡",
        actions_desc: "Gérez carrière, dettes et investissements ici.",
        tab_career_title: "Carrière 💼",
        tab_career_desc: "Visez la promotion.",
        tab_debt_title: "Dettes 💳",
        tab_debt_desc: "Éliminez les prêts toxiques.",
        tab_invest_title: "Investir 🏦",
        tab_invest_desc: "Faites travailler votre argent.",
        tab_skills_title: "Compétences 🧠",
        tab_skills_desc: "Apprenez pour gagner plus.",
        advisor_title: "Coach IA 🧠",
        advisor_desc: "Bloqué ? Parlez à votre conseiller IA.",
        finish_title: "C'est Parti ! 🎉",
        finish_desc: "Voici un bonus de 500 $ pour commencer.",
        next: "Suivant",
        finish: "Récompense",
        skip: "Passer"
    }
  }
};

// Helper function to get nested translation
export const t = (lang: LanguageCode, path: string | string[], params?: Record<string, string | number>) => {
  const keys = Array.isArray(path) ? path : path.split('.');
  let current = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  
  for (const key of keys) {
    if (current[key] === undefined) {
      // Fallback to English if key is missing in selected lang
      let fallback = TRANSLATIONS['en'];
      for (const fKey of keys) {
          if (fallback && fallback[fKey] !== undefined) {
              fallback = fallback[fKey];
          } else {
              fallback = null;
              break;
          }
      }
      if (fallback) {
          current = fallback;
      } else {
          console.warn(`Missing translation: ${keys.join('.')} in ${lang}`);
          return keys.join('.'); 
      }
    } else {
        current = current[key];
    }
  }

  let result = current as string;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`{${key}}`, String(value));
    });
  }
  return result;
};

// Helper to look up localized entity names (jobs, assets) by ID
export const tEntity = (lang: LanguageCode, category: 'jobs' | 'assets' | 'loans', id: string, field: string = 'title') => {
    // Try to find specific translation
    // Path ex: jobs.barista.title
    const path = [category, id];
    if (field) path.push(field);
    
    // Check if key exists in dictionary, if not return ID
    const keys = path;
    let current = TRANSLATIONS[lang] || TRANSLATIONS['en'];
    let found = true;
    for (const key of keys) {
        if (!current || current[key] === undefined) {
            found = false;
            break;
        }
        current = current[key];
    }
    
    if (found) return current as string;
    
    // Fallback: Use ID or return generic string
    return id.toUpperCase();
};