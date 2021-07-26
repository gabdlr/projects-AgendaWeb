<div class="campos">
        <div class="campo">
            <label for="nombre">Nombre:</label>
            <input type="text" 
                    placeholder="Nombre contacto" 
                    id="nombre"
                    value="<?php echo ($contacto['nombre']) ? $contacto[nombre] : '';?>">
        </div>
        <div class="campo">
            <label for="empresa">Empresa:</label>
            <input type="text" 
                    placeholder="Empresa contacto" 
                    id="empresa"
                    value="<?php echo ($contacto['empresa']) ? $contacto[empresa] : '';?>">
        </div>
        <div class="campo">
            <label for="telefono">Teléfono:</label>
            <input type="tel" 
                    placeholder="Teléfono contacto" 
                    id="telefono"
                    value="<?php echo ($contacto['telefono']) ? $contacto[telefono] : ''; ?>">
        </div>
    </div>
    <div class="campo enviar">
            <?php 
            $textobtn = ($contacto['telefono']) ? 'Guardar' : 'Añadir';
            $accion = ($contacto['telefono']) ? 'editar' : 'crear' ;
            
            ?>
            <input type="hidden" id="accion" value="<?php echo $accion; ?>">
            <?php if(isset( $contacto['id'])) {?>
                <input type="hidden" id="id" value="<?php echo $contacto['id']; ?>">
            <?php } ?>
            <input type="submit" value="<?php echo $textobtn; ?>">
    </div>