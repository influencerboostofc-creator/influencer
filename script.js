// Inicialização de dados no localStorage se não existirem
function inicializarDados() {
    if (!localStorage.getItem('cadastros')) {
        localStorage.setItem('cadastros', JSON.stringify([]));
    }
    if (!localStorage.getItem('tarefas')) {
        localStorage.setItem('tarefas', JSON.stringify([]));
    }
    if (!localStorage.getItem('vagas')) {
        localStorage.setItem('vagas', JSON.stringify([]));
    }
}

// Gerar código único para cadastro
function gerarCodigoUnico() {
    return 'BOOST-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Salvar cadastro no localStorage
function salvarCadastro(tipo, dados) {
    const cadastros = JSON.parse(localStorage.getItem('cadastros'));
    const codigo = gerarCodigoUnico();
    
    const novoCadastro = {
        id: codigo,
        tipo: tipo,
        dados: dados,
        status: 'em_analise',
        mensagem: '',
        dataCadastro: new Date().toISOString(),
        usuario: ''
    };
    
    cadastros.push(novoCadastro);
    localStorage.setItem('cadastros', JSON.stringify(cadastros));
    
    return codigo;
}

// Consultar status de cadastro
function consultarStatus(codigo) {
    const cadastros = JSON.parse(localStorage.getItem('cadastros'));
    return cadastros.find(cadastro => cadastro.id === codigo);
}

// Verificar login de administrador
function verificarLoginAdmin(senha) {
    return senha === '1010';
}

// Verificar login de membro
function verificarLoginMembro(usuario) {
    const cadastros = JSON.parse(localStorage.getItem('cadastros'));
    return cadastros.find(cadastro => cadastro.usuario === usuario && cadastro.status === 'aprovado');
}

// Aprovar ou reprovar cadastro
function atualizarStatusCadastro(codigo, novoStatus, mensagem = '') {
    const cadastros = JSON.parse(localStorage.getItem('cadastros'));
    const index = cadastros.findIndex(cadastro => cadastro.id === codigo);
    
    if (index !== -1) {
        cadastros[index].status = novoStatus;
        cadastros[index].mensagem = mensagem;
        
        if (novoStatus === 'aprovado') {
            // Gerar usuário padrão para membros aprovados
            const prefixo = Math.random().toString(36).substring(2, 5).toUpperCase();
            cadastros[index].usuario = `${prefixo}-BOOSTMEMBER`;
        }
        
        localStorage.setItem('cadastros', JSON.stringify(cadastros));
        return true;
    }
    
    return false;
}

// Adicionar nova tarefa
function adicionarTarefa(titulo, descricao, valor, tipoUsuario) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas'));
    
    const novaTarefa = {
        id: 'TASK-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        titulo: titulo,
        descricao: descricao,
        valor: valor,
        tipoUsuario: tipoUsuario,
        status: 'pendente',
        atribuido: [],
        entregas: []
    };
    
    tarefas.push(novaTarefa);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    
    return novaTarefa.id;
}

// Adicionar vaga de emprego
function adicionarVaga(titulo, descricao, salario, requisitos) {
    const vagas = JSON.parse(localStorage.getItem('vagas'));
    
    const novaVaga = {
        id: 'JOB-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        titulo: titulo,
        descricao: descricao,
        salario: salario,
        requisitos: requisitos,
        status: 'aberta',
        dataCriacao: new Date().toISOString()
    };
    
    vagas.push(novaVaga);
    localStorage.setItem('vagas', JSON.stringify(vagas));
    
    return novaVaga.id;
}

// Entregar tarefa
function entregarTarefa(tarefaId, usuarioId, conteudo) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas'));
    const index = tarefas.findIndex(tarefa => tarefa.id === tarefaId);
    
    if (index !== -1) {
        const entrega = {
            id: 'DELIVERY-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
            usuarioId: usuarioId,
            conteudo: conteudo,
            dataEntrega: new Date().toISOString(),
            status: 'em_analise'
        };
        
        tarefas[index].entregas.push(entrega);
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
        
        return entrega.id;
    }
    
    return null;
}

// Avaliar entrega de tarefa
function avaliarEntrega(tarefaId, entregaId, aprovado, feedback = '') {
    const tarefas = JSON.parse(localStorage.getItem('tarefas'));
    const tarefaIndex = tarefas.findIndex(tarefa => tarefa.id === tarefaId);
    
    if (tarefaIndex !== -1) {
        const entregaIndex = tarefas[tarefaIndex].entregas.findIndex(entrega => entrega.id === entregaId);
        
        if (entregaIndex !== -1) {
            tarefas[tarefaIndex].entregas[entregaIndex].status = aprovado ? 'aprovado' : 'reprovado';
            tarefas[tarefaIndex].entregas[entregaIndex].feedback = feedback;
            
            localStorage.setItem('tarefas', JSON.stringify(tarefas));
            return true;
        }
    }
    
    return false;
}

