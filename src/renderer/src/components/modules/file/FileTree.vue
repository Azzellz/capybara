<template>
  <NTree
    cascade
    checkable
    block-line
    expand-on-click
    :data="fileTree"
    :node-props="nodeProps"
    :selectable="false"
    checkbox-placement="right"
    :checked-keys="selectedFiles.map((file) => file.path)"
    :on-update:expanded-keys="handleUpdatePrefixWithExpaned"
    :on-update:checked-keys="handleUpdateCheckedFiles"
  />
</template>

<script setup lang="ts">
import type { ClientFile, FileSyncStatus } from '@shared/types/client'
import { NTree, NIcon, TreeOption } from 'naive-ui'
import { computed, h } from 'vue'
import { FileTrayFullOutline, Folder, FolderOpenOutline } from '@vicons/ionicons5'

interface FileTreeNode extends TreeOption {
  file: ClientFile
}

const props = defineProps<{
  files: ClientFile[]
  statusGetter: (path: string) => FileSyncStatus | undefined
}>()

const selectedFiles = defineModel<ClientFile[]>('selected-files', {
  required: true
})

const statusTextStyleMap: Record<FileSyncStatus, string> = {
  waiting: 'text-gray-500',
  downloading: 'text-blue-500',
  uploading: 'text-yellow-500',
  completed: 'text-green-500',
  failed: 'text-red-500'
}

function handleUpdatePrefixWithExpaned(
  _keys: Array<string | number>,
  _option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null
    action: 'expand' | 'collapse' | 'filter'
  }
): void {
  if (!meta.node) return
  switch (meta.action) {
    case 'expand':
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(FolderOpenOutline)
        })
      break
    case 'collapse':
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(Folder)
        })
      break
  }
}

function handleUpdateCheckedFiles(
  _keys: Array<string | number>,
  option: Array<TreeOption | null>
): void {
  selectedFiles.value = option
    .filter((opt): opt is TreeOption => opt !== null)
    .map((opt) => (opt as FileTreeNode).file)
  console.log('Selected files:', selectedFiles.value)
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function nodeProps({ option }: { option: TreeOption }) {
  return {
    onClick() {
      console.log(option.label)
    }
  }
}

function createFileTreeNode(file: ClientFile): TreeOption {
  return {
    file,
    key: file.path,
    label: file.name || file.path,
    disabled: false,
    prefix: () =>
      h(NIcon, null, {
        default: () => h(file.isDir ? Folder : FileTrayFullOutline)
      }),
    suffix() {
      const status = props.statusGetter(file.path)
      if (!status) return null
      return h('span', { class: statusTextStyleMap[status] }, status)
    },
    children: file.children ? file.children.map((child) => createFileTreeNode(child)) : void 0
  }
}
const fileTree = computed(() => {
  return props.files.map((file) => createFileTreeNode(file))
})
</script>
