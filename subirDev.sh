

#!/bin/bash

echo 'subir por ssh con rsync'
echo 'Asegurate estar conectado a la vpn'
echo 'Solo se van a actualizar los archivos donde se detecten cambios'

echo 'Introduce clave de omvs0006:'
# -n --> dry run , simula la copia pero no hace nada , quitar la n para ejecutar esto
# excluimos todos los achivos que empiezen por . para no enviar .env y otros ocultos

SOURCE=dist
TARGET=/var/www/aritmates/

rama_actual=$(git rev-parse --abbrev-ref HEAD)
commit_actual=$(git rev-parse HEAD)

printf "usuario: $USER \nRama git: $rama_actual $commit_actual \n" > ./dist/subida

rsync -vae 'ssh ' --progress \
    --exclude=".*" \
    --exclude="*.md" \
    ./${SOURCE}/ \
    root@omvs0006.medusa.gobiernodecanarias.net:${TARGET}

# enviamos el .htaccess que no se envio antes
rsync -vae 'ssh ' --progress \
    ./${SOURCE}/public/.htaccess \
    root@omvs0006.medusa.gobiernodecanarias.net:${TARGET}public/.htaccess


echo  "hay que cambiar los permisos en dev"
echo "---"
echo " ssh root@omvs0006"
echo "   cd $TARGET"
echo "   chown fer:apache -R *"
