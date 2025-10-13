import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Zap,
  MessageSquare,
  Users,
  TrendingUp,
  Settings,
  Info,
  Lightbulb,
  Star,
  Target,
  ArrowRight,
  HelpCircle,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Plus
} from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  icon: React.ReactNode;
  importance: 'high' | 'medium' | 'low';
}

const WorkflowGuide: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('getting-started');
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const markSectionComplete = (sectionId: string) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
  };

  const guideSections: GuideSection[] = [
    {
      id: 'getting-started',
      title: 'Introduzione ai Workflows',
      description: 'Scopri cos\'è un workflow e come può migliorare l\'esperienza del tuo chatbot',
      importance: 'high',
      icon: <Zap className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Che cos'è un Workflow?</h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Un workflow è una sequenza automatica di azioni che il tuo chatbot esegue quando si verificano determinate condizioni. 
                  È come dare al tuo bot una lista di "se questo, allora fai quello" per gestire le conversazioni in modo intelligente.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <h4 className="font-semibold text-green-900">Vantaggi</h4>
              </div>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Risposte automatiche 24/7</li>
                <li>• Gestione intelligente delle richieste</li>
                <li>• Migliore esperienza utente</li>
                <li>• Riduzione del carico di lavoro</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                <h4 className="font-semibold text-yellow-900">Esempi di Utilizzo</h4>
              </div>
              <ul className="text-yellow-800 text-sm space-y-1">
                <li>• Saluto automatico per nuovi visitatori</li>
                <li>• Raccolta informazioni di contatto</li>
                <li>• Trasferimento a operatori umani</li>
                <li>• Invio di materiale informativo</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'triggers',
      title: 'Trigger: Quando Attivare i Workflows',
      description: 'Comprendi tutti i tipi di trigger disponibili e quando utilizzarli',
      importance: 'high',
      icon: <Zap className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {[
              { 
                id: 'first_visit', 
                name: 'Prima Visita', 
                description: 'Si attiva quando un utente visita il sito per la prima volta',
                example: 'Ideale per: messaggi di benvenuto, presentazione del servizio',
                color: 'blue'
              },
              { 
                id: 'time_on_page', 
                name: 'Tempo sulla Pagina', 
                description: 'Si attiva dopo che l\'utente rimane sulla pagina per un tempo specifico',
                example: 'Ideale per: offrire aiuto a utenti che sembrano confusi',
                color: 'purple'
              },
              { 
                id: 'scroll_depth', 
                name: 'Profondità di Scroll', 
                description: 'Si attiva quando l\'utente scorre fino a una certa percentuale della pagina',
                example: 'Ideale per: mostrare offerte speciali alla fine della pagina',
                color: 'green'
              },
              { 
                id: 'exit_intent', 
                name: 'Intenzione di Uscita', 
                description: 'Si attiva quando l\'utente muove il mouse verso il pulsante di chiusura',
                example: 'Ideale per: offerte last-minute, sconti per trattenere l\'utente',
                color: 'red'
              },
              { 
                id: 'chat_started', 
                name: 'Chat Iniziata', 
                description: 'Si attiva quando l\'utente apre la finestra di chat',
                example: 'Ideale per: messaggi di benvenuto personalizzati',
                color: 'indigo'
              },
              { 
                id: 'message_received', 
                name: 'Messaggio Ricevuto', 
                description: 'Si attiva quando l\'utente invia un messaggio',
                example: 'Ideale per: risposte automatiche basate su parole chiave',
                color: 'orange'
              }
            ].map((trigger) => (
              <div key={trigger.id} className={`bg-${trigger.color}-50 border border-${trigger.color}-200 rounded-lg p-4`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`font-semibold text-${trigger.color}-900 mb-1`}>{trigger.name}</h4>
                    <p className={`text-${trigger.color}-800 text-sm mb-2`}>{trigger.description}</p>
                    <p className={`text-${trigger.color}-700 text-xs font-medium`}>{trigger.example}</p>
                  </div>
                  <Badge variant="outline" className={`text-${trigger.color}-700 border-${trigger.color}-300`}>
                    {trigger.id.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'actions',
      title: 'Azioni: Cosa Può Fare il Tuo Workflow',
      description: 'Esplora tutte le azioni disponibili per creare workflows potenti',
      importance: 'high',
      icon: <MessageSquare className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {[
              { 
                id: 'send_message', 
                name: 'Invia Messaggio', 
                description: 'Invia un messaggio di testo all\'utente',
                details: 'Puoi personalizzare il messaggio e includere emoji, link e formattazione base',
                icon: '💬',
                difficulty: 'Facile'
              },
              { 
                id: 'ask_email', 
                name: 'Richiedi Email', 
                description: 'Chiede all\'utente di fornire il suo indirizzo email',
                details: 'Perfetto per lead generation e building di mailing list',
                icon: '📧',
                difficulty: 'Facile'
              },
              { 
                id: 'show_form', 
                name: 'Mostra Modulo', 
                description: 'Visualizza un modulo personalizzato per raccogliere informazioni',
                details: 'Puoi definire campi personalizzati come nome, telefono, azienda, etc.',
                icon: '📝',
                difficulty: 'Medio'
              },
              { 
                id: 'redirect', 
                name: 'Reindirizza Utente', 
                description: 'Reindirizza l\'utente a una pagina specifica',
                details: 'Utile per portare l\'utente a pagine di prodotto, checkout, o contatti',
                icon: '🔗',
                difficulty: 'Facile'
              },
              { 
                id: 'assign_agent', 
                name: 'Assegna ad Agente', 
                description: 'Trasferisce la conversazione a un operatore umano',
                details: 'Quando il bot non può gestire la richiesta, passa il controllo a un umano',
                icon: '👤',
                difficulty: 'Medio'
              },
              { 
                id: 'show_product', 
                name: 'Mostra Prodotto', 
                description: 'Visualizza informazioni su un prodotto specifico',
                details: 'Integrazione con il catalogo prodotti per mostrare dettagli e prezzi',
                icon: '🛍️',
                difficulty: 'Avanzato'
              },
              { 
                id: 'offer_discount', 
                name: 'Offri Sconto', 
                description: 'Presenta un codice sconto all\'utente',
                details: 'Genera o mostra codici sconto per incentivare l\'acquisto',
                icon: '🎫',
                difficulty: 'Medio'
              },
              { 
                id: 'delay', 
                name: 'Ritardo', 
                description: 'Aggiunge una pausa prima dell\'azione successiva',
                details: 'Rende la conversazione più naturale simulando il tempo di "riflessione"',
                icon: '⏱️',
                difficulty: 'Facile'
              }
            ].map((action) => (
              <div key={action.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <span className="text-2xl">{action.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{action.name}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            action.difficulty === 'Facile' ? 'text-green-700 border-green-300' :
                            action.difficulty === 'Medio' ? 'text-yellow-700 border-yellow-300' :
                            'text-red-700 border-red-300'
                          }`}
                        >
                          {action.difficulty}
                        </Badge>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{action.description}</p>
                      <p className="text-gray-600 text-xs">{action.details}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'best-practices',
      title: 'Best Practices e Consigli',
      description: 'Suggerimenti per creare workflows efficaci e coinvolgenti',
      importance: 'medium',
      icon: <Star className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                Cosa Fare
              </h4>
              {[
                'Usa un linguaggio semplice e amichevole',
                'Testa sempre i tuoi workflows prima di attivarli',
                'Mantieni le conversazioni brevi e dirette',
                'Offri sempre un\'opzione per parlare con un umano',
                'Personalizza i messaggi quando possibile',
                'Monitora le metriche di performance'
              ].map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{tip}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                Cosa Evitare
              </h4>
              {[
                'Non creare workflows troppo lunghi o complessi',
                'Non bombardare l\'utente con troppi messaggi',
                'Non essere troppo invadente con le richieste',
                'Non dimenticare di gestire i casi di errore',
                'Non attivare trigger troppo aggressivi',
                'Non ignorare il feedback degli utenti'
              ].map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-indigo-900 mb-2">Suggerimento Pro</h4>
                <p className="text-indigo-800 text-sm leading-relaxed">
                  Inizia sempre con workflows semplici e poi aggiungici complessità gradualmente. 
                  Un workflow che funziona bene al 80% è meglio di uno complesso che non funziona mai.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'examples',
      title: 'Esempi di Workflows Popolari',
      description: 'Template pronti all\'uso per i casi d\'uso più comuni',
      importance: 'medium',
      icon: <Target className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          {[
            {
              title: 'Workflow di Benvenuto',
              description: 'Saluta i nuovi visitatori e presenta il tuo servizio',
              trigger: 'Prima Visita',
              actions: ['Invia messaggio di benvenuto', 'Mostra menu opzioni', 'Chiedi se serve aiuto'],
              difficulty: 'Facile',
              useCase: 'Perfetto per tutti i siti web'
            },
            {
              title: 'Lead Generation',
              description: 'Raccoglie informazioni di contatto dai visitatori interessati',
              trigger: 'Profondità di Scroll (70%)',
              actions: ['Offri contenuto gratuito', 'Richiedi email', 'Invia link download'],
              difficulty: 'Medio',
              useCase: 'Ideale per blog e siti informativi'
            },
            {
              title: 'Recupero Carrello Abbandonato',
              description: 'Ricontatta utenti che hanno abbandonato il carrello',
              trigger: 'Intenzione di Uscita',
              actions: ['Mostra prodotti nel carrello', 'Offri sconto', 'Facilita il checkout'],
              difficulty: 'Avanzato',
              useCase: 'Essenziale per e-commerce'
            },
            {
              title: 'Supporto Clienti',
              description: 'Gestisce richieste di supporto e FAQ',
              trigger: 'Parole chiave (aiuto, problema, supporto)',
              actions: ['Raccoglie dettagli problema', 'Suggerisce soluzioni', 'Trasferisce ad agente'],
              difficulty: 'Medio',
              useCase: 'Utile per tutti i business'
            }
          ].map((example, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{example.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{example.description}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      {example.trigger}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`${
                        example.difficulty === 'Facile' ? 'text-green-700 border-green-300' :
                        example.difficulty === 'Medio' ? 'text-yellow-700 border-yellow-300' :
                        'text-red-700 border-red-300'
                      }`}
                    >
                      {example.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700">Sequenza Azioni:</h5>
                <div className="flex flex-wrap gap-1">
                  {example.actions.map((action, actionIndex) => (
                    <div key={actionIndex} className="flex items-center space-x-1">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {actionIndex + 1}. {action}
                      </span>
                      {actionIndex < example.actions.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-indigo-600 font-medium mt-2">{example.useCase}</p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'analytics',
      title: 'Monitoraggio e Analisi',
      description: 'Come interpretare le metriche e ottimizzare i tuoi workflows',
      importance: 'medium',
      icon: <TrendingUp className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Metriche Chiave</h4>
              {[
                { 
                  name: 'Tasso di Attivazione', 
                  description: 'Percentuale di volte che il trigger si attiva rispetto alle visite',
                  target: '> 15%'
                },
                { 
                  name: 'Tasso di Completamento', 
                  description: 'Percentuale di utenti che completano tutto il workflow',
                  target: '> 60%'
                },
                { 
                  name: 'Tasso di Conversione', 
                  description: 'Percentuale di utenti che compiono l\'azione desiderata',
                  target: '> 5%'
                },
                { 
                  name: 'Tempo di Risposta', 
                  description: 'Velocità media di risposta degli utenti',
                  target: '< 30 sec'
                }
              ].map((metric, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-gray-900 text-sm">{metric.name}</h5>
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      {metric.target}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-xs">{metric.description}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Ottimizzazione</h4>
              {[
                'Se il tasso di attivazione è basso, rivedi i trigger',
                'Se molti utenti abbandonano, semplifica il workflow',
                'Se la conversione è bassa, migliora il call-to-action',
                'Testa varianti del messaggio con A/B testing',
                'Monitora i feedback degli utenti nelle chat',
                'Aggiorna regolarmente in base ai dati'
              ].map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: 'Risoluzione Problemi',
      description: 'Soluzioni ai problemi più comuni con i workflows',
      importance: 'low',
      icon: <HelpCircle className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          {[
            {
              problem: 'Il workflow non si attiva',
              solutions: [
                'Verifica che il workflow sia attivo (toggle verde)',
                'Controlla che i trigger siano configurati correttamente',
                'Assicurati che il chatbot associato sia attivo',
                'Testa in modalità privata/incognito per simulare nuovi visitatori'
              ]
            },
            {
              problem: 'I messaggi non vengono inviati',
              solutions: [
                'Controlla che il testo del messaggio non sia vuoto',
                'Verifica la connessione internet',
                'Assicurati che il chatbot sia correttamente integrato',
                'Controlla la console del browser per errori JavaScript'
              ]
            },
            {
              problem: 'I trigger si attivano troppo spesso',
              solutions: [
                'Aumenta i tempi di attesa (es. da 5 a 15 secondi)',
                'Aggiungi condizioni per escludere utenti già contattati',
                'Usa trigger meno aggressivi (es. scroll al 80% invece del 50%)',
                'Implementa una logica di "una volta per sessione"'
              ]
            },
            {
              problem: 'Gli utenti abbandonano il workflow',
              solutions: [
                'Semplifica il processo riducendo il numero di passaggi',
                'Rendi i messaggi più coinvolgenti e personali',
                'Aggiungi incentivi (sconti, contenuti gratuiti)',
                'Testa timing diversi per i messaggi'
              ]
            }
          ].map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-3 flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                {item.problem}
              </h4>
              <div className="space-y-2">
                {item.solutions.map((solution, solutionIndex) => (
                  <div key={solutionIndex} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{solution}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Guida Completa ai Workflows</h1>
            <p className="text-blue-100 text-sm">
              Tutto quello che devi sapere per creare workflows efficaci
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>Per tutti i livelli</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>15-20 min di lettura</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4" />
            <span>Esempi pratici inclusi</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Progresso della Guida</h3>
          <span className="text-sm text-gray-600">
            {completedSections.size} di {guideSections.length} sezioni completate
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedSections.size / guideSections.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Guide Sections */}
      <div className="space-y-4">
        {guideSections.map((section) => {
          const isExpanded = expandedSection === section.id;
          const isCompleted = completedSections.has(section.id);

          return (
            <Card key={section.id} className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      section.importance === 'high' ? 'bg-red-100 text-red-600' :
                      section.importance === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {section.icon}
                    </div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{section.title}</span>
                        {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {section.importance === 'high' && (
                      <Badge variant="outline" className="text-red-700 border-red-300">
                        Importante
                      </Badge>
                    )}
                    {isExpanded ? 
                      <ChevronDown className="h-5 w-5 text-gray-400" /> : 
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    }
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="border-t border-gray-100">
                  {section.content}
                  <div className="flex items-center justify-end mt-6 pt-4 border-t border-gray-100">
                    <Button
                      onClick={() => markSectionComplete(section.id)}
                      disabled={isCompleted}
                      variant={isCompleted ? "outline" : "primary"}
                      size="sm"
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completato
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Segna come completato
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-indigo-900 mb-4">Pronto per iniziare?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="justify-start">
            <Plus className="h-4 w-4 mr-2" />
            Crea il tuo primo workflow
          </Button>
          <Button variant="outline" className="justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Configura un chatbot
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowGuide;