define (require, exports, module) ->
    'use strict'
        
    ## Brackets Module
    ProjectManager = brackets.getModule 'project/ProjectManager'
    nodeConnection = brackets.getModule 'utils/NodeConnection'
    ExtensionUtils = brackets.getModule 'utils/ExtensionUtils'
    Dialogs = brackets.getModule "widgets/Dialogs"
    Menus = brackets.getModule 'command/Menus'
    CommandManager = brackets.getModule 'command/CommandManager'
    
    ## UI Module
    utfUI   =   require './ui' 
    
    ## Variables
    @currentItem
    @nodeConnection
    
    ## Not exposed
    chain = () ->
        functions = Array.prototype.slice.call(arguments, 0);
        if functions.length > 0
            firstFunction = functions.shift
            firstPromise = firstFunction.call
            firstPromise.done () -> chain.apply null, functions
    
    
    ## Init
    init = () ->
        @nodeConnection = new NodeConnection
        connect () =>
            connectionPromise = @nodeConnection.connect(true)
            connectionPromise.fail -> console.error '[UTF8-Converter] failed to establish a connection with Node'
            connectionPromise
        loadUtfDomain () =>
            path = ExtensionUtils.getModulePath module, 'node/brutfDomain'
            loadPromise = @nodeConnection.loadDomains [path], true
            loadPromise.fail () -> console.log '[UTF8-Converter] failed to load domain'
            loadPromise.done () -> console.log '[UTF8-Converter] successfully loaded'
            loadPromise
        chain connect, loadUtfDomain
        
        MY_COMMAND_ID = 'brutf.detectEncoding'
        CommandManager.register 'Detect Encoding', MY_COMMAND_ID, @handleDetectEncoding
        Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU).addMenuItem MY_COMMAND_ID
    
    ## Convert process
    convertFile = () ->
        @currentItem = $(this)
        convertPromise = @nodeConnection.domains.utfconverter.convertFileEncoding @currentItem.data('file')
        
        convertPromise.fail ->
            console.log('[UTF8-Converter] failed to convert the file')
            
        convertPromise.done (newFilePath) ->
            console.log '[UTF8-Converter] converted a file'
            @currentItem.html('Converted')
       
    ## Detection process
    detectEncoding = () ->
        encodingPromise = @nodeConnection.domains.azenc.getFilesEncoding(ProjectManager.getSelectedItem()._path.toString())
        
        encodingPromise.fail (err) -> console.error '[UTF8-Converter] failed to detect encoding of files', err
        encodingPromise.done (data) -> utfUI.showPanel data.files
        encodingPromise
    
    ## Main handler
    handleDetectEncoding = () -> 
        if ProjectManager.getSelectedItem()._isDirectory
            chain brutfCore.detectEncoding 
        else
            Dialogs.showModalDialog '', 'UTF8-Converter', 'You must select a <b>directory</b> to detect encodings.<br />This extension doesn\'t work with a single files.'
        null
    
    ## Exports
    exports.init = init
    exports.convertFile = convertFile
    exports.detectEncoding = detectEncoding
    exports.handleDetectEncoding = handleDetectEncoding
    return