// Importamos la librería necesaria para hacer peticiones HTTP
const fetch = require('node-fetch');

// Función principal que ejecuta el script
async function activarWorkflowYEnviarCorreo() {
    // Obtenemos los datos del formulario (los recibe como variables de entorno)
    const tipo_doc = process.env.TIPO_DOC;
    const num_doc = process.env.NUM_DOC;
    const correo = process.env.CORREO;

    // Validamos que los datos no estén vacíos
    if (!tipo_doc || !num_doc || !correo) {
        console.error("❌ Error: Faltan datos del formulario");
        process.exit(1);
    }

    // Generamos el código de validación de 6 dígitos
    const codigoValidacion = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`✅ Código generado: ${codigoValidacion}`);

    try {
        // Datos que enviamos al workflow de envío de correo
        const payload = {
            event_type: "send-code",
            client_payload: {
                tipo_doc: tipo_doc,
                num_doc: num_doc,
                correo: correo,
                codigo: codigoValidacion
            }
        };

        // Llamada a GitHub API para activar el workflow
        const respuestaGitHub = await fetch(
            "https://api.github.com/repos/Misemilla2025/formularios-la-bendicion/dispatches",
            {
                method: "POST",
                headers: {
                    "Authorization": `token ${process.env.GH_TOKEN}`,
                    "Accept": "application/vnd.github.v3+json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        if (respuestaGitHub.ok) {
            console.log("✅ Workflow activado correctamente - Revisa tu correo");
            process.exit(0);
        } else {
            const errorGitHub = await respuestaGitHub.json();
            console.error(`❌ Error en GitHub API: ${errorGitHub.message}`);
            process.exit(1);
        }
    } catch (error) {
        console.error(`❌ Fallo general del script: ${error.message}`);
        process.exit(1);
    }
}

// Ejecutamos la función
activarWorkflowYEnviarCorreo();
      
