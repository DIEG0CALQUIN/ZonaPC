function validarRutEnvio(input) {
          const rut = input.value.trim();
          const label = document.getElementById('rut-label');
          if (!rut) {
            if (label) {
              label.textContent = 'RUT';
              label.style.color = '';
            }
            input.style.borderColor = '';
            return;
          }
          if (!esRutValido(rut)) {
            if (label) {
              label.textContent = 'RUT inválido';
              label.style.color = '#ff4d4d';
            }
            input.style.borderColor = '#ff4d4d';
          } else {
            if (label) {
              label.textContent = 'RUT';
              label.style.color = '';
            }
            input.style.borderColor = '';
          }
        }

        function esRutValido(rut) {
          rut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
          if (rut.length < 8) return false;
          let cuerpo = rut.slice(0, -1);
          let dv = rut.slice(-1);
          let suma = 0, multiplo = 2;
          for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += parseInt(cuerpo[i]) * multiplo;
            multiplo = multiplo === 7 ? 2 : multiplo + 1;
          }
          let dvEsperado = 11 - (suma % 11);
          dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
          return dv === dvEsperado;
        }