// Solicitar pagamento
function solicitarPagamento(tarefaId, entregaId, chavePix) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas'));
    const tarefaIndex = tarefas.findIndex(tarefa => tarefa.id === tarefaId);
    
    if (tarefaIndex !== -1) {
        const entregaIndex = tarefas[tarefaIndex].entregas.findIndex(
            entrega => entrega.id === entregaId && entrega.status === 'aprovado'
        );
        
        if (entregaIndex !== -1) {
            tarefas[tarefaIndex].entregas[entregaIndex].pagamento = {
                chavePix: chavePix,
                dataSolicitacao: new Date().toISOString(),
                status: 'processando'
            };
            
            localStorage.setItem('tarefas', JSON.stringify(tarefas));
            return true;
        }
    }
    
    return false;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar dados
    inicializarDados();
    
    // Formulário de Influencer
    const influencerForm = document.getElementById('influencerForm');
    if (influencerForm) {
        influencerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const dados = {
                nome: document.getElementById('nomeInfluencer').value,
                sobrenome: document.getElementById('sobrenomeInfluencer').value,
                telefone: document.getElementById('telefoneInfluencer').value,
                cpf: document.getElementById('cpfInfluencer').value,
                instagram: document.getElementById('instagramInfluencer').value
            };
            
            const codigo = salvarCadastro('influencer', dados);
            
            // Mostrar modal de confirmação
            document.getElementById('codigoUnico').textContent = codigo;
            const confirmacaoModal = new bootstrap.Modal(document.getElementById('confirmacaoModal'));
            const influencerModal = bootstrap.Modal.getInstance(document.getElementById('influencerModal'));
            influencerModal.hide();
            confirmacaoModal.show();
            
            // Limpar formulário
            influencerForm.reset();
        });
    }
    
    // Formulário de Empresa
    const empresaForm = document.getElementById('empresaForm');
    if (empresaForm) {
        empresaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const dados = {
                nome: document.getElementById('nomeEmpresa').value,
                sobrenome: document.getElementById('sobrenomeEmpresa').value,
                telefone: document.getElementById('telefoneEmpresa').value,
                cpf: document.getElementById('cpfEmpresa').value,
                instagram: document.getElementById('instagramEmpresa').value
            };
            
            const codigo = salvarCadastro('empresa', dados);
            
            // Mostrar modal de confirmação
            document.getElementById('codigoUnico').textContent = codigo;
            const confirmacaoModal = new bootstrap.Modal(document.getElementById('confirmacaoModal'));
            const empresaModal = bootstrap.Modal.getInstance(document.getElementById('empresaModal'));
            empresaModal.hide();
            confirmacaoModal.show();
            
            // Limpar formulário
            empresaForm.reset();
        });
    }
    
    // Formulário de Funcionário
    const funcionarioForm = document.getElementById('funcionarioForm');
    if (funcionarioForm) {
        funcionarioForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const dados = {
                nome: document.getElementById('nomeFuncionario').value,
                sobrenome: document.getElementById('sobrenomeFuncionario').value,
                telefone: document.getElementById('telefoneFuncionario').value,
                cpf: document.getElementById('cpfFuncionario').value,
                instagram: document.getElementById('instagramFuncionario').value
            };
            
            const codigo = salvarCadastro('funcionario', dados);
            
            // Mostrar modal de confirmação
            document.getElementById('codigoUnico').textContent = codigo;
            const confirmacaoModal = new bootstrap.Modal(document.getElementById('confirmacaoModal'));
            const funcionarioModal = bootstrap.Modal.getInstance(document.getElementById('funcionarioModal'));
            funcionarioModal.hide();
            confirmacaoModal.show();
            
            // Limpar formulário
            funcionarioForm.reset();
        });
    }
    
    // Formulário de Consulta
    const consultaForm = document.getElementById('consultaForm');
    if (consultaForm) {
        consultaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const codigo = document.getElementById('codigoConsulta').value;
            const resultado = consultarStatus(codigo);
            
            const resultadoDiv = document.getElementById('resultadoConsulta');
            const statusAlert = document.getElementById('statusAlert');
            const statusTitulo = document.getElementById('statusTitulo');
            const statusMensagem = document.getElementById('statusMensagem');
            
            resultadoDiv.classList.remove('d-none');
            
            if (resultado) {
                // Configurar alerta baseado no status
                if (resultado.status === 'em_analise') {
                    statusAlert.className = 'alert alert-warning';
                    statusTitulo.textContent = 'Em Análise';
                    statusMensagem.textContent = 'Seu cadastro está sendo analisado pela nossa equipe. Por favor, aguarde.';
                } else if (resultado.status === 'aprovado') {
                    statusAlert.className = 'alert alert-success';
                    statusTitulo.textContent = 'Aprovado';
                    statusMensagem.textContent = `Parabéns! Seu cadastro foi aprovado. Seu usuário para acesso à área de membros é: ${resultado.usuario}`;
                } else if (resultado.status === 'reprovado') {
                    statusAlert.className = 'alert alert-danger';
                    statusTitulo.textContent = 'Reprovado';
                    statusMensagem.textContent = resultado.mensagem || 'Seu cadastro não foi aprovado. Entre em contato para mais informações.';
                }
            } else {
                statusAlert.className = 'alert alert-danger';
                statusTitulo.textContent = 'Código Inválido';
                statusMensagem.textContent = 'O código informado não foi encontrado. Verifique e tente novamente.';
            }
        });
    }
    
    // Login Administrativo
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const senha = document.getElementById('adminSenha').value;
            
            if (verificarLoginAdmin(senha)) {
                // Redirecionar para a área administrativa
                window.location.href = 'admin.html';
            } else {
                alert('Senha incorreta!');
            }
        });
    }
    
    // Botão de Acesso à Área de Membros
    const acessoMembrosBtn = document.getElementById('acessoMembrosBtn');
    if (acessoMembrosBtn) {
        acessoMembrosBtn.addEventListener('click', function() {
            const membrosLoginModal = new bootstrap.Modal(document.getElementById('membrosLoginModal'));
            membrosLoginModal.show();
        });
    }
    
    // Login de Membros
    const membrosLoginForm = document.getElementById('membrosLoginForm');
    if (membrosLoginForm) {
        membrosLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const usuario = document.getElementById('membroUsuario').value;
            
            if (verificarLoginMembro(usuario)) {
                // Salvar usuário na sessão e redirecionar para a área de membros
                sessionStorage.setItem('usuarioLogado', usuario);
                window.location.href = 'membros.html';
            } else {
                alert('Usuário inválido ou não aprovado!');
            }
        });
    }
});